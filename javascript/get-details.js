const params = new URL(location.href).searchParams;
const productId = params.get('productId');
let quantityInput = document.getElementById("productCount");

// Initialize
getData();

async function getData() {
    try {
        // Use relative path './' to ensure Vercel maps to the root correctly
        const response = await fetch('./products.json');
        if (!response.ok) throw new Error("Failed to fetch products.json");
        
        const json = await response.json();
        const product = json.find(item => item.id == productId); 

        if (product) {
            displayDetails(product);
        } else {
            console.error('Product not found in JSON');
        }
    } catch (error) {
        console.error('Deployment Error: Ensure products.json is in the root folder.', error);
    }
}

function displayDetails(product) {
    const productDetails = document.querySelector('.productDetails');
    if (!productDetails) return;
    
    productDetails.setAttribute("data-id", product.id);
    
    // UI Updates
    document.getElementById("product_image").src = product.images[0];
    document.querySelector(".category_name").textContent = product.category;
    document.querySelector(".product_name").textContent = product.name;
    document.querySelector(".product_price").textContent = product.price;
    document.querySelector(".product_des").textContent = product.description;
    
    const linkAdd = document.getElementById("btn_add");
    if (linkAdd) {
        linkAdd.onclick = function(event) {
            event.preventDefault();
            // Check if cart.js is loaded
            if (typeof addToCart === "function") {
                const qty = parseInt(quantityInput.value) || 1;
                addToCart(product.id, qty);
                showToast();
            } else {
                console.error("cart.js function 'addToCart' not found.");
            }
        };
    }
}

function showToast() {
    const toastOverlay = document.getElementById("toast-overlay");
    if (toastOverlay) {
        toastOverlay.classList.add("show");
        showCheckAnimation();
        setTimeout(() => {
            toastOverlay.classList.remove("show");
            showCart();
        }, 1500);
    }
}

function showCart() {
    document.body.classList.add('showCart');
}

function showCheckAnimation() {
    const checkIconContainer = document.getElementById('checkIcon');
    if (!checkIconContainer) return;
    
    checkIconContainer.innerHTML = '';
    const newCheckIcon = document.createElement('div');
    newCheckIcon.style.width = '100px';
    newCheckIcon.style.height = '100px';
    checkIconContainer.appendChild(newCheckIcon);

    // Path must be lowercase and relative for Vercel
    lottie.loadAnimation({
        container: newCheckIcon,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: './json/animation-check.json' 
    });
}

// Quantity Logic
const minusBtn = document.getElementById("minus");
const plusBtn = document.getElementById("plus");

if (minusBtn) {
    minusBtn.addEventListener("click", () => {
        let value = parseInt(quantityInput.value) || 1; 
        if (value > 1) quantityInput.value = value - 1;
    });
}

if (plusBtn) {
    plusBtn.addEventListener("click", () => {
        let value = parseInt(quantityInput.value) || 1; 
        if (value < 999) quantityInput.value = value + 1;
    });
}