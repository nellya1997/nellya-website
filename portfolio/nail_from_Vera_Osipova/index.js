let swiperWork = document.querySelectorAll('.swiper');

swiperWork.forEach(function (work){
    let swipers = new Swiper(work, {
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 5000,
        },
        loop: true,
    })
    });