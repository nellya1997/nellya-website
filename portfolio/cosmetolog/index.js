// Виды услуг
const button = document.querySelector('#button');
const content = document.querySelector('#content');

button.addEventListener('click', function () {
  content.classList.toggle('none');
});

// faq открыть закрыть
const faqButton = document.querySelector('#faq-button');
const faqContent = document.querySelector('#faq-content');

faqButton.addEventListener('click', function () {
  faqContent.classList.toggle('none');
});

// faq аккордеон
// const faqQuestion = document.querySelectorAll('[data-name="faq-question"]');

// faqQuestion.forEach(function (item) {
//   item.addEventListener('click', showAnswer);
// });
// function showAnswer(item) {
//   this.nextElementSibling.classList.toggle('none');
// }

document.addEventListener('DOMContentLoaded', () => {
  const accordions = document.querySelectorAll('.faq__item');
  accordions.forEach(element => {
      element.addEventListener('click', (e) => {
          const self = e.currentTarget;
          const control = self.querySelector('.faq__item-question');
          const content = self.querySelector('.faq__item-answer');

          self.classList.toggle('open');

          if (self.classList.contains('open')) {
              control.setAttribute('aria-expanded', true);
              control.setAttribute('aria-hidden', false);
              content.style.maxHeight = content.scrollHeight + 'px';
          } else {
              control.setAttribute('aria-expanded', false);
              control.setAttribute('aria-hidden', true);
              content .style.maxHeight = null;
          }
      });
  });
});
//  swipers

const swiper = new Swiper('.swiper', {
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,
  spaceBetween: 50,
  pagination: {
    clickable: true,
    renderBullet: function(index, className) {
      return '\
      <span class="customPagination ' + className + '"></span>'
    },
    el: '.swiper-pagination'
  },
});

/*
const swiper = new Swiper('.swiper', {
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,
  spaceBetween: 50,
  pagination: {
    clickable: true,
    renderBullet: function(index, className) {
      return '\
      <span class="customPagination ' + className + '"><svg width="20" height="20" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.95236 15.4762L0.580781 0.9762L17.3239 0.976202L8.95236 15.4762Z" fill="#D9D9D9"/></svg></span>'
    },
    el: '.swiper-pagination'
  },
});
*/