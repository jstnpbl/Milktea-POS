$(function () {
    // State
    let cart = [];
    let currentItem = null;
    let salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    let orderNumber = parseInt(localStorage.getItem('orderNumber')) || 1;

    // Tab switching
    $('.nav-tab').click(function () {
        $('.nav-tab').removeClass('active');
        $(this).addClass('active');
        $('.tab-content').hide();
        $(`#${$(this).data('tab')}-tab`).show();
        if ($(this).data('tab') === 'sales') updateSalesDisplay();
    });

    // Show menu tab by default
    $('#menu-tab').show();

    // Menu item click (open toppings modal)
    $('.menu-item').click(function () {
        currentItem = {
            name: $(this).data('name'),
            price: parseFloat($(this).data('price')),
            toppings: []
        };
        $('#toppings-modal input[type="checkbox"]').prop('checked', false);
        $('#toppings-modal').show();
    });

    // Add to cart from toppings modal
    $('#add-to-cart').click(function () {
        let selectedToppings = [];
        let toppingsPrice = 0;
        $('#toppings-modal input[type="checkbox"]:checked').each(function () {
            let toppingName = $(this).closest('.topping-item').find('.topping-name').text();
            let toppingPrice = parseFloat($(this).val());
            selectedToppings.push({ name: toppingName, price: toppingPrice });
            toppingsPrice += toppingPrice;
        });
        currentItem.toppings = selectedToppings;
        currentItem.totalPrice = currentItem.price + toppingsPrice;
        currentItem.quantity = 1;
        currentItem.id = Date.now() + Math.random();

        // Check for same item with same toppings
        let existing = cart.find(item =>
            item.name === currentItem.name &&
            JSON.stringify(item.toppings) === JSON.stringify(currentItem.toppings)
        );
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push(currentItem);
        }
        updateCartDisplay();
        $('#toppings-modal').hide();
    });

    // Cancel toppings modal
    $('#cancel-toppings, #toppings-modal .close').click(function () {
        $('#toppings-modal').hide();
    });

    // Quick add (no toppings)
    $('.quick-add-btn').click(function (e) {
        e.stopPropagation();
        let name = $(this).closest('.menu-item').data('name');
        let price = parseFloat($(this).closest('.menu-item').data('price'));
        let item = {
            name,
            price,
            toppings: [],
            totalPrice: price,
            quantity: 1,
            id: Date.now() + Math.random()
        };
        let existing = cart.find(i => i.name === name && i.toppings.length === 0);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push(item);
        }
        updateCartDisplay();
    });

    // Cart display
    function updateCartDisplay() {
        let $cart = $('#cart-items');
        if (cart.length === 0) {
            $cart.html('<div class="empty-cart">Cart is empty</div>');
            $('#checkout-btn').prop('disabled', true);
            updateTotals();
            return;
        }
        let html = '';
        cart.forEach(item => {
            let toppingsText = item.toppings.length > 0
                ? item.toppings.map(t => t.name).join(', ')
                : 'No toppings';
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-header">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${(item.totalPrice * item.quantity).toFixed(2)}</div>
                    </div>
                    <div class="toppings-section"><strong>Toppings:</strong> ${toppingsText}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="qty-btn decrease-qty" data-id="${item.id}">-</button>
                            <input type="number" class="qty-input" value="${item.quantity}" data-id="${item.id}" min="1" step="1">
                            <button class="qty-btn increase-qty" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-btn" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
        });
        $cart.html(html);
        $('#checkout-btn').prop('disabled', false);
        updateTotals();
    }

    // Quantity controls
    $('#cart-items').on('click', '.increase-qty', function () {
        let id = $(this).data('id');
        let item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += 1;
            updateCartDisplay();
        }
    });
    $('#cart-items').on('click', '.decrease-qty', function () {
        let id = $(this).data('id');
        let item = cart.find(i => i.id === id);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            updateCartDisplay();
        }
    });
    $('#cart-items').on('change', '.qty-input', function () {
        let id = $(this).data('id');
        let newQty = parseInt($(this).val());
        if (isNaN(newQty) || newQty < 1) newQty = 1;
        let item = cart.find(i => i.id === id);
        if (item) {
            item.quantity = newQty;
            updateCartDisplay();
        }
    });
    $('#cart-items').on('click', '.remove-btn', function () {
        let id = $(this).data('id');
        cart = cart.filter(i => i.id !== id);
        updateCartDisplay();
    });

    // Totals
    function updateTotals() {
        let subtotal = cart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
        let discountPercent = parseInt($('#discount').val()) || 0;
        if (discountPercent < 0) discountPercent = 0;
        if (discountPercent > 100) discountPercent = 100;
        $('#discount').val(discountPercent);
        let discountAmount = subtotal * (discountPercent / 100);
        let discountedSubtotal = subtotal - discountAmount;
        let tax = discountedSubtotal * 0.085;
        let total = discountedSubtotal + tax;
        $('#subtotal').text(`$${subtotal.toFixed(2)}`);
        $('#tax').text(`$${tax.toFixed(2)}`);
        $('#total').text(`$${total.toFixed(2)}`);
    }
    $('#discount').on('input', updateTotals);

    // Checkout
    $('#checkout-btn').click(function () {
        if (cart.length === 0) return;
        let total = parseFloat($('#total').text().replace('$', ''));
        $('#payment-total').text(`$${total.toFixed(2)}`);
        $('#cash-input').val('');
        $('#change-display').hide();
        $('#complete-payment').prop('disabled', true);
        $('#payment-modal').show();
    });

    // Payment input
    $('#cash-input').on('input', function () {
        let cashAmount = parseFloat($(this).val()) || 0;
        let total = parseFloat($('#payment-total').text().replace('$', ''));
        if (cashAmount >= total) {
            let change = cashAmount - total;
            $('#change-amount').text(change.toFixed(2));
            $('#change-display').show();
            $('#complete-payment').prop('disabled', false);
        } else {
            $('#change-display').hide();
            $('#complete-payment').prop('disabled', true);
        }
    });

    // Complete payment
    $('#complete-payment').click(function () {
        let cashAmount = parseFloat($('#cash-input').val());
        let total = parseFloat($('#payment-total').text().replace('$', ''));
        let change = cashAmount - total;
        generateReceipt(cashAmount, change);

        // Save sales history
        let order = {
            orderNumber: orderNumber++,
            items: [...cart],
            subtotal: parseFloat($('#subtotal').text().replace('$', '')),
            tax: parseFloat($('#tax').text().replace('$', '')),
            discount: parseInt($('#discount').val()) || 0,
            total: total,
            cashReceived: cashAmount,
            change: change,
            timestamp: new Date().toLocaleString()
        };
        salesHistory.push(order);
        localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
        localStorage.setItem('orderNumber', orderNumber);

        $('#payment-modal').hide();
        $('#receipt-modal').show();
    });

    // Generate receipt
    function generateReceipt(cashAmount, change) {
        let subtotal = parseFloat($('#subtotal').text().replace('$', ''));
        let tax = parseFloat($('#tax').text().replace('$', ''));
        let discount = parseInt($('#discount').val()) || 0;
        let total = parseFloat($('#total').text().replace('$', ''));
        let receiptHTML = `
            <div class="receipt-header">
                <h3>TEA BLISS</h3>
                <p>123 Bubble Tea Street</p>
                <p>Sweet City, SC 12345</p>
                <p>(555) 123-BOBA</p>
                <p>Order #${orderNumber - 1}</p>
                <p>${new Date().toLocaleString()}</p>
            </div>
            <div class="receipt-items">
        `;
        cart.forEach(item => {
            receiptHTML += `
                <div class="receipt-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${(item.totalPrice * item.quantity).toFixed(2)}</span>
                </div>
            `;
            if (item.toppings.length > 0) {
                item.toppings.forEach(topping => {
                    receiptHTML += `
                        <div class="receipt-item" style="font-size: 0.9em; margin-left: 1rem; color: #666;">
                            <span>+ ${topping.name}</span>
                            <span>$${topping.price.toFixed(2)}</span>
                        </div>
                    `;
                });
            }
        });
        receiptHTML += `
            </div>
            <div class="receipt-total">
                <div class="receipt-item"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
        `;
        if (discount > 0) {
            receiptHTML += `
                <div class="receipt-item"><span>Discount (${discount}%):</span><span>-$${(subtotal * discount / 100).toFixed(2)}</span></div>
            `;
        }
        receiptHTML += `
                <div class="receipt-item"><span>Tax (8.5%):</span><span>$${tax.toFixed(2)}</span></div>
                <div class="receipt-item" style="font-size: 1.2em; border-top: 1px solid #333; padding-top: 0.5rem;">
                    <span><strong>Total:</strong></span>
                    <span><strong>$${total.toFixed(2)}</strong></span>
                </div>
                <div class="receipt-item"><span>Cash:</span><span>$${cashAmount.toFixed(2)}</span></div>
                <div class="receipt-item"><span>Change:</span><span>$${change.toFixed(2)}</span></div>
            </div>
            <div style="margin-top: 1rem; text-align: center; font-size: 0.9em;">
                <p>Thank you for your business!</p>
                <p>Come back for more delicious bubble tea!</p>
            </div>
        `;
        $('#receipt-content').html(receiptHTML);
    }

    // Print receipt
    $('#print-receipt').click(function () {
        let printContent = $('#receipt-content').html();
        let win = window.open('', '_blank');
        win.document.write(`
            <html>
            <head>
                <title>Receipt</title>
                <style>
                    body { font-family: 'Courier New', monospace; line-height: 1.6; max-width: 300px; margin: 0 auto; }
                    .receipt-header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 1rem; margin-bottom: 1rem; }
                    .receipt-item { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
                    .receipt-total { border-top: 2px dashed #333; padding-top: 1rem; margin-top: 1rem; }
                </style>
            </head>
            <body>${printContent}</body>
            </html>
        `);
        win.document.close();
        win.print();
    });

    // New order
    $('#new-order').click(function () {
        cart = [];
        $('#discount').val(0);
        $('#receipt-modal').hide();
        updateCartDisplay();
    });

    // Update sales display
    function updateSalesDisplay() {
        let totalOrders = salesHistory.length;
        let totalRevenue = salesHistory.reduce((sum, order) => sum + order.total, 0);
        $('#total-orders').text(totalOrders);
        $('#total-revenue').text(`$${totalRevenue.toFixed(2)}`);
        let $salesHistory = $('#sales-history');
        if (salesHistory.length === 0) {
            $salesHistory.html('<div class="empty-sales">No orders yet today</div>');
        } else {
            let salesHTML = `
                <table class="sales-table">
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Time</th>
                            <th>Items</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            salesHistory.slice().reverse().forEach(order => {
                let itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                salesHTML += `
                    <tr>
                        <td>#${order.orderNumber}</td>
                        <td>${order.timestamp}</td>
                        <td>${itemCount} items</td>
                        <td>$${order.total.toFixed(2)}</td>
                    </tr>
                `;
            });
            salesHTML += '</tbody></table>';
            $salesHistory.html(salesHTML);
        }
    }

    // Modal close and cancel
    $('.modal .close, #cancel-payment').click(function () {
        $(this).closest('.modal').hide();
    });

    // Click outside modal to close
    $(window).click(function (event) {
        if ($(event.target).hasClass('modal')) {
            $(event.target).hide();
        }
    });

    // Keyboard shortcuts for modals
    $('#toppings-modal').on('keypress', function (e) {
        if (e.key === 'Enter') $('#add-to-cart').click();
    });
    $('#payment-modal').on('keypress', function (e) {
        if (e.key === 'Enter') $('#complete-payment').click();
    });

    // Add Drink Modal logic
    $('.add-drink-btn').click(function () {
        // Find which category this button belongs to
        const $category = $(this).closest('.menu-category');
        $('#add-drink-category').val($category.index('.menu-category'));
        $('#new-drink-name').val('');
        $('#new-drink-price').val('');
        $('#new-drink-icon').val('');
        $('#add-drink-modal').show();
        $('#new-drink-name').focus();
    });

    // Close modal
    $('#close-add-drink-modal, #cancel-add-drink').click(function () {
        $('#add-drink-modal').hide();
    });

    // Add new drink
    $('#add-drink-form').submit(function (e) {
        e.preventDefault();
        const name = $('#new-drink-name').val().trim();
        const price = parseFloat($('#new-drink-price').val());
        const icon = $('#new-drink-icon').val().trim() || '🧋';
        const categoryIdx = parseInt($('#add-drink-category').val(), 10);

        if (!name || isNaN(price)) return;

        // Find the correct menu-grid
        const $category = $('.menu-category').eq(categoryIdx);
        const $grid = $category.find('.menu-grid');

        // Create new drink HTML
        const $item = $(`
            <div class="menu-item" data-name="${name}" data-price="${price.toFixed(2)}">
                <div class="item-icon">${icon}</div>
                <div class="item-name">${name}</div>
                <div class="item-price">$${price.toFixed(2)}</div>
                <button type="button" class="quick-add-btn">+ Quick Add</button>
            </div>
        `);

        // Add to grid
        $grid.append($item);

        // Hide modal
        $('#add-drink-modal').hide();
    });

    // Make new drinks clickable for toppings and quick add
    $(document).on('click', '.menu-item', function (e) {
        // Prevent quick add from triggering toppings modal
        if ($(e.target).hasClass('quick-add-btn')) return;
        // Existing toppings modal logic here (reuse your code)
        // You may need to refactor your toppings modal logic into a function if not already
        // For now, trigger click on the original .menu-item logic
        $(this).trigger('menuitem:clicked');
    });
    $(document).on('click', '.quick-add-btn', function (e) {
        e.stopPropagation();
        // Existing quick add logic here (reuse your code)
        $(this).closest('.menu-item').trigger('quickadd:clicked');
    });
});