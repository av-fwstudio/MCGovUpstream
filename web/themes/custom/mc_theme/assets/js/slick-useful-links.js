(function ($, Drupal, once) {
  Drupal.behaviors.mcUsefulSlick = {
    attach: function (context, settings) {
      $(once('#govLinksTrack', '.slick-slider', context)).slick({
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"></button>',
        nextArrow: '<button type="button" class="slick-next" aria-label="Next"></button>',
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
      });
    }
  };
})(jQuery, Drupal, once);
