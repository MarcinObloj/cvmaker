const burgerBtn = document.querySelector('.hamburger');
const navMobile = document.querySelector('.nav__mobile');
const navLi = document.querySelectorAll('.nav__mobile-item a');
const handleBurger = () => {
	navMobile.classList.toggle('nav__mobile--active');
	burgerBtn.classList.toggle('is-active');
};
console.log(navLi);
const handleNavLinks = () => {
	navMobile.classList.remove('nav__mobile--active');
	burgerBtn.classList.remove('is-active');
};
burgerBtn.addEventListener('click', handleBurger);
navLi.forEach((link) => {
	link.addEventListener('click', handleNavLinks);
});
