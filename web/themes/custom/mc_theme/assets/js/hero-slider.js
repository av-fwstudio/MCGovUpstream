(function ($, Drupal, once) {
  Drupal.behaviors.heroSlider = {
    attach: function (context, settings) {
      $(once('heroSlider', '.hero-content', context)).slick({
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"></button>',
        nextArrow: '<button type="button" class="slick-next" aria-label="Next"></button>',
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 3000,
      });
    }
  };
  Drupal.behaviors.eventGallerySlider = {
    attach: function (context, settings) {
      $(once('eventGallerySlider', '.event-images', context)).each(function () {
        $(this).slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
          arrows: false,
          dots: false,
          infinite: true,
          speed: 500,
          fade: false,
        });
      });
    }
  };
})(jQuery, Drupal, once);
