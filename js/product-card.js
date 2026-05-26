document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.catalog-product-grid');
  if (!grid) return;

  // 1. ОТРИСОВКА КАСТОМНЫХ ТОВАРОВ ИЗ ХРАНИЛИЩА СТРОГО ПО ВАШЕЙ НОВОЙ СТРУКТУРЕ
  const renderCustomProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('customProducts')) || {};
    
    Object.keys(storedProducts).forEach(id => {
      const p = storedProducts[id];
      
      const cardHtml = `
        <div class="product-card" data-id="${id}">
            <div class="product-thumbnail">
              <img class="p-thumbnail" src="${p.img}" alt="${p.title}">
            </div>
            <div class="product-name-box">
                <p class="product-name">${p.title}</p> 
            </div>
            <div class="product-description">
              <div class="p-description-text">
                <p>${p.desc}</p>
              </div>
            </div>
            <div class="p-start-course">
              <a href="product.html?id=${id}" class="p-buy-link">BUY</a>
            </div>
            <div class="p-price-box">
              <div class="p-price-ammount-box">
                <p>${p.price}</p>
              </div>
            </div>
        </div>
      `;
      grid.insertAdjacentHTML('beforeend', cardHtml);
    });
  };

  renderCustomProducts();

  // 2. ОТКРЫТИЕ СТРАНИЦЫ ПРИ КЛИКЕ НА ЛЮБУЮ ОБЛАСТЬ КАРТОЧКИ
  grid.addEventListener('click', (e) => {
    // Находим карточку товара, по которой кликнули
    const card = e.target.closest('.product-card');
    if (!card) return;

    const productId = card.getAttribute('data-id');
    
    // Если кликнули на саму карточку, перенаправляем на страницу товара
    if (productId) {
      window.location.href = `product.html?id=${productId}`;
    }
  });
});