productItem.addEventListener('click', function() {
    // Получаем ID товара
    var productId = childSnapshot.key;
  
    // Сохраняем ID товара в локальное хранилище
    localStorage.setItem('selectedProductId', productId);
  
    // Переадресация на страницу товара
    window.location.href = '/files/html/item.html';
  });