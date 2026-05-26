// Базовые (жестко прописанные) товары
const baseProducts = {
  "painting-full": {
    title: "Painting tutorial - full + free gift as digital",
    img: "card thumbnail/thumbnail-2.jpeg",
    fullDesc: "Learn how to create stunning decorative paintings step-by-step. This full course includes high-quality video lessons, architectural tricks, and a special digital gift.",
    price: "$4.99"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) return;

  // Берем динамические товары
  const customProducts = JSON.parse(localStorage.getItem('customProducts')) || {};

  // Ищем совпадение ID в базовых или в кастомных товарах
  const product = baseProducts[productId] || customProducts[productId];

  if (product) {
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-img').src = product.img;
    document.getElementById('product-img').alt = product.title;
    
    // Подставляем полное описание, либо дефолтное краткое
    const descriptionText = product.fullDesc || product.desc;
    document.getElementById('product-desc').innerHTML = `<p>${descriptionText}</p>`;
    
    document.getElementById('product-price').textContent = product.price;
    document.title = product.title;
  } else {
    document.querySelector('.product-page-container').innerHTML = `
      <div style="grid-column: span 2; text-align: center; padding: 40px 0; font-family: 'Roboto', sans-serif;">
        <h2>Product not found</h2>
        <a href="product-catalog.html" style="color: rgb(79, 178, 61);">Back to catalog</a>
      </div>
    `;
  }
});