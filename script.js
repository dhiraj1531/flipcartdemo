const products = [
  { id: 1, name: "Nova X5 5G Smartphone", category: "Mobiles", price: 14999, oldPrice: 19999, rating: 4.4, reviews: 1284, emoji: "📱", bg: "#e7efff", badge: "25% OFF", description: "A stylish everyday smartphone with a vivid display, reliable performance and plenty of room for your favourite apps." },
  { id: 2, name: "Sonic Pro Wireless Headphones", category: "Electronics", price: 1799, oldPrice: 3999, rating: 4.3, reviews: 856, emoji: "🎧", bg: "#f1e9ff", badge: "BESTSELLER", description: "Comfortable wireless headphones for music, calls and podcasts, with a foldable design for easy storage." },
  { id: 3, name: "AirFlex Everyday Sneakers", category: "Fashion", price: 1299, oldPrice: 2499, rating: 4.2, reviews: 672, emoji: "👟", bg: "#e6f5ee", badge: "48% OFF", description: "Lightweight everyday sneakers with a cushioned feel, suitable for casual outings and daily wear." },
  { id: 4, name: "SmartFit Fitness Watch", category: "Electronics", price: 2499, oldPrice: 4999, rating: 4.1, reviews: 942, emoji: "⌚", bg: "#e8f2f8", badge: "LIMITED DEAL", description: "Track daily activity, check notifications and keep your routine on track with this smart fitness watch." },
  { id: 5, name: "CloudSoft Cushion Pillow Set", category: "Home", price: 699, oldPrice: 1199, rating: 4.5, reviews: 315, emoji: "🛏️", bg: "#fff0e7", badge: "POPULAR", description: "A soft, cosy pillow set designed to add comfort and a fresh touch to your bedroom." },
  { id: 6, name: "Everyday Cotton T-Shirt", category: "Fashion", price: 399, oldPrice: 799, rating: 4.0, reviews: 508, emoji: "👕", bg: "#fceaf0", badge: "50% OFF", description: "A versatile cotton-blend T-shirt for relaxed everyday styling. Pair it with jeans, shorts or joggers." },
  { id: 7, name: "BlendMate Mixer Grinder", category: "Appliances", price: 2199, oldPrice: 3299, rating: 4.3, reviews: 401, emoji: "🥤", bg: "#e5f5f4", badge: "33% OFF", description: "A handy kitchen companion for everyday blending and mixing tasks. Check the product packaging for included accessories." },
  { id: 8, name: "Glow Daily Skincare Kit", category: "Beauty", price: 849, oldPrice: 1299, rating: 4.2, reviews: 289, emoji: "🧴", bg: "#fff4d9", badge: "VALUE PACK", description: "A simple skincare gift set for a daily self-care routine. Review the ingredient list to choose products suited to you." },
  { id: 9, name: "Fresh Basket Grocery Box", category: "Grocery", price: 499, oldPrice: 649, rating: 4.1, reviews: 164, emoji: "🥬", bg: "#eaf7e7", badge: "FRESH PICK", description: "A demo grocery bundle for everyday kitchen needs. Actual contents and availability would depend on the seller." },
  { id: 10, name: "Build & Play Toy Blocks", category: "Toys", price: 599, oldPrice: 999, rating: 4.6, reviews: 721, emoji: "🧸", bg: "#fff0df", badge: "TOP RATED", description: "Colourful building blocks for imaginative play. Check the age guidance and small-parts warning on real products." },
  { id: 11, name: "StudyTime Laptop Backpack", category: "Fashion", price: 999, oldPrice: 1699, rating: 4.4, reviews: 392, emoji: "🎒", bg: "#e8ecff", badge: "41% OFF", description: "A practical backpack for school, commuting or travel, with a roomy main compartment and useful pockets." },
  { id: 12, name: "Mini Bluetooth Speaker", category: "Electronics", price: 999, oldPrice: 1599, rating: 4.2, reviews: 637, emoji: "🔊", bg: "#f0eaff", badge: "DEAL", description: "A compact speaker for music at home or on the go. Wireless range and battery life depend on usage." }
];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
});

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const productHeading = document.getElementById("productHeading");
const resultSummary = document.getElementById("resultSummary");
const emptyState = document.getElementById("emptyState");
const sortSelect = document.getElementById("sortSelect");
const cartCount = document.getElementById("cartCount");
const cartDialog = document.getElementById("cartDialog");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const productDialog = document.getElementById("productDialog");
const productDetailContent = document.getElementById("productDetailContent");
const toast = document.getElementById("toast");

let selectedCategory = "All";
let searchTerm = "";
let cart = {};
let wishlist = new Set();
let toastTimer;

function formatPrice(value) {
  return currency.format(value);
}

function discountPercent(product) {
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

function getVisibleProducts() {
  let visible = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const text = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return matchesCategory && text.includes(searchTerm.toLowerCase().trim());
  });

  switch (sortSelect.value) {
    case "price-low":
      visible.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      visible.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      visible.sort((a, b) => b.rating - a.rating);
      break;
  }
  return visible;
}

function renderProducts() {
  const visible = getVisibleProducts();
  productGrid.innerHTML = "";
  emptyState.hidden = visible.length > 0;
  productGrid.hidden = visible.length === 0;

  const categoryName = selectedCategory === "All" ? "all categories" : selectedCategory;
  resultSummary.textContent = `${visible.length} product${visible.length === 1 ? "" : "s"} in ${categoryName}${searchTerm ? ` matching “${searchTerm}”` : ""}`;

  if (selectedCategory === "All") {
    productHeading.textContent = searchTerm ? "Search results" : "Deals of the day";
  } else {
    productHeading.textContent = `${selectedCategory} picks`;
  }

  visible.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image-wrap" data-details="${product.id}" role="button" tabindex="0" aria-label="View ${product.name}">
        <span class="product-badge">${product.badge}</span>
        <div class="product-image" style="--product-bg:${product.bg}" aria-hidden="true">${product.emoji}</div>
        <button class="wishlist-button ${wishlist.has(product.id) ? "saved" : ""}" data-wishlist="${product.id}" type="button" aria-label="${wishlist.has(product.id) ? "Remove from" : "Add to"} wishlist" aria-pressed="${wishlist.has(product.id)}">${wishlist.has(product.id) ? "♥" : "♡"}</button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name" data-details="${product.id}" tabindex="0" role="button">${product.name}</h3>
        <div class="rating-line"><span class="rating">★ ${product.rating.toFixed(1)}</span><span class="review-count">(${product.reviews.toLocaleString("en-IN")})</span></div>
        <div class="price-line"><span class="current-price">${formatPrice(product.price)}</span><span class="old-price">${formatPrice(product.oldPrice)}</span><span class="discount">${discountPercent(product)}% off</span></div>
        <div class="product-actions">
          <button class="add-button" data-add="${product.id}" type="button">Add to cart</button>
          <button class="details-button" data-details="${product.id}" type="button">Details</button>
        </div>
      </div>`;
    productGrid.appendChild(card);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCartCount();
  showToast(`${products.find((product) => product.id === id).name} added to cart`);
}

function updateCartCount() {
  const count = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  cartCount.textContent = count;
  cartCount.setAttribute("aria-label", `${count} items in cart`);
}

function renderCart() {
  const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  cartItems.innerHTML = "";

  if (entries.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty"><span>🛍️</span><h3>Your cart is empty</h3><p>Looks like you haven't added anything yet.</p></div>`;
  } else {
    entries.forEach(([id, quantity]) => {
      const product = products.find((item) => item.id === Number(id));
      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <div class="cart-thumb" style="--product-bg:${product.bg}" aria-hidden="true">${product.emoji}</div>
        <div>
          <p class="cart-item-name">${product.name}</p>
          <p class="cart-item-price">${formatPrice(product.price)}</p>
          <div class="quantity-controls" aria-label="Quantity controls for ${product.name}">
            <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Decrease quantity">−</button>
            <span>${quantity}</span>
            <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="remove-button" data-remove="${product.id}" type="button">Remove</button>
        </div>
        <strong>${formatPrice(product.price * quantity)}</strong>`;
      cartItems.appendChild(row);
    });
  }

  const subtotal = entries.reduce((total, [id, quantity]) => {
    const product = products.find((item) => item.id === Number(id));
    return total + product.price * quantity;
  }, 0);
  cartSubtotal.textContent = formatPrice(subtotal);
}

function openProductDetails(id) {
  const product = products.find((item) => item.id === Number(id));
  if (!product) return;

  productDetailContent.innerHTML = `
    <div class="product-detail">
      <div class="detail-image" style="--product-bg:${product.bg}" aria-hidden="true">${product.emoji}</div>
      <div class="detail-copy">
        <p class="eyebrow blue-eyebrow">${product.category} · ${product.badge}</p>
        <h2 id="detailName">${product.name}</h2>
        <div class="rating-line"><span class="rating">★ ${product.rating.toFixed(1)}</span><span class="review-count">${product.reviews.toLocaleString("en-IN")} demo ratings</span></div>
        <p>${product.description}</p>
        <div class="detail-price"><strong>${formatPrice(product.price)}</strong><span class="old-price">${formatPrice(product.oldPrice)}</span><span class="discount">${discountPercent(product)}% off</span></div>
        <p>✓ Demo offer · ✓ Easy-to-use shopping interface</p>
        <button class="primary-button" type="button" data-add="${product.id}">Add to cart</button>
      </div>
    </div>`;
  productDialog.showModal();
}

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const wishlistButton = event.target.closest("[data-wishlist]");
  const detailTarget = event.target.closest("[data-details]");

  if (addButton) {
    addToCart(Number(addButton.dataset.add));
  } else if (wishlistButton) {
    const id = Number(wishlistButton.dataset.wishlist);
    if (wishlist.has(id)) {
      wishlist.delete(id);
      showToast("Removed from your wishlist");
    } else {
      wishlist.add(id);
      showToast("Added to your wishlist");
    }
    renderProducts();
  } else if (detailTarget) {
    openProductDetails(Number(detailTarget.dataset.details));
  }
});

productGrid.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-details][role='button'], h3[data-details]")) {
    event.preventDefault();
    openProductDetails(Number(event.target.dataset.details));
  }
});

productDetailContent.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) {
    addToCart(Number(button.dataset.add));
    productDialog.close();
  }
});

document.querySelectorAll(".category-item").forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    document.querySelectorAll(".category-item").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderProducts();
    document.getElementById("deals").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = searchInput.value;
  renderProducts();
  document.getElementById("deals").scrollIntoView({ behavior: "smooth", block: "start" });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  renderProducts();
});

sortSelect.addEventListener("change", renderProducts);

document.getElementById("clearFiltersButton").addEventListener("click", () => {
  selectedCategory = "All";
  searchTerm = "";
  searchInput.value = "";
  sortSelect.value = "featured";
  document.querySelectorAll(".category-item").forEach((item) => {
    const active = item.dataset.category === "All";
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderProducts();
});

document.getElementById("shopNowButton").addEventListener("click", () => {
  document.getElementById("deals").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("cartButton").addEventListener("click", () => {
  renderCart();
  cartDialog.showModal();
});
document.getElementById("closeCartButton").addEventListener("click", () => cartDialog.close());
document.getElementById("closeProductButton").addEventListener("click", () => productDialog.close());

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    const id = Number(quantityButton.dataset.quantity);
    cart[id] = (cart[id] || 0) + Number(quantityButton.dataset.change);
    if (cart[id] <= 0) delete cart[id];
    updateCartCount();
    renderCart();
  } else if (removeButton) {
    delete cart[Number(removeButton.dataset.remove)];
    updateCartCount();
    renderCart();
    showToast("Item removed from cart");
  }
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  showToast("This is a demo — checkout is not connected.");
});

document.getElementById("loginButton").addEventListener("click", () => {
  showToast("Login is a demo feature and is not connected to an account.");
});
document.getElementById("sellerButton").addEventListener("click", () => {
  showToast("Seller registration is not available in this demo.");
});

document.getElementById("newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("emailInput");
  if (!email.checkValidity()) {
    email.reportValidity();
    return;
  }
  document.getElementById("newsletterMessage").textContent = "Thanks for signing up! This demo does not store email addresses.";
  email.value = "";
});

[cartDialog, productDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
updateCartCount();
