let cart = [];
let products = [];
let totalPrice = document.getElementById("total_price");
let cartCounter = document.getElementById("cart-counter");
let cartItemsCount = document.getElementById("cart_counts");
const cartTextElements = document.querySelectorAll(".cart_products");
const btnControl = document.querySelector(".btn_control");
const cartTotal = document.querySelector(".cart_total");

const WHATSAPP_NUMBER = "2349155403596"; 

// Initialize
loadCart();
getData();
checkCart();

async function getData() {
    try {
        // VERCEL FIX: Use relative path './' instead of absolute '/'
        let response = await fetch('./products.json');
        if (!response.ok) throw new Error("Network response was not ok");
        let json = await response.json();
        products = json;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function loadCart() {
    let storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, inputQuantity = 1) {
    let product = products.find(p => p.id == productId);
    if (product) {
        let existingProduct = cart.find(p => p.id == productId);
        if (existingProduct) {
            existingProduct.quantity += parseInt(inputQuantity);
        } else {
            let productWithQuantity = { ...product, quantity: parseInt(inputQuantity) };
            cart.push(productWithQuantity);
        }
        saveCart();
        checkCart();
    }
}

function addCartToHTML() {
    let content = ``;
    cart.forEach((product, index) => {
        let price = parseFloat(product.price.replace(/[₦$,]/g, ''));
        let productSubtotal = price * product.quantity;
        
        content += `
        <div class="cart_product">
            <div class="cart_product_img">  
                <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="cart_product_info">  
                <div class="top_card">
                    <div class="left_card">
                        <h4 class="product_name">${product.name}</h4>
                        <span class="product_price">₦${price.toLocaleString()}</span>
                    </div>
                    <div class="remove_product" onclick="removeFromCart(${index})">
                        <ion-icon name="close-outline"></ion-icon>
                    </div>
                </div>
                <div class="buttom_card">
                    <div class="counts">
                        <button class="counts_btns minus" onclick="decreaseQuantity(${index})">-</button>
                        <input type="number" readonly class="product_count" value="${product.quantity}">
                        <button class="counts_btns plus" onclick="increaseQuantity(${index})">+</button>
                    </div>
                    <span class="total_price">₦${productSubtotal.toLocaleString('en-NG', {minimumFractionDigits: 2})}</span>
                </div>
            </div>
        </div>`;
    });
    
    cartTextElements.forEach(element => {
        element.innerHTML = content;
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    checkCart();
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    checkCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart();
        checkCart();
    } else {
        removeFromCart(index);
    }
}

function updateTotalPrice() {
    let total = cart.reduce((sum, product) => {
        let price = parseFloat(product.price.replace(/[₦$,]/g, ''));
        return sum + (price * product.quantity);
    }, 0);

    if (totalPrice) {
        totalPrice.innerHTML = `₦${total.toLocaleString('en-NG', {minimumFractionDigits: 2})}`;
    }
    localStorage.setItem("total price", total);
    return total;
}

function checkCart() {
    if (cart.length == 0) {
        cartTextElements.forEach(element => {
            element.classList.add("empty");
            element.innerHTML = "Your cart is empty";
        });
        if (cartCounter) cartCounter.innerHTML = 0;
        if (btnControl) btnControl.style.display = "none";
        if (cartTotal) cartTotal.style.display = "none";
        checkCartPage(0, 0);
    } else {
        cartTextElements.forEach(element => {
            element.classList.remove("empty");
        });
        addCartToHTML();
        let totalQuantity = cart.reduce((sum, product) => sum + product.quantity, 0);
        if (cartCounter) cartCounter.innerHTML = totalQuantity;
        if (btnControl) btnControl.style.display = "flex";
        if (cartTotal) cartTotal.style.display = "flex";
        let total = updateTotalPrice();
        checkCartPage(total, totalQuantity);
    }
}

function checkCartPage(total, totalQuantity) {
    // UPDATED: Check for the new lowercase kebab-case filename
    if (window.location.pathname.includes("cart-page.html")) {
        if (cart.length == 0) {
            if (cartItemsCount) cartItemsCount.innerHTML = `(0 items)`;
            let totalOrderElem = document.getElementById("total_order");
            if (totalOrderElem) totalOrderElem.innerHTML = `₦0.00`;
        } else {
            if (cartItemsCount) cartItemsCount.innerHTML = `(${totalQuantity} items)`;
            displayInCartPage(total);
        }
    }
}

function displayInCartPage(total) {
    let formattedTotal = total.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    let totalOrderElem = document.getElementById("total_order");
    if (totalOrderElem) totalOrderElem.innerHTML = `₦${formattedTotal}`;
}

function checkOut() {
    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }
    
    let message = "🛍️ *7kClothingStore Order* %0A%0A";
    let grandTotal = 0;
    const baseUrl = window.location.origin;

    cart.forEach((item, index) => {
        let price = parseFloat(item.price.replace(/[₦$,]/g, ''));
        let subtotal = price * item.quantity;
        grandTotal += subtotal;

        let imgPath = item.images[0].startsWith('http') ? item.images[0] : `${baseUrl}/${item.images[0]}`;

        message += `*${index + 1}. ${item.name}*%0A`;
        message += `Qty: ${item.quantity} x ₦${price.toLocaleString()}%0A`;
        message += `Image: ${imgPath}%0A`; 
        message += `Subtotal: ₦${subtotal.toLocaleString()}%0A%0A`;
    });

    message += `*Grand Total: ₦${grandTotal.toLocaleString('en-NG', {minimumFractionDigits: 2})}*%0A%0A`;
    message += "Please confirm availability and payment details.";

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    // Clear cart after redirect
    cart = [];
    localStorage.removeItem('cart');
    localStorage.setItem("total price", 0);
    checkCart();
    
    window.open(whatsappUrl, '_blank');
}

// Global functions for HTML onclicks
window.viewCart = function() {
    window.location.href = 'cart-page.html';
};

window.checkOut = checkOut;