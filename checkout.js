// Retrieve cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0); // Calculate subtotal

// Fixed charges
const deliveryFee = 99.00;
const serviceFee = 112.75;

// Calculate final total
let finalTotal = subtotal + deliveryFee + serviceFee;

// Function to update checkout page UI
function updateCheckoutUI() {
    let cartTitle = document.getElementById("cart-title");
    let subtotalDisplay = document.getElementById("subtotal");
    let finalTotalDisplay = document.getElementById("final-total");

    if (!cartTitle || !subtotalDisplay || !finalTotalDisplay) return;

    cartTitle.textContent = `Cart summary (${cart.length} items)`;
    subtotalDisplay.textContent = `LKR ${subtotal.toFixed(2)}`;
    finalTotalDisplay.textContent = `LKR ${finalTotal.toFixed(2)}`;
}

if (document.getElementById("cart-title")) {
    updateCheckoutUI();
}

// Handle order placement with validation
document.querySelector(".place-order-btn").addEventListener("click", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();

    document.querySelectorAll(".error").forEach(e => e.remove());
    let isValid = true;

    // Validate Name
    if (name === "") {
        showError("name", "Name is required!");
        isValid = false;
    }

    // Validate Email
    if (!email.includes("@") || !email.includes(".")) {
        showError("email", "Enter a valid email address!");
        isValid = false;
    }

    // Validate Phone Number (10 digits only)
    if (!/^\d{10}$/.test(phone)) {
        showError("phone", "Enter a valid 10-digit phone number!");
        isValid = false;
    }

    if (isValid) {
        // Replace alert with success error message
        showSuccessMessage("Your order has been placed successfully");
        
        // Clear localStorage items
        localStorage.removeItem("cart");
        localStorage.removeItem("userName");
        localStorage.removeItem("userAddress");
        localStorage.removeItem("userPhone");
        localStorage.removeItem("paymentMethod");
        
        // Redirect after a short delay to show the success message
        setTimeout(() => {
            window.location.href = "orderpage.html";
        }, 2000);
    }
});

// Function to show error messages
function showError(inputId, message) {
    let inputField = document.getElementById(inputId);
    let errorElement = document.createElement("span");
    errorElement.className = "error";
    errorElement.style.color = "red";
    errorElement.textContent = message;
    inputField.parentNode.insertBefore(errorElement, inputField.nextSibling);
}

// Function to show success message
function showSuccessMessage(message) {
    // Create a div for the success message
    let successElement = document.createElement("div");
    successElement.className = "success-message";
    successElement.style.color = "green";
    successElement.style.backgroundColor = "#e8f5e9";
    successElement.style.padding = "15px";
    successElement.style.marginTop = "20px";
    successElement.style.borderRadius = "5px";
    successElement.style.textAlign = "center";
    successElement.style.fontWeight = "bold";
    successElement.textContent = message;
    
    // Find a suitable place to insert the message
    const form = document.querySelector("form") || document.body;
    form.insertBefore(successElement, form.firstChild);
    
    // Scroll to make message visible
    successElement.scrollIntoView({ behavior: 'smooth' });
}

// Toggle card payment details visibility
const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
const cardDetails = document.getElementById('card-details');

paymentMethods.forEach((method) => {
    method.addEventListener('change', () => {
        cardDetails.style.display = (document.querySelector('input[name="payment_method"]:checked').value === 'card') ? 'block' : 'none';
    });
});

// Format card number
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join('-') || value;
    input.value = formattedValue;
}

// Save form data in localStorage
document.querySelectorAll("input[name='name'], input[name='address'], input[name='phone']").forEach(input => {
    input.addEventListener('input', (e) => {
        localStorage.setItem(e.target.name, e.target.value);
    });
});

document.querySelectorAll('input[name="payment_method"]').forEach((method) => {
    method.addEventListener('change', (e) => {
        localStorage.setItem('paymentMethod', e.target.value);
    });
});

// Load saved form data
function loadFormData() {
    const fields = ['userName', 'userAddress', 'userPhone', 'paymentMethod'];
    fields.forEach(field => {
        const value = localStorage.getItem(field);
        if (value) {
            let input = document.querySelector(`input[name='${field.replace('user', '').toLowerCase()}']`);
            if (input) input.value = value;
        }
    });

    const paymentMethod = localStorage.getItem('paymentMethod');
    if (paymentMethod) {
        const paymentInput = document.querySelector(`input[name='payment_method'][value='${paymentMethod}']`);
        if (paymentInput) paymentInput.checked = true;
        if (paymentMethod === 'card') cardDetails.style.display = 'block';
    }
}

window.addEventListener('load', loadFormData);