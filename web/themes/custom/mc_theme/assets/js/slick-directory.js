(function ($, Drupal, once) {
  Drupal.behaviors.mcSlick = {
    attach: function (context, settings) {
      $(once('carousel-track', '.slick-slider', context)).slick({
        arrows: true,
        dots: false,
        prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"></button>',
        nextArrow: '<button type="button" class="slick-next" aria-label="Next"></button>',
        autoplay: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }
  };

  // Drupal.behaviors.mcUsefulSlick = {
  //   attach: function (context, settings) {
  //     $(once('#govLinksTrack', '.slick-slider', context)).slick({
  //       arrows: true,
  //       prevArrow: '<button type="button" class="slick-prev" aria-label="Previous"></button>',
  //       nextArrow: '<button type="button" class="slick-next" aria-label="Next"></button>',
  //       dots: true,
  //       infinite: true,
  //       speed: 300,
  //       slidesToShow: 1,
  //       centerMode: true,
  //       variableWidth: true,
  //     });
  //   }
  // };
})(jQuery, Drupal, once);
