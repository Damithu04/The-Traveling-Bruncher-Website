document.addEventListener('DOMContentLoaded', function () {
    // Load menu from XML
    fetch('order.xml')
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, "text/xml"))
        .then(xml => {
            // Select the main content container
            const mainContent = document.querySelector('.main-content');

            // Process each category in the XML
            xml.querySelectorAll('category').forEach(category => {
                // Create a new menu container for each category
                const menuContainer = document.createElement('div');
                menuContainer.className = 'menu-container';

                // Add category title
                const categoryTitle = document.createElement('h1');
                categoryTitle.className = 'menutitle';
                categoryTitle.id = category.getAttribute('id');
                categoryTitle.textContent = category.getAttribute('name');
                menuContainer.appendChild(categoryTitle);

                // Process each subcategory in the category
                category.querySelectorAll('subcategory').forEach(subcategory => {
                    // Create a subcategory container
                    const subcategoryContainer = document.createElement('div');
                    subcategoryContainer.className = 'subcategory-container';

                    // Add subcategory title
                    const subcategoryTitle = document.createElement('h2');
                    subcategoryTitle.className = 'menutitle1'; // Use the CSS class for subtitles
                    subcategoryTitle.id = subcategory.getAttribute('id');
                    subcategoryTitle.textContent = subcategory.getAttribute('name');
                    subcategoryContainer.appendChild(subcategoryTitle);

                    // Process each item in the subcategory
                    subcategory.querySelectorAll('item').forEach(item => {
                        const name = item.querySelector('name')?.textContent || 'Unnamed Item';
                        const desc = item.querySelector('description')?.textContent || 'No description available';
                        const priceElement = item.querySelector('price');
                        const price = priceElement ? parseInt(priceElement.textContent) : 0;
                        const currency = priceElement?.getAttribute('currency') || '';

                        if (!name || !price) {
                            console.warn('Skipping invalid item:', item);
                            return; // Skip this item if data is missing
                        }

                        // Create a menu item
                        const menuItem = document.createElement('div');
                        menuItem.className = 'menu-item dynamic';
                        menuItem.innerHTML = `
                            <div class="item-details">
                                <h2>${name}</h2>
                                <p>${desc}</p>
                            </div>
                            <div class="item-controls">
                                <span class="price">${price.toLocaleString()} ${currency}</span>
                                <input type="number" class="quantity" min="1" value="1" aria-label="quantity">
                                <button class="add-to-cart" onclick="addToCart('${name}', ${price}, this)">
                                    Add to Cart
                                </button>
                            </div>
                        `;
                        subcategoryContainer.appendChild(menuItem);
                    });

                    // Append the subcategory container to the menu container
                    menuContainer.appendChild(subcategoryContainer);
                });

                // Process items directly under the category (if any)
                category.querySelectorAll('item').forEach(item => {
                    const name = item.querySelector('name')?.textContent || 'Unnamed Item';
                    const desc = item.querySelector('description')?.textContent || 'No description available';
                    const priceElement = item.querySelector('price');
                    const price = priceElement ? parseInt(priceElement.textContent) : 0;
                    const currency = priceElement?.getAttribute('currency') || '';

                    if (!name || !price) {
                        console.warn('Skipping invalid item:', item);
                        return; // Skip this item if data is missing
                    }

                    // Create a menu item
                    const menuItem = document.createElement('div');
                    menuItem.className = 'menu-item dynamic';
                    menuItem.innerHTML = `
                        <div class="item-details">
                            <h2>${name}</h2>
                            <p>${desc}</p>
                        </div>
                        <div class="item-controls">
                            <span class="price">${price.toLocaleString()} ${currency}</span>
                            <input type="number" class="quantity" min="1" value="1" aria-label="quantity">
                            <button class="add-to-cart" onclick="addToCart('${name}', ${price}, this)">
                                Add to Cart
                            </button>
                        </div>
                    `;
                    menuContainer.appendChild(menuItem);
                });

                // Append the menu container to the main content
                mainContent.appendChild(menuContainer);
            });
        })
        .catch(err => console.error('Error loading menu:', err));
});