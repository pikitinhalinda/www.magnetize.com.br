if ($('#slider').length == 0) {
    $('header .navbar-expand').addClass('header-internas');
};

if ($(window).width() < 992) {
    $('.row-slider').slick({
        dots: false,
        infinite: false,
        speed: 300,
        arrows: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 765,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        }, ]
    });
}

var swiperSimples = new Swiper('.swiper-simples', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    dots: true,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
});

$('.slick-simple').slick({
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
});



$('.slick-wrapper').slick({
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
});


$('.slick-timeline').slick({
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    responsive: [{
        breakpoint: 765,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
        }
    }, ]
});


window.scroll({
    top: 0, // Captura a distancia do topo onde deseja ser rolado
    left: 0, // Faz o mesmo do top mas em um ambito horizontal
    behavior: 'smooth' // Aqui eh onde vem toda a magica, ele suporta duas opcoes, o `smooth` e o `normal`
})


/******** controla exibição do lgpd ***********/
timestamp_int = Math.floor(new Date().getTime() / 1000);

if (localStorage.getItem('lgpd') == undefined || parseInt(localStorage.getItem('lgpd')) < timestamp_int) {
    $('#lgpd-modal').addClass('lgpd-modal--show');
    $('.lgpd-modal__btn').on('click', function () {
        $('#lgpd-modal').removeClass('lgpd-modal--show');
        // datas de expiracao de 5 horas
        localStorage.setItem('lgpd', timestamp_int + 5 * 60 * 60);
    });
};
