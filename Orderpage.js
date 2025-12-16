// Retrieve cart from localStorage or initialize an empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScrolling();
    updateCartUI();
});

// Setup smooth scrolling for all navigation links
function setupSmoothScrolling() {
    // Get all anchor links within the navigation
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    // Add click event listener to each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's not the active page link
            if (!this.classList.contains('activepage') || this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                // Get the target element ID from the href attribute
                const targetId = this.getAttribute('href');
                if (targetId === '#') return; // Skip if href is just '#'
                
                const targetElement = document.querySelector(targetId);
                
                // If the target element exists, scroll to it smoothly
                if (targetElement) {
                    // Calculate the position with offset for fixed header
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 100;
                    
                    // Scroll to the element
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Function to update item quantity
function updateQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

// Function to remove an item completely
function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Open and close pop-up functions
function openPopup() {
    document.getElementById("cart-popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("cart-popup").style.display = "none";
}

// Close pop-up when clicking outside
window.addEventListener("click", function(event) {
    let popup = document.getElementById("cart-popup");
    if (event.target === popup) {
        closePopup();
    }
});

// Function to update cart display
function updateCartUI() {
    let cartItems = document.getElementById("cart-items");
    let totalDisplay = document.getElementById("total-price");
    let cartBadge = document.getElementById("cart-badge");

    if (!cartItems || !totalDisplay || !cartBadge) return;

    cartItems.innerHTML = "";
    totalPrice = 0;
    let totalItems = 0; // Track total quantity of items

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.qty;
        totalPrice += itemTotal;
        totalItems += item.qty; // Count all items

        let listItem = document.createElement("li");
        listItem.innerHTML = `
            ${item.name} x${item.qty} - ${itemTotal} LKR 
            <button style="color: white; background-color:red; border: none; padding: 2px 4px; font-size: 11px;" onclick="updateQty(${index}, -1)">-</button>
            <button style="color: white; background-color:green; border: none; padding: 2px 4px; font-size: 11px;" onclick="updateQty(${index}, 1)">+</button>
            <button style="color: white; background: none; border: none; color: inherit; padding: 2px 4px; font-size: 11px;" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button>
        `;
        cartItems.appendChild(listItem);
    });

    totalDisplay.textContent = totalPrice;
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update Cart Badge
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = "inline-block"; // Show badge
    } else {
        cartBadge.style.display = "none"; // Hide if empty
    }
}

// Function to add items to the cart
function addToCart(itemName, price, button) {
    let quantity = parseInt(button.previousElementSibling.value);
    if (quantity <= 0) return;

    let existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.qty += quantity;
    } else {
        cart.push({ name: itemName, price: price, qty: quantity });
    }

    totalPrice += price * quantity;
    updateCartUI();

    // Show custom toast notification
    showToast(`${quantity} x ${itemName} added to cart!`);
}

// Function to display the toast notification
function showToast(message) {
    let toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); // Hide after 3 seconds
}