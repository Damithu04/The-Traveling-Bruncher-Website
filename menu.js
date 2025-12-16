// --- GLOBAL STATE ---
let cart = JSON.parse(localStorage.getItem('travelingBruncherCart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Cart Badge
    updateCartCount();

    // Load XML
    const menuContainer = document.getElementById('menu-container');
    const navContainer = document.getElementById('category-nav');
    const loader = document.getElementById('loader');

    fetch('order.xml')
        .then(response => {
            if (!response.ok) throw new Error("Could not find order.xml");
            return response.text();
        })
        .then(str => new DOMParser().parseFromString(str, "text/xml"))
        .then(xml => {
            if (loader) {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 500);
                }, 1000);
            }

            const categories = xml.querySelectorAll('category');
            const fragment = document.createDocumentFragment();

            categories.forEach((category, index) => {
                const catName = category.getAttribute('name');
                const catId = 'cat-' + index;

                // Sidebar Link
                const navItem = document.createElement('li');
                navItem.innerHTML = `<a href="#${catId}">${catName}</a>`;
                navContainer.appendChild(navItem);

                // Section
                const section = document.createElement('section');
                section.className = 'menu-section';
                section.id = catId;
                section.innerHTML = `<h2 class="category-title">${catName}</h2>`;

                const subcategories = category.querySelectorAll('subcategory');

                if (subcategories.length > 0) {
                    subcategories.forEach(sub => {
                        section.innerHTML += `<h3 class="subcategory-title">${sub.getAttribute('name')}</h3>`;
                        section.appendChild(createGrid(sub.querySelectorAll('item')));
                    });
                } else {
                    section.appendChild(createGrid(category.querySelectorAll('item')));
                }

                fragment.appendChild(section);
            });

            menuContainer.appendChild(fragment);
            initScrollSpy();
        })
        .catch(err => {
            console.error(err);
            if (loader) loader.innerHTML = '<p style="color:white;text-align:center;">Error loading menu.</p>';
        });
});

// --- MENU CREATION ---
function createGrid(items) {
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    items.forEach(item => grid.appendChild(createCard(item)));
    return grid;
}

function createCard(itemNode) {
    const name = itemNode.querySelector('name')?.textContent || 'Item';
    const desc = itemNode.querySelector('description')?.textContent || 'Freshly prepared.';
    const priceStr = itemNode.querySelector('price')?.textContent || '0';
    const price = parseInt(priceStr.replace(/[^0-9]/g, ''));

    const card = document.createElement('div');
    card.className = 'menu-card fade-in-up';

    card.innerHTML = `
        <div>
            <div class="card-header">
                <h3 class="item-name">${name}</h3>
                <span class="item-price">${price.toLocaleString()} LKR</span>
            </div>
            <p class="item-desc">${desc}</p>
        </div>
        <div class="card-footer">
            <button class="btn-add" onclick="addToCart('${name}', ${price})">
                <i class="fas fa-plus"></i> Add
            </button>
        </div>
    `;
    return card;
}

// --- CART FUNCTIONS ---
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ name: name, price: price, qty: 1 });
    }

    saveCart();
    updateCartCount();
    showToast(`${name} added to cart!`);
}

function saveCart() {
    localStorage.setItem('travelingBruncherCart', JSON.stringify(cart));
}

function updateCartCount() {
    const badge = document.getElementById('cart-count');
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) badge.innerText = totalQty;
}

// --- CART MODAL UI ---
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        renderCartItems();
        modal.style.display = "block";
    }
}

function renderCartItems() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total-price');
    list.innerHTML = '';

    let total = 0;

    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-msg" style="color:#aaa; text-align:center;">Your cart is empty.</p>';
        totalEl.innerText = '0 LKR';
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>${item.price.toLocaleString()} LKR</span>
            </div>
            <div class="cart-controls">
                <button class="cart-btn" onclick="changeQty(${index}, -1)">-</button>
                <span style="color:white;">${item.qty}</span>
                <button class="cart-btn" onclick="changeQty(${index}, 1)">+</button>
                <button class="btn-delete" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    });

    totalEl.innerText = total.toLocaleString() + ' LKR';
}

function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    renderCartItems();
    updateCartCount();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCartItems();
    updateCartCount();
}

// --- TOAST NOTIFICATION ---
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "show";
    setTimeout(function () { toast.className = toast.className.replace("show", ""); }, 3000);
}

// --- SCROLL SPY ---
function initScrollSpy() {
    const sections = document.querySelectorAll('.menu-section');
    const navLinks = document.querySelectorAll('.menu-sidebar a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: [0.1, 0.3], rootMargin: "-20% 0px -60% 0px" });

    sections.forEach(section => observer.observe(section));
}

// Close Cart when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('cart-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}