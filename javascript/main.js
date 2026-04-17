document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GLOBALS & SELECTORS ---
    const searchTrigger = document.getElementById('searchTrigger');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const suggestionsList = document.getElementById('suggestionsList');
    
    const iconCart = document.querySelector('.icon-cart');
    const closeCart = document.querySelector('.closeCart');
    const viewCartBtn = document.querySelector('.viewCart');
    const body = document.querySelector('body');
    
    const nav = document.getElementById('header');
    const scrollBtn = document.getElementById("scrollBtn");
    
    let allProducts = [];
    let lastScroll = 0;

    // --- 2. SEARCH LOGIC ---
    if (searchTrigger && searchOverlay) {
        // FIX: Use relative path './' for Vercel stability
        fetch('./products.json')
            .then(response => {
                if (!response.ok) throw new Error("JSON file not found");
                return response.json();
            })
            .then(data => {
                allProducts = data;
                console.log("Search data loaded successfully");
            })
            .catch(err => console.error("Search fetch error:", err));

        // Open Search
        searchTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); 
            searchOverlay.classList.add('active');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });

        // Close Search
        if (closeSearch) {
            closeSearch.addEventListener('click', (e) => {
                e.preventDefault();
                searchOverlay.classList.remove('active');
                if (searchInput) searchInput.value = '';
                if (suggestionsList) suggestionsList.innerHTML = '';
            });
        }

        // Search Input Filtering
        if (searchInput && suggestionsList) {
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase().trim();
                suggestionsList.innerHTML = '';

                if (query.length > 0) {
                    const matches = allProducts.filter(p => 
                        p.name.toLowerCase().includes(query) || 
                        (p.category && p.category.toLowerCase().includes(query))
                    );

                    matches.slice(0, 8).forEach(product => {
                        const li = document.createElement('li');
                        const regex = new RegExp(`(${query})`, 'gi');
                        li.innerHTML = product.name.replace(regex, "<strong>$1</strong>");
                        li.style.cursor = 'pointer';
                        
                        li.addEventListener('click', () => {
                            // FIX: Lowercase file name matching index.html logic
                            window.location.href = `product-details.html?productId=${product.id}`;
                        });
                        suggestionsList.appendChild(li);
                    });
                }
            });
        }
    }

    // --- 3. CART LOGIC ---
    if (iconCart) {
        iconCart.addEventListener('click', (e) => {
            e.preventDefault();
            body.classList.toggle('showCart');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', (e) => {
            e.preventDefault();
            body.classList.remove('showCart');
        });
    }

    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', () => {
            window.location.href = "cart-page.html";
        });
    }

    // --- 4. HEADER & SCROLL LOGIC ---
    window.addEventListener("scroll", () => {
        let currentScroll = window.pageYOffset;

        // Header Hide/Show
        if (nav) {
            if (currentScroll <= 0) {
                nav.classList.remove("scroll-up", "scroll-down");
            } else if (currentScroll > lastScroll && !nav.classList.contains("scroll-down")) {
                nav.classList.add("scroll-down");
                nav.classList.remove("scroll-up");
            } else if (currentScroll < lastScroll && nav.classList.contains("scroll-down")) {
                nav.classList.replace("scroll-down", "scroll-up");
            }
            lastScroll = currentScroll;
        }

        // Back to Top Button
        if (scrollBtn) {
            scrollBtn.style.display = (currentScroll > 100) ? "block" : "none";
        }
    });

    if (scrollBtn) {
        scrollBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 5. VIDEO AUTOPLAY LOGIC ---
    const allVideos = document.querySelectorAll('.card-video');
    allVideos.forEach(video => {
        video.addEventListener('play', () => {
            allVideos.forEach(v => {
                if (v !== video) v.pause();
            });
        });
    });

    // --- 6. KEYBOARD ACCESSIBILITY ---
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            if (searchOverlay) searchOverlay.classList.remove('active');
            body.classList.remove('showCart');
        }
    });
});