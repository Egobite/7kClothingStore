let productsContainer = [];
let linkName = document.getElementsByClassName("categories_link");

// Initialize
getData();

async function getData(category = null) {
    try {
        // VERCEL FIX: Use relative path './' to ensure the JSON is found
        let response = await fetch('./products.json');
        if (!response.ok) throw new Error("Could not fetch products.json");
        
        let json = await response.json();
        productsContainer = json;

        if (category) {
            productsContainer = productsContainer.filter(product => product.category === category);
        }
        displayProducts();
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

function displayProducts() {
    let container = ``;
    const productListElement = document.querySelector('.products .content');
    const countElement = document.getElementById("productCount");

    if (!productListElement) return; // Guard clause if element doesn't exist on page

    for (let i = 0; i < productsContainer.length; i++) {
        container += `
        <div class="product-card" data-id="${productsContainer[i].id}">
            <div class="card-img">
                <img onclick="displayDetails(${productsContainer[i].id})" 
                     src="${productsContainer[i].images[0]}" 
                     alt="${productsContainer[i].name}">
                <a href="#" class="addToCart">
                    <ion-icon name="cart-outline" class="Cart"></ion-icon>
                </a>
            </div>
            <div class="card-info">
                 <h4 class="product-name" onclick="displayDetails(${productsContainer[i].id})">${productsContainer[i].name}</h4>
                 <h5 class="product-price">${productsContainer[i].price}</h5>
            </div>
        </div>`;
    }

    if (countElement) {
        countElement.innerHTML = `${productsContainer.length} Products`;
    }
    
    productListElement.innerHTML = container;

    // Attach Event Listeners for Add to Cart
    let addToCartLinks = document.querySelectorAll('.addToCart');
    addToCartLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            let productCard = event.target.closest('.product-card');
            if (productCard && productCard.dataset.id) {
                let id_product = productCard.dataset.id;
                // Calls function from cart.js
                if (typeof addToCart === "function") {
                    addToCart(id_product);
                }
            }
        });
    });
}

function getCategory(e) {
    e.preventDefault(); // Prevent page jump
    let category = e.target.getAttribute('productCategory');
    setActiveLink(e.target);
    getData(category);

    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

function setActiveLink(activeLink) {
    Array.from(linkName).forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

Array.from(linkName).forEach(function(element) {
    element.addEventListener('click', getCategory);
});

// Sidebar toggle logic
window.toggleSidebar = function() {
    var sidebar = document.querySelector(".aside");
    if (sidebar) {
        sidebar.classList.toggle("open");
    }
};

// Updated to point to the new lowercase filename
function displayDetails(productId) {
    window.location.href = `product-details.html?productId=${productId}`;
}