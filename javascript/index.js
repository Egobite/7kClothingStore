var currentSlide = 1;

// Use DOMContentLoaded to ensure the HTML is ready
document.addEventListener("DOMContentLoaded", function () {
    // 1. Initialize Slider
    const slides = document.querySelectorAll(".slide-content");
    if (window.innerWidth > 767 && slides.length > 0) {
        theChecker();
        playSlider();
    }

    // 2. Add Click Listeners to Slider Buttons (Prevents 'onclick' errors)
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    if (nextBtn) nextBtn.addEventListener("click", nextSlider);
    if (prevBtn) prevBtn.addEventListener("click", prevSlider);

    // 3. Load Trending Products
    getTrendingProducts();

    // 4. Newsletter Form Logic
    initNewsletter();
});

// --- SLIDER FUNCTIONS ---
function nextSlider() {
    var imgSlider = document.querySelectorAll(".slide-content");
    if (currentSlide < imgSlider.length) {
        currentSlide++;
        theChecker();
    }
}

function prevSlider() {
    if (currentSlide > 1) {
        currentSlide--;
        theChecker();
    }
}

function theChecker() {
    var imgSlider = document.querySelectorAll(".slide-content");
    var btnNext = document.querySelector(".next");
    var btnPrev = document.querySelector(".prev");

    if (imgSlider.length === 0) return;

    imgSlider.forEach(img => img.classList.remove('active'));
    imgSlider[currentSlide - 1].classList.add('active');

    // Toggle disabled state
    if (btnPrev) btnPrev.classList.toggle('disabled', currentSlide === 1);
    if (btnNext) btnNext.classList.toggle('disabled', currentSlide === imgSlider.length);
}

function playSlider() {
    setInterval(() => {
        var imgSlider = document.querySelectorAll(".slide-content");
        if (imgSlider.length === 0) return;
        currentSlide = (currentSlide < imgSlider.length) ? currentSlide + 1 : 1;
        theChecker();
    }, 3000);
}

// --- PRODUCT FETCHING ---
async function getTrendingProducts() {
    try {
        // Vercel FIX: Use './' instead of '/'
        let response = await fetch('./products.json');
        if (!response.ok) throw new Error("Could not find products.json");
        let products = await response.json();
        let trendingProducts = products.filter(product => product.isTrending);
        displayTrendingProducts(trendingProducts);
    } catch (err) {
        console.error("Fetch error:", err);
    }
}

function displayTrendingProducts(trendingProducts) {
    let container = document.querySelector(".top_products .products");
    if (!container) return;

    let content = trendingProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="card-img">
                <img src="${product.images[0]}" alt="${product.name}" onclick="displayDetails(${product.id})">
                <a href="#" class="addToCart">
                    <ion-icon name="cart-outline" class="Cart"></ion-icon>
                </a>
            </div>
            <div class="card-info">
                 <h4 class="product-name" onclick="displayDetails(${product.id})">${product.name}</h4>
                 <h5 class="product-price">${product.price}</h5>
            </div>
        </div>`).join('');

    container.innerHTML = content;

    // Cart Click Events
    container.querySelectorAll('.addToCart').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            let id_product = event.target.closest('.product-card').dataset.id;
            // Ensure these functions exist in your cart.js
            if (typeof addToCart === "function") {
                addToCart(id_product);
                showCart();
            }
        });
    });
}

function showCart() {
    document.body.classList.add('showCart');
}

function displayDetails(productId) {
    // Exact match for your file: product-details.html
    window.location.href = `product-details.html?productId=${productId}`;
}

// --- NEWSLETTER ---
function initNewsletter() {
    const form = document.getElementById('contactForm');
    const responseMsg = document.getElementById('response-message');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(form);

            fetch("https://formsubmit.co/egobigabriel10@gmail.com", {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(res => {
                if (res.ok) {
                    form.style.display = 'none';
                    if (responseMsg) responseMsg.style.display = 'block';
                }
            })
            .catch(() => alert("Error sending message"));
        });
    }
}