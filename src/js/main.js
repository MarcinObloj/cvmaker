const burgerBtn = document.querySelector('.hamburger');
const navMobile = document.querySelector('.nav__mobile');
const navLi = document.querySelectorAll('.nav__mobile-item a');
const stepOneBtn = document.querySelector('.threeSteps__btn-one');
const stepTwoBtn = document.querySelector('.threeSteps__btn-two');
const stepThreeBtn = document.querySelector('.threeSteps__btn-three');
const bottomBoxOne = document.querySelector('.threeSteps-box-one');
const bottomBoxTwo = document.querySelector('.threeSteps-box-two');
const bottomBoxThree = document.querySelector('.threeSteps-box-three');
const allBtnsDashboard=document.querySelectorAll('.account-button')
const allStepsBtns = [stepOneBtn, stepTwoBtn, stepThreeBtn];
const allBottomBoxes = [bottomBoxOne, bottomBoxTwo, bottomBoxThree];
console.log(allBtnsDashboard);

let currentIndex = 0;
let intervalId;

const handleBtnStep = (event) => {
    allStepsBtns.forEach(btn => btn.classList.remove('active'));
    allBottomBoxes.forEach(box => box.classList.remove('active-box'));

    event.currentTarget.classList.add('active');
    const index = allStepsBtns.indexOf(event.currentTarget);
    allBottomBoxes[index].classList.add('active-box');

    currentIndex = (index + 1) % allStepsBtns.length;

    clearInterval(intervalId);
    intervalId = setInterval(cycleActiveClass, 10000);
};
const handleBtnActive = (e) => {
    allBtnsDashboard.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
};

const handleBurger = () => {
    navMobile.classList.toggle('nav__mobile--active');
    burgerBtn.classList.toggle('is-active');
};

const handleNavLinks = () => {
    navMobile.classList.remove('nav__mobile--active');
    burgerBtn.classList.remove('is-active');
};
allBtnsDashboard.forEach(btn => {
    btn.addEventListener('click', handleBtnActive);
});
burgerBtn.addEventListener('click', handleBurger);
navLi.forEach((link) => {
    link.addEventListener('click', handleNavLinks);
});
stepOneBtn.addEventListener('click', handleBtnStep);
stepTwoBtn.addEventListener('click', handleBtnStep);
stepThreeBtn.addEventListener('click', handleBtnStep);

const cycleActiveClass = () => {
    allStepsBtns.forEach(btn => btn.classList.remove('active'));
    allBottomBoxes.forEach(box => box.classList.remove('active-box'));

    allStepsBtns[currentIndex].classList.add('active');
    allBottomBoxes[currentIndex].classList.add('active-box');

    currentIndex = (currentIndex + 1) % allStepsBtns.length;
};


intervalId = setInterval(cycleActiveClass, 10000);

cycleActiveClass();
