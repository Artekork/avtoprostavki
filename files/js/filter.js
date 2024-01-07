// Фильтр брендов
document.querySelector('.filter-drop-list__tittle').addEventListener('click', function(){
  document.querySelector('.filter__drop-list').classList.toggle('filter__drop-list_active');
})

document.querySelector('.tittle-sort__by-price').addEventListener('click', function(){
  if (this.classList.contains('tittle-sort__by-price_bottom-top')) {
    this.classList.remove('tittle-sort__by-price_bottom-top');
    this.classList.add('tittle-sort__by-price_top-bottom');
  } else if (this.classList.contains('tittle-sort__by-price_top-bottom')) {
    this.classList.remove('tittle-sort__by-price_top-bottom');
    this.classList.add('tittle-sort__by-price_bottom-top');
  } else {
    this.classList.add('tittle-sort__by-price_bottom-top');
  }

  document.querySelector('.tittle-sort__by-novelty').classList.remove('tittle-sort__by-novelty_active');
});

document.querySelector('.tittle-sort__by-novelty').addEventListener('click', function(){
  document.querySelector('.tittle-sort__by-price').classList.remove('tittle-sort__by-price_bottom-top', 'tittle-sort__by-price_top-bottom');

  this.classList.add('tittle-sort__by-novelty_active');
});