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

// first section;
/*
//надо еще потестить: кажется все можно сделать без append.child и потом удоилть эту хуйню:

(function () {
  const firstTitle = document.querySelector('.first__title');
  const first = document.querySelector('.first');

  console.log('works');

  (function () {
    if (window.screen.width > 767) {
      first.prepend(firstTitle);

      console.log('screen width has been changed');
    }
  })();
})();
*/

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


var swiper = new Swiper('.swiper-container', {
  slidesPerView: 2, // Display two slides at a time
  spaceBetween: 30, // Gap between slides
  // Optional: Add navigation buttons
  navigation: {
    nextEl: '.nextButton',
    prevEl: '.prevButton',
  },
  breakpoints: {
    768: {
      slidesPerView: 2, // Display one slide at 768px and below
    },
    0: {
      slidesPerView: 1, // Display one slide at 768px and below
    }
  }
});