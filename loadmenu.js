document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    const navContainer = document.getElementById('category-nav');
    const loader = document.getElementById('loader');

    // 1. LINKING THE XML FILE
    fetch('order.xml')
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not find order.xml file");
            }
            return response.text();
        })
        .then(str => new DOMParser().parseFromString(str, "text/xml"))
        .then(xml => {
            // Hide Loader
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }, 1000);

            // 2. PARSING XML
            const categories = xml.querySelectorAll('category');
            const fragment = document.createDocumentFragment();

            categories.forEach((category, index) => {
                const catName = category.getAttribute('name');
                const catId = 'cat-' + index;

                // Create Sidebar Link
                const navItem = document.createElement('li');
                navItem.innerHTML = `<a href="#${catId}">${catName}</a>`;
                navContainer.appendChild(navItem);

                // Create Category Section
                const section = document.createElement('section');
                section.className = 'menu-section';
                section.id = catId;
                section.innerHTML = `<h2 class="category-title">${catName}</h2>`;

                // Handle Subcategories (e.g., Brunch -> Sweet/Savory)
                const subcategories = category.querySelectorAll('subcategory');

                if (subcategories.length > 0) {
                    subcategories.forEach(sub => {
                        section.innerHTML += `<h3 class="subcategory-title">${sub.getAttribute('name')}</h3>`;
                        section.appendChild(createGrid(sub.querySelectorAll('item')));
                    });
                } else {
                    // Handle Items directly
                    section.appendChild(createGrid(category.querySelectorAll('item')));
                }

                fragment.appendChild(section);
            });

            menuContainer.appendChild(fragment);
            initScrollSpy(); // Start highlight effect
        })
        .catch(err => {
            console.error(err);
            loader.innerHTML = '<div style="color:white; text-align:center;"><h2>Error</h2><p>Check console for details.</p></div>';
        });
});

// Helper: Create Grid
function createGrid(items) {
    const grid = document.createElement('div');
    grid.className = 'menu-grid';
    items.forEach(item => grid.appendChild(createCard(item)));
    return grid;
}

// Helper: Create Card
function createCard(itemNode) {
    const name = itemNode.querySelector('name')?.textContent || 'Item';
    const desc = itemNode.querySelector('description')?.textContent || 'Freshly prepared.';
    const priceStr = itemNode.querySelector('price')?.textContent || '0';
    const price = parseInt(priceStr.replace(/[^0-9]/g, '')).toLocaleString();

    const card = document.createElement('div');
    card.className = 'menu-card fade-in-up';

    card.innerHTML = `
        <div>
            <div class="card-header">
                <h3 class="item-name">${name}</h3>
                <span class="item-price">${price} LKR</span>
            </div>
            <p class="item-desc">${desc}</p>
        </div>
        <div class="card-footer">
            <a href="Orderpage.html" class="btn-add">
                <i class="fas fa-plus"></i> Add
            </a>
        </div>
    `;
    return card;
}

// Helper: Highlight sidebar links
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