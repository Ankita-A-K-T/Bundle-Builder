const products = [
  {
    id: 1,
    title: "Tie-Dye Lounge Set",
    price: 150,
    image: "assets/product-1.jpg",
  },
  {
    id: 2,
    title: "Sunburst Tracksuit",
    price: 150,
    image: "assets/product-2.jpg",
  },
  {
    id: 3,
    title: "Retro Red Streetwear",
    price: 150,
    image: "assets/product-3.jpg",
  },
  {
    id: 4,
    title: "Urban Sportswear Combo",
    price: 150,
    image: "assets/product-4.jpg",
  },
  {
    id: 5,
    title: "Oversized Knit & Coat",
    price: 150,
    image: "assets/product-5.jpg",
  },
  {
    id: 6,
    title: "Chic Monochrome Blazer",
    price: 150,
    image: "assets/product-6.jpg",
  },
];

const MIN_ITEMS = 3;
const DISCOUNT_RATE = 0.3;
let selected = new Map();

const productGrid = document.getElementById("product-grid");
const selectedList = document.getElementById("selected-list");
const subtotalEl = document.getElementById("subtotal");
const discountEl = document.getElementById("discount");
const totalEl = document.getElementById("total");
const ctaBtn = document.getElementById("cta");
const progressBar = document.getElementById("progress-bar");

function formatCurrency(val) {
  return `$${val.toFixed(2)}`;
}

function renderProducts() {
  productGrid.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <div class="title">${p.title}</div>
      <div class="price">${formatCurrency(p.price)}</div>
      <button class="add-btn ${selected.has(p.id) ? "added" : ""}" data-id="${
      p.id
    }">
        <span>${selected.has(p.id) ? "Added to Bundle" : "Add to Bundle"}</span>
        <span class="icon">
  ${
    selected.has(p.id)
      ? `<img src="assets/icons/Check.svg" alt="Added" style="width:16px; height:16px;">`
      : `<img src="assets/icons/Plus.svg" alt="Add" style="width:16px; height:16px;">`
  }
</span>

      </button>
    `;
    card
      .querySelector(".add-btn")
      .addEventListener("click", () => toggleProduct(p.id));
    productGrid.appendChild(card);
  });
}

function toggleProduct(id) {
  const prod = products.find((p) => p.id === id);
  if (!prod) return;
  selected.has(id)
    ? selected.delete(id)
    : selected.set(id, { ...prod, qty: 1 });
  renderProducts();
  updateSidebar();
}

function updateSidebar() {
  selectedList.innerHTML = "";
  selected.forEach((p) => {
    const li = document.createElement("li");
    li.className = "selected-item";
    li.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <div class="item-info">
        <div class="name">${p.title}</div>
        <div class="price">${formatCurrency(p.price)}</div>
        <div class="bottom-row">
          <div class="qty-controls">
            <button class="qty-btn" data-id="${
              p.id
            }" data-action="decrease">-</button>
            <span>${p.qty}</span>
            <button class="qty-btn" data-id="${
              p.id
            }" data-action="increase">+</button>
          </div>
          <button class="remove-btn" data-id="${p.id}">🗑</button>
        </div>
      </div>
    `;

    li.querySelector(".remove-btn").addEventListener("click", () => {
      selected.delete(p.id);
      renderProducts();
      updateSidebar();
    });
    li.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => changeQty(p.id, btn.dataset.action));
    });
    selectedList.appendChild(li);
  });

  let subtotal = Array.from(selected.values()).reduce(
    (sum, p) => sum + p.price * p.qty,
    0
  );
  let discount = selected.size >= MIN_ITEMS ? subtotal * DISCOUNT_RATE : 0;
  let total = subtotal - discount;

  subtotalEl.textContent = formatCurrency(subtotal);
  discountEl.textContent = `-${formatCurrency(discount)}`;
  totalEl.textContent = formatCurrency(total);

  ctaBtn.disabled = selected.size < MIN_ITEMS;
  ctaBtn.textContent =
    selected.size >= MIN_ITEMS
      ? "Add Bundle to Cart"
      : `Add ${MIN_ITEMS - selected.size} more to Proceed`;

  let progress = Math.min((selected.size / MIN_ITEMS) * 100, 100);
  progressBar.style.width = `${progress}%`;
}

function changeQty(id, action) {
  if (!selected.has(id)) return;
  let prod = selected.get(id);
  if (action === "increase") prod.qty++;
  if (action === "decrease" && prod.qty > 1) prod.qty--;
  selected.set(id, prod);
  updateSidebar();
}

ctaBtn.addEventListener("click", () => {
  alert("Added to cart!");
});

renderProducts();
updateSidebar();
