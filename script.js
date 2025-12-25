document.addEventListener('DOMContentLoaded', () => {
    // --- Cart Functionality ---
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let cartCount = cartItems.length;
    const cartCountElement = document.querySelector('.cart-count');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.querySelector('.total-price');
    const checkoutButton = document.querySelector('.checkout-button');

    // Function to update cart count display
    function updateCartCount() {
        cartCount = cartItems.length;
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
            cartCountElement.style.display = 'block'; // Always show the badge
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // Function to calculate total price
    function calculateTotal() {
        return cartItems.reduce((total, item) => total + parseFloat(item.price.replace('$', '').replace(',', '')), 0);
    }

    // Function to update cart display
    function updateCartDisplay() {
        if (!cartItemsContainer) return;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            if (cartTotalElement) cartTotalElement.textContent = '$0.00';
            return;
        }

        let cartHTML = '';
        cartItems.forEach((item, index) => {
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">${item.price}</p>
                    </div>
                    <button class="remove-item" data-index="${index}">×</button>
                    <div class="swipe-indicator">Swipe to remove</div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = cartHTML;

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cartItems.splice(index, 1);
                updateCartCount();
                updateCartDisplay();
                showNotification('Item removed from cart!');
            });
        });

        // Add swipe-to-remove functionality for mobile
        document.querySelectorAll('.cart-item').forEach((item, index) => {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            const swipeThreshold = 100; // Minimum swipe distance

            item.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                item.classList.add('swipe-active');
            }, { passive: true });

            item.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const diff = startX - currentX;

                if (diff > 0) { // Only allow left swipe
                    item.style.transform = `translateX(-${Math.min(diff, 100)}px)`;
                }
            }, { passive: true });

            item.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                isDragging = false;
                item.classList.remove('swipe-active');

                const diff = startX - currentX;

                if (diff > swipeThreshold) {
                    // Remove item
                    cartItems.splice(index, 1);
                    updateCartCount();
                    updateCartDisplay();
                    showNotification('Item removed from cart!');
                } else {
                    // Reset position
                    item.style.transform = 'translateX(0)';
                }
            }, { passive: true });
        });

        // Update total price
        if (cartTotalElement) {
            cartTotalElement.textContent = `$${calculateTotal().toFixed(2)}`;
        }
    }

    // Initialize cart display
    updateCartCount();
    updateCartDisplay();

    // --- Add to Cart Button Functionality ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.dataset.price ? '$' + productCard.dataset.price : productCard.querySelector('.product-price').textContent.split(' ')[0];

            // Add item to cart
            cartItems.push({
                name: productName,
                price: productPrice
            });

            updateCartCount();
            updateCartDisplay();
            showNotification('Item added to cart!');
        });
    });

    // --- Checkout Button Functionality ---
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cartItems.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }

            const total = calculateTotal();
            const confirmed = confirm(`Total: $${total.toFixed(2)}\n\nProceed to checkout?`);

            if (confirmed) {
                // Clear cart
                cartItems = [];
                updateCartCount();
                updateCartDisplay();
                showNotification('Order placed successfully!');
                // Close cart
                document.getElementById('cartSidebar').classList.remove('active');
                document.getElementById('cartOverlay').classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Cart Sidebar Functionality ---
    const cartIcon = document.querySelector('.cart-icon');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCart');

    // Function to open the cart
    function openCart() {
        if (cartOverlay && cartSidebar) {
            cartOverlay.classList.add('active');
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Function to close the cart
    function closeCart() {
        if (cartOverlay && cartSidebar) {
            cartOverlay.classList.remove('active');
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // --- User Icon Functionality ---
    const userIcon = document.querySelector('.user-icon');
    if (userIcon) {
        userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            alert('User profile clicked!');
        });
    }
    // --- Responsive Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const closeIcon = document.querySelector('.close-icon');
    const navLinksContainer = document.querySelector('.nav-links-container');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => navLinksContainer.classList.add('active'));
    }
    if (closeIcon && navLinksContainer) {
        closeIcon.addEventListener('click', () => navLinksContainer.classList.remove('active'));
    }

    // --- Hero Section Image Slider ---
    // Your CSS has styles for a slider, so this JS will make it work.
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const images = heroSlider.querySelectorAll('.slider-image');
        let currentImageIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        if (images.length > 0) {
            // Show the first image initially
            images[currentImageIndex].classList.add('active');

            // Function to change slide
            function changeSlide(direction) {
                // Remove active class from current image
                images[currentImageIndex].classList.remove('active');

                // Update index based on direction
                if (direction === 'next') {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                } else if (direction === 'prev') {
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                }

                // Add active class to the new current image
                images[currentImageIndex].classList.add('active');
            }

            // Auto-slide functionality
            let autoSlideInterval = setInterval(() => {
                changeSlide('next');
            }, 5000); // Change image every 5 seconds (5000ms)

            // Touch event handlers for swipe gestures on mobile
            function handleTouchStart(e) {
                touchStartX = e.touches[0].clientX;
            }

            function handleTouchEnd(e) {
                touchEndX = e.changedTouches[0].clientX;
                handleSwipe();
            }

            function handleSwipe() {
                const swipeThreshold = 50; // Minimum distance for swipe
                const swipeDistance = touchStartX - touchEndX;

                if (Math.abs(swipeDistance) > swipeThreshold) {
                    if (swipeDistance > 0) {
                        // Swiped left - next image
                        changeSlide('next');
                    } else {
                        // Swiped right - previous image
                        changeSlide('prev');
                    }
                    // Reset auto-slide timer
                    clearInterval(autoSlideInterval);
                    setTimeout(() => {
                        autoSlideInterval = setInterval(() => changeSlide('next'), 5000);
                    }, 5000);
                }
            }

            // Add touch event listeners for mobile swipe support
            heroSlider.addEventListener('touchstart', handleTouchStart, { passive: true });
            heroSlider.addEventListener('touchend', handleTouchEnd, { passive: true });
        }
    }

    // --- Notification Popup ---
    // Your CSS has styles for a notification, this function can be called to show it.
    function showNotification(message) {
        const notification = document.querySelector('.app-notification');
        if (!notification) return;

        notification.textContent = message;
        notification.classList.add('show');

        // Hide the notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Example of how to use the notification. You can call this from anywhere.
    // For demonstration, it will show 2 seconds after the page loads.
    setTimeout(() => showNotification('Welcome to our store!'), 2000);

    // --- Live Support Modal Functionality ---
    const liveSupportBtn = document.getElementById('liveSupportBtn');
    const liveSupportModal = document.getElementById('liveSupportModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const startChatBtn = document.querySelector('.start-chat-btn');

    // Function to open the live support modal
    function openLiveSupportModal() {
        if (liveSupportModal) {
            liveSupportModal.classList.add('show');
        }
    }

    // Function to close the live support modal
    function closeLiveSupportModal() {
        if (liveSupportModal) {
            liveSupportModal.classList.remove('show');
        }
    }

    // Event listener for live support button - open chat directly
    if (liveSupportBtn) {
        liveSupportBtn.addEventListener('click', () => {
            // Hide the intro and show the chat box directly
            const chatIntro = document.getElementById('chatIntro');
            const chatBox = document.getElementById('chatBox');
            if (chatIntro && chatBox) {
                chatIntro.style.display = 'none';
                chatBox.style.display = 'block';
            }
            openLiveSupportModal();
        });
    }

    // Event listener for close modal button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeLiveSupportModal);
    }

    // Event listener for clicking outside the modal to close it
    if (liveSupportModal) {
        liveSupportModal.addEventListener('click', (e) => {
            if (e.target === liveSupportModal) {
                closeLiveSupportModal();
            }
        });
    }

    // Chat functionality
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatMessages = document.getElementById('chatMessages');

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'agent-message'}`;
        messageDiv.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';

            // Simulate agent response
            setTimeout(() => {
                addMessage('Thank you for your message. Our support team will respond shortly.');
            }, 1000);
        }
    }

    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // --- Back to Top Button Functionality ---
    const backToTopButton = document.getElementById("backToTopBtn");

    // When the user scrolls down 300px from the top of the document, show the button
    window.onscroll = function() {
        scrollFunction();
    };

    function scrollFunction() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    }

    // When the user clicks on the button, scroll to the top of the document
    backToTopButton.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
