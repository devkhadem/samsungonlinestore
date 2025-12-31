document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.querySelector('.total-price');
    const cartCountElements = document.querySelectorAll('.cart-count');
    const cartIcons = document.querySelectorAll('.cart-icon');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Hamburger Menu Elements
    const hamburger = document.querySelector('.hamburger');
    const closeIcon = document.querySelector('.close-icon');
    const navLinksContainer = document.querySelector('.nav-links-container');

    // Cart State
    let cart = [];

    // --- Functions ---

    // Open Cart Sidebar
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }

    // Close Cart Sidebar
    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    // Add Item to Cart
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        updateCartUI();
        openCart();
    }

    // Remove Item from Cart
    function removeFromCart(productName) {
        cart = cart.filter(item => item.name !== productName);
        updateCartUI();
    }

    // Update Item Quantity
    function updateQuantity(productName, change) {
        const item = cart.find(item => item.name === productName);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(productName);
            } else {
                updateCartUI();
            }
        }
    }

    // Update Cart UI (HTML)
    function updateCartUI() {
        // Update Cart Count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => el.textContent = totalItems);

        // Update Total Price
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `$${totalPrice.toFixed(2)}`;

        // Update Cart Items List
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="decrease-qty" data-name="${item.name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-qty" data-name="${item.name}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-name="${item.name}"><i class="fas fa-trash"></i></button>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        // Attach Event Listeners to new buttons
        attachCartListeners();
    }

    // Attach listeners to dynamic cart elements
    function attachCartListeners() {
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                updateQuantity(name, -1);
            });
        });

        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                updateQuantity(name, 1);
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Handle click on icon or button
                const button = e.target.closest('.remove-item');
                if (button) {
                    const name = button.dataset.name;
                    removeFromCart(name);
                }
            });
        });
    }

    // --- Event Listeners ---

    // Open Cart on Icon Click
    cartIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    });

    // Close Cart
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Add to Cart Buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');

            // Extract Product Details
            const name = card.querySelector('.product-name').textContent;
            const image = card.querySelector('img').src;

            let price = 0;
            if (card.dataset.price) {
                price = parseFloat(card.dataset.price);
            } else {
                // Extract Price from text (Handle "Old Price" span if present)
                let priceText = card.querySelector('.product-price').textContent;
                const oldPriceSpan = card.querySelector('.old-price');
                if (oldPriceSpan) {
                    priceText = priceText.replace(oldPriceSpan.textContent, '').trim();
                }
                price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            }

            const product = { name, price, image };
            addToCart(product);
        });
    });

    // Hamburger Menu Event Listeners
    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.add('active');
            hamburger.style.display = 'none';
            if (closeIcon) closeIcon.style.display = 'flex';
        });
    }

    if (closeIcon && navLinksContainer) {
        closeIcon.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            closeIcon.style.display = 'none';
            if (hamburger) hamburger.style.display = 'flex';
        });
    }

    // Close menu when clicking on a link
    if (navLinksContainer) {
        navLinksContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navLinksContainer.classList.remove('active');
                if (closeIcon) closeIcon.style.display = 'none';
                if (hamburger) hamburger.style.display = 'flex';
            }
        });
    }
});
