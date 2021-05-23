const invoicr = {};

invoicr.$addRowBtn = $('#addRowBtn');
invoicr.$rowAddRowBtn = invoicr.$addRowBtn.closest('.row');
invoicr.$form = $('form'); 
invoicr.$taxInput = $('#tax');
invoicr.$taxValue = $('#tax').val() / 100;
invoicr.$items = $('.items');
invoicr.$subtotal = $('#subtotal');
invoicr.$total = $('#total');
invoicr.itemAmounts = [];

invoicr.getItemAmount = (price, quantity) => {
    return price * quantity;
}

invoicr.getSubTotal = (amounts) => {
    invoicr.subTotalAmount = 0;
    amounts.forEach(function(amount, i){
        invoicr.subTotalAmount = invoicr.subTotalAmount + amount;
    });

    invoicr.$subtotal.html(`$${invoicr.subTotalAmount.toFixed(2)}`);
}

invoicr.getTotal = () => {
    let totalAmount = (invoicr.subTotalAmount * (invoicr.$taxValue + 1));
    invoicr.$total.html(`$${totalAmount.toFixed(2)}`);
}

invoicr.init = function(){
    invoicr.$addRowBtn.on('click', function(){
        invoicr.$form.toggleClass('d-none d-flex');
        $('#item').focus();
        invoicr.$rowAddRowBtn.hide();
    });

    invoicr.$items.on('click', 'div i',function(){
        const itemIndex = $(this).closest('.row').index();
        invoicr.itemAmounts.splice(itemIndex, 1);
        $(this).closest('.row').remove();

        invoicr.getSubTotal(invoicr.itemAmounts);
        invoicr.getTotal();
    });

    invoicr.$taxInput.on('change', function(){
        invoicr.$taxInput.attr('value', $(this).val());
        invoicr.$taxValue = $(this).val() / 100;

        if (invoicr.itemAmounts.length > 0) {
            invoicr.getTotal();
        }
    });
    
    invoicr.$form.on('submit', function(e) {
        e.preventDefault();

        const $item = $('#item').val();
        const $price = $('#price').val();
        const $quantity = $('#quantity').val();
        const itemAmount = invoicr.getItemAmount($price, $quantity);

        invoicr.$items.append(`
            <div class="row position-relative py-2">
                <div class="col-3 col-md-5 d-flex">
                    <p class="mb-0">${$item}</p>
                </div>
                <div class="col-3 col-md-2 d-flex justify-content-end">
                    <p class="mb-0">${parseFloat($price).toFixed(2)}</p>
                </div>
                <div class="col-3 col-md-2 d-flex justify-content-end">
                    <p class="mb-0">${$quantity}</p>
                </div>
                <div class="col-3 d-flex justify-content-end">
                    <p class="mb-0">${itemAmount.toFixed(2)}</p>
                </div>

                <i class="far fa-times-circle"></i>
            </div>
        `);

        invoicr.itemAmounts.push(itemAmount);

        invoicr.getSubTotal(invoicr.itemAmounts);
        invoicr.getTotal();

        invoicr.$form.toggleClass('d-none d-flex');
        invoicr.$form.trigger('reset');
        invoicr.$rowAddRowBtn.show();

    });
}

$(function(){
    invoicr.init();
});