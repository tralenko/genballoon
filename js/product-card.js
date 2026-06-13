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
