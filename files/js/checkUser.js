var isAutorised = localStorage.getItem('currentUser');
if (isAutorised) {
    document.querySelector('.header_nav').classList.add('header_nav_authorized');
    document.querySelector('.li_nav_sign').style.display = 'none';
} 
