// js/cart.js
const CART_KEY = "genspace_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  // product = { id, title, price, image_url, type }
  const cart = getCart();
  if (!cart.find(i => i.id === product.id)) {
    cart.push(product);
    saveCart(cart);
  }
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}

function updateCartBadge() {
  const count = getCart().length;
  document.querySelectorAll(".cart-badge").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

document.addEventListener("DOMContentLoaded", updateCartBadge);