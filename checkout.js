document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutCart();

    // Hide loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }, 800);
    }
});

// Load Cart Data
function loadCheckoutCart() {
    const cart = JSON.parse(localStorage.getItem('travelingBruncherCart')) || [];
    const list = document.getElementById('checkout-items');

    // Elements for totals
    const elSubtotal = document.getElementById('summary-subtotal');
    const elDelivery = document.getElementById('summary-delivery');
    const elService = document.getElementById('summary-service');
    const elTotal = document.getElementById('summary-total');

    list.innerHTML = '';

    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-msg" style="color:#aaa;">Your cart is empty.</p>';
        updateTotals(0, 0, 0);
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const li = document.createElement('li');
        li.className = 'checkout-item';
        li.innerHTML = `
            <div>
                <span class="qty">${item.qty}x</span>
                <span class="name">${item.name}</span>
            </div>
            <div class="price">${itemTotal.toLocaleString()}</div>
        `;
        list.appendChild(li);
    });

    // Calculations
    const deliveryFee = 350; // Fixed delivery fee
    const serviceCharge = subtotal * 0.10; // 10% Service Charge
    const grandTotal = subtotal + deliveryFee + serviceCharge;

    // Update UI
    elSubtotal.innerText = subtotal.toLocaleString() + ' LKR';
    elDelivery.innerText = deliveryFee.toLocaleString() + ' LKR';
    elService.innerText = serviceCharge.toLocaleString() + ' LKR';
    elTotal.innerText = grandTotal.toLocaleString() + ' LKR';
}

function updateTotals(sub, del, serv) {
    document.getElementById('summary-subtotal').innerText = sub + ' LKR';
    document.getElementById('summary-total').innerText = (sub + del + serv) + ' LKR';
}

// Payment Selection Logic
function selectPayment(method) {
    const cards = document.querySelectorAll('.payment-card');
    const cardDetails = document.getElementById('card-details');

    cards.forEach(card => card.classList.remove('selected'));

    // Add selected class to the clicked one
    if (method === 'cash') {
        cards[0].classList.add('selected');
        cardDetails.classList.add('hidden');
    } else {
        cards[1].classList.add('selected');
        cardDetails.classList.remove('hidden');
    }
}

// Form Submission
function placeOrder() {
    // 1. Simple Validation check
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;

    if (!name || !address) {
        alert("Please fill in your Name and Address.");
        return;
    }

    // 2. Show Success Modal
    const modal = document.getElementById('success-modal');
    modal.style.display = 'flex';
}

function clearAndRedirect() {
    // Clear Cart
    localStorage.removeItem('travelingBruncherCart');
    // Redirect happens via the link's href in HTML, 
    // but this function ensures memory is cleared first.
}