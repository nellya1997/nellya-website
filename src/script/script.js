'use strict';

//burger-btn
(function () {
  const burgerBtn = document.querySelector('.burger');
  const mobileNav = document.querySelector('.nav');
  const body = document.querySelector('body');
  const header = document.querySelector('.header');

  //при нажатии на якорную ссылку или на ссылку адрес/тлф - мобильное меню также должно закрываться
  //для этого я дал класс js-header-close чтобы получить нужный массив ссылок, при нажатии на которые header будет закрываться
  //получим все ссылки в mobile-header
  const links = Array.from(document.querySelectorAll('.js-header-close'));

  //присваиваем все классы одной функцией:
  function closeHeader() {
    burgerBtn.classList.toggle('burger_active');
    mobileNav.classList.toggle('nav_active');
    body.classList.toggle('stop-scroll');
    header.classList.toggle('header_active');
  }

  //клик по бургеру:
  burgerBtn.addEventListener('click', closeHeader);

  //клик по ссылкам в mobile-header должен работать и отключаться в зависимости от разрешения
  function checkCurrentWidth() {
    if (window.screen.width < 768) {
      links.forEach((el) => {
        el.addEventListener('click', closeHeader);
      });
    } else {
      links.forEach((el) => {
        el.removeEventListener('click', closeHeader);
      });
    }
  }

  checkCurrentWidth();

  //будем следить за поворотом экрана пользователем:
  window.addEventListener('resize', checkCurrentWidth);
})();

/*               SLIDER                 */
/* this is my code I was using in Tattoo web-site, it shall be refactored;
const swiperPortfolio = new Swiper('.portfolio-bottom__swiper', {
  //direction: 'horizontal',
  loop: true,
  slidesPerView: 1,
  allowSlideNext: true,
  allowSlidePrev: true,
  allowTouchMove: true,
  grabCursor: true,
  spaceBetween: 20,
  speed: 1000,
  autoplay: {
    delay: 4000
  },

  navigation: {
    nextEl: '.custom-next',
    prevEl: '.custom-prev',
  },
});
*/
