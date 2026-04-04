let cart = JSON.parse(localStorage.getItem('cart')) || {};

// 🔥 كل المنتجات (لازم كل IDs تكون فريدة)
const allProducts = [
    // 🎁 بوكسات
    { id: 1, name: "بوكس كاندي كيلو", price: 200 },
    { id: 2, name: "بوكيه كاندي ورد", price: 195 },
    { id: 3, name: "بوكيه كاندي 1/2 كيلو", price: 225 },
    { id: 4, name: "بوكيه كاندي 400 جرام", price: 220 },

    // 🍜 اندومي (من 100)
    { id: 101, name: "اندومي بينك", price: 100 },
    { id: 102, name: "اندومي كريمي", price: 100 },
    { id: 103, name: "اندومي اكس1", price: 100 },
    { id: 104, name: "اندومي اكس2", price: 100 },
    { id: 105, name: "اندومي اكس3", price: 100 },
    { id: 106, name: "اندومي ليمون", price: 100 },
    { id: 107, name: "اندومي خضار", price: 100 },
    { id: 108, name: "اندومي كواترو", price: 100 },
    { id: 108, name: "اندومي كواترو", price: 100 },
    { id: 109, name: "اندومي صويا صوص", price: 100 },
    { id: 110, name: "اندومي سويت اند ساور", price: 100 },
    { id: 111, name: "اندومي فولكانو", price: 100 },
    
    { id: 112, name: "صوص اندومي بينك", price: 225 },
    { id: 113, name: "صوص اندومي اكس1", price: 225 },
    { id: 114, name: "صوص اندومي اكس2", price: 225 },
    { id: 115, name: "توبوكي جبنه", price: 145 },
    { id: 116, name: "توبوكي حار", price: 145 },

    // 🍭 سويتس (من 200)
    { id: 200, name: "شيكولاته دبي ميلك", price: 135 },
    { id: 201, name: "شيكولاته دبي وايت", price: 135 },
    { id: 202, name: "شيكولاته دبي كنافه لوتس وايت", price: 135 },
    { id: 203, name: "شيكولاته دبي كنافه لوز وايت", price: 135 },
    { id: 204, name: "كاندي مشكل كيلو", price: 185 },
    { id: 205, name: "كونو بايتس 1/2 كيلو", price: 75 },
    { id: 206, name: "ويفر رول 1/2 كيلو", price: 80 },
    { id: 207, name: "فواكه مجففة 100جم", price: 150 },
    // 🍭 سويتس (من 300)

    { id: 300, name: "لونج شيبس جبنه", price: 30 },
{ id: 301, name: "لونج شيبس اوريجمال", price: 30 },
{ id: 302, name: "لونج شيبس ساور كريم", price: 30 },
{ id: 303, name: "لونج شيبس سبايسي", price: 30 },
{ id: 304, name: "لونج شيبس عثل", price: 30 },
{ id: 305, name: "لونج شيبس خل وملح", price: 30 },
{ id: 306, name: "تي رولز170جرام", price: 60 },
{ id: 307, name: "تي رولز ازرق", price: 30 },
{ id: 308, name: "تي رولز اخضر", price: 30 },
];

// تحميل المنتجات
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

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

    const qty = cart[product.id] || 0;
    const inCart = qty > 0;

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image"
        onerror="this.src='https://via.placeholder.com/300x140/3498db/ffffff?text=${encodeURIComponent(product.name)}'">

        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price} جنيه</div>

            <div class="counter" style="display:${inCart ? 'flex' : 'none'};">
                <button class="counter-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                <span class="counter-value">${qty}</span>
                <button class="counter-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
            </div>

            <div class="product-actions">
                ${inCart 
                    ? `<button class="remove-btn" onclick="removeProduct(${product.id})">🗑️ إزالة</button>`
                    : `<button class="add-btn" onclick="addToCart(${product.id})">أضف للسلة</button>`
                }
            </div>
        </div>
    `;
    return card;
}

// إضافة للسلة
function addToCart(id) {
    cart[id] = 1;
    saveCart();
    loadProducts();
}

// تعديل الكمية
function changeQuantity(id, change) {
    if (!cart[id]) return;

    cart[id] += change;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart();
    loadProducts();
}

// حذف منتج
function removeProduct(id) {
    delete cart[id];
    saveCart();
    loadProducts();
}

// تحديث السلة (🔥 المهم)
function updateCartDisplay() {
    let total = 0;
    let count = 0;

    for (let id in cart) {
        const product = allProducts.find(p => p.id == id);

        if (product) {
            total += product.price * cart[id];
            count += cart[id];
        }
    }

    const totalEl = document.getElementById('totalPrice');
    const countEl = document.getElementById('itemsCount');

    if (totalEl) totalEl.textContent = total;
    if (countEl) countEl.textContent = count + " قطعة";
}

// إرسال الطلب
function sendOrder() {
    if (Object.keys(cart).length === 0) {
        alert('السلة فارغة!');
        return;
    }

    let text = "📋 طلب جديد\n\n";
    let total = 0;

    for (let id in cart) {
        const product = allProducts.find(p => p.id == id);

        if (product) {
            const qty = cart[id];
            const subtotal = product.price * qty;

            text += `• ${product.name} (${qty}) = ${subtotal}ج\n`;
            total += subtotal;
        }
    }

    text += `\n💰 الإجمالي: ${total} جنيه`;

    window.open(`https://wa.me/201142684154?text=${encodeURIComponent(text)}`);
}

// تفريغ السلة
function clearCart() {
    cart = {};
    saveCart();
    loadProducts();
}

// حفظ
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// تشغيل
document.addEventListener('DOMContentLoaded', loadProducts);