console.log('====================================');
console.log("Connected");
console.log('====================================');
console.log("Connected");

async function fetchProducts() {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        const data = await response.json();
        return data.categories || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

function calculateDiscountPercentage(price, comparePrice) {
    return Math.round(((comparePrice - price) / comparePrice) * 100);
}

function generateProductCard(product) {
    const discountPercentage = calculateDiscountPercentage(Number(product.price), Number(product.compare_at_price));
    const hasBadge = product.badge_text !== null && product.badge_text !== undefined;
    const badge = hasBadge ? `<div class="product-badge">${product.badge_text}</div>` : '';

    return `
      <div class="product-card">
        <img class="product-image" src="${product.image}" alt="${product.title}">
        ${badge}
        <div class="product-details">
          <div id="div1">
            <p class="product-info"><strong>${product.title}</strong> • ${product.vendor}</p>
          </div>
          <div id="div2">
            <p class="prices">Rs ${product.price}.00 <del>${product.compare_at_price}</del> <span class="discount">${discountPercentage}% Off</span></p>
          </div>
        </div>
        <button class="add-to-cart">Add to cart</button>
      </div>
    `;
}

async function renderProducts(category) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    try {
        const categories = await fetchProducts();
        const selectedCategory = categories.find(cat => cat && cat.category_name && cat.category_name.toLowerCase() === category.toLowerCase());
        if (selectedCategory && selectedCategory.category_products) {
            selectedCategory.category_products.forEach(product => {
                const productCard = generateProductCard(product);
                productsContainer.insertAdjacentHTML('beforeend', productCard);
            });
        } else {
            console.error('Error: Selected category not found or does not contain products');
        }
    } catch (error) {
        console.error('Error rendering products:', error);
    }
}

function openCategory(category) {
    renderProducts(category);
}

openCategory('men');
