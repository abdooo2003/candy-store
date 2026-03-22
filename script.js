let cart = JSON.parse(localStorage.getItem('cart')) || {};

// تحميل المنتجات
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    pageProducts.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
    updateCartDisplay();
}

// إنشاء الكارت
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const inCart = cart[product.id] ? true : false;
    const qty = cart[product.id] || 0;
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image" 
             onerror="this.src='https://via.placeholder.com/300x140/3498db/ffffff?text=${encodeURIComponent(product.name)}'">
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price} جنيه</div>
            <div class="counter" id="counter-${product.id}" style="display:${inCart ? 'flex' : 'none'};">
                <button class="counter-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                <span class="counter-value" id="qty-${product.id}">${qty}</span>
                <button class="counter-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
            </div>
            <div class="product-actions" id="actions-${product.id}">
                ${inCart ? 
                    `<button class="remove-btn" onclick="removeProduct(${product.id})">🗑️ إزالة</button>` :
                    `<button class="add-btn" onclick="toggleProduct(${product.id})">أضف للسلة</button>`
                }
            </div>
        </div>
    `;
    return card;
}

// الدوال الأساسية
function toggleProduct(id) {
    cart[id] = 1;
    saveCart();
    loadProducts();
}

function changeQuantity(id, change) {
    if (!cart[id]) return;
    cart[id] = Math.max(1, (cart[id] || 0) + change);
    if (cart[id] <= 0) delete cart[id];
    saveCart();
    loadProducts();
}

function removeProduct(id) {
    delete cart[id];
    saveCart();
    loadProducts();
}

function updateCartDisplay() {
    let total = 0, count = 0;
    for (let id in cart) {
        const product = pageProducts.find(p => p.id == id);
        if (product) {
            total += product.price * cart[id];
            count += cart[id];
        }
    }
    document.getElementById('totalPrice').textContent = total;
    document.getElementById('itemsCount').textContent = count;
}

function sendOrder() {
    if (Object.keys(cart).length === 0) {
        alert('السلة فارغة!');
        return;
    }
    let text = "📋 *طلب جديد*\n\n";
    let total = 0;
    for (let id in cart) {
        const product = pageProducts.find(p => p.id == id);
        if (product) {
            const qty = cart[id];
            const subtotal = product.price * qty;
            text += `• ${product.name} (${qty}x${product.price}ج) = ${subtotal}ج\n`;
            total += subtotal;
        }
    }
    text += `\n💰 *الإجمالي: ${total} جنيه*`;
    window.open(`https://wa.me/21064260282?text=${encodeURIComponent(text)}`, '_blank');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// تشغيل الصفحة
document.addEventListener('DOMContentLoaded', loadProducts);