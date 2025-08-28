(function ($, Drupal, once) {


  Drupal.behaviors.hamburgermenu = {
    attach: function (context, settings) {
      setTimeout(function () {
        var gtrnslate = $('.block-gtranslate');
        var gtransButton = $('.menu--utility-menu').find('.menu .menu-item > button.translate-button');
        if (gtrnslate.length && gtransButton.length) {
          gtrnslate.insertAfter(gtransButton);
        }
      }, 500);

      var $nav = $('.region-slide-in-navigation');

      // Works for any level of expanded menu
      $nav.on('click', '.menu li.expanded > .dropdown-toggle', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();

        var $clickedItem = $(this).closest('li.expanded');

        // Close siblings at the same level
        var $siblings = $clickedItem.siblings('li.expanded');
        $siblings.removeClass('active')
          .find('li.expanded').removeClass('active');

        // Toggle clicked one
        $clickedItem.toggleClass('active');
      });
      // Search form
      $('.region-utility').find('.menu--utility-menu .menu .menu-item > button.text-search').click(function (e) {
        e.preventDefault();
        $(this).parents('.region-utility').find('#block-mc-theme-searchform').toggleClass('active')
      });

      // Increase font size on click
      var defFontSize = 62.5;
      window.Counter = { value: 1 };

      // Load from cookie
      var textSizeUtility = parseInt(Cookies.get('textSizeUtility'));
      if (textSizeUtility && textSizeUtility >= 1 && textSizeUtility <= 10) {
        Counter.value = textSizeUtility;
        var newFontSize = defFontSize + (2.5 * Counter.value);
        $('html').css('font-size', newFontSize + '%');
      }

      // Update button states
      function updateFontSizeButtons() {
        $('.menu--utility-menu').find('.menu .menu-item > .text-size-decrease').toggleClass('disabled', Counter.value <= 1);
        $('.menu--utility-menu').find('.menu .menu-item > .text-size-increase').toggleClass('disabled', Counter.value >= 10);
      }

      $('.menu--utility-menu').find('.menu .menu-item > .text-size-increase').click(function (e) {
        e.preventDefault();
        if (Counter.value < 10) {
          Counter.value++;
          $('html').css('font-size', (defFontSize + 2.5 * Counter.value) + '%');
          Cookies.set('textSizeUtility', Counter.value);
          updateFontSizeButtons();
        }
      });

      $('.menu--utility-menu').find('.menu .menu-item >.text-size-decrease').click(function (e) {
        e.preventDefault();
        if (Counter.value > 1) {
          Counter.value--;
          $('html').css('font-size', (defFontSize + 2.5 * Counter.value) + '%');
          Cookies.set('textSizeUtility', Counter.value);
          updateFontSizeButtons();
        }
      });

      $('.menu--utility-menu').find('.menu .menu-item > .text-size-normal').click(function (e) {
        e.preventDefault();
        Counter.value = 1;
        $('html').css('font-size', defFontSize + '%');
        Cookies.set('textSizeUtility', Counter.value);
        updateFontSizeButtons();
      });
      // Set initial state
      updateFontSizeButtons();


      $(document).ready(function () {
        const $menuToggle = $('#block-mc-theme-menutoggle').find('button.push-menu-toggle');
        const $pushNav = $('.layout-push-navigation');
        $menuToggle.on('click', function (e) {
          e.stopPropagation();
          $pushNav.addClass('active');
        });
        $(document).on('click', function (e) {
          if ($pushNav.hasClass('active') && !$(e.target).closest('.layout-push-navigation, .push-menu-toggle').length) {
            $pushNav.removeClass('active');
          }
        });
        $(document).on('keydown', function (e) {
          if (e.key === 'Escape' && $pushNav.hasClass('active')) {
            $pushNav.removeClass('active');
          }
        });
      });

      $('.layout-push-navigation').find('.push-nav-wrapper >button.push-menu-toggle').on('click', function (e) {
        $(this).parents('.layout-push-navigation').removeClass('active');
      });
      // $('.dashboard-play-btn').on('click', function () {
      //   const $marquee = $(this).closest('.dashboard-content').find('.notification-marquee');
    
      //   $marquee.toggleClass('pause');
    
      // });
      $('.dashboard-play-btn').on("click", function () {
        const $btn = $(this);
        const $card = $btn.closest('.dashboard-card'); // get the nearest card
        const $marquee = $card.find('.notification-marquee'); // find marquee within the same card
        const $image = $btn.find('img');
        console.log($btn )
        console.log($card )
        console.log($marquee )
        // console.log($marquee )

        if ($marquee.length === 0) {
          console.warn('No marquee found for this button');
          return;
        }

        const isPaused = $marquee.toggleClass('pause').hasClass('pause');
        console.log(isPaused )
        const playIcon = drupalSettings.mcTheme?.playIcon || '/themes/custom/mc_theme/assets/images/img_gridicons_play.svg';
        const pauseIcon = drupalSettings.mcTheme?.pauseIcon || '/themes/custom/mc_theme/assets/images/img_vector.svg';

        if (isPaused) {
          $image.attr('src', playIcon);
          $image.attr('alt', 'Play');
        } else {
          $image.attr('src', pauseIcon);
          $image.attr('alt', 'Pause');
        }
      });
      $('.news-play').on("click", function () {
        const marquee = $('.ticker-text');
        const image = $(this).find('img');
      
        const isPaused = marquee.toggleClass('pause').hasClass('pause');
      
        const playIcon = drupalSettings.mcTheme?.playIcon || '/themes/custom/mc_theme/assets/images/img_gridicons_play.svg';
        const pauseIcon = '/themes/custom/mc_theme/assets/images/pause.svg';
      
        if (isPaused) {
          image.attr('src', pauseIcon);
          image.attr('alt', 'Pause');
        } else {
          image.attr('src', playIcon);
          image.attr('alt', 'Play');
        }
      });
      $('.navigation-header .nav-header-content .menu--main .menu-level-0 li > a').on('click', function(e) {
        e.stopImmediatePropagation();
        window.location.href = $(this).attr('href');
      });
        $('.region-slide-in-navigation .menu--main .menu-level-0 li > a').on('click', function(e) {
            e.stopImmediatePropagation();
            window.location.href = $(this).attr('href');
        });
        const $menu = $('.region-slide-in-navigation');
        $menu.off('click.menuToggle');
        $menu.on('click.menuToggle', '.menu--main .menu li.dropdown-item > .fa-angle-down', function (e) {
            e.preventDefault();
            const $clickedItem = $(this).closest('li.dropdown-item');
            if ($clickedItem.hasClass('active')) {
                $clickedItem.removeClass('active');
            } else {
                $clickedItem.siblings('li.dropdown-item').removeClass('active');
                $clickedItem.addClass('active');
            }
        });
      // gallery
      $('.image-popup').magnificPopup({
        type: 'image',
        gallery: {
          enabled: true,
          closeBtnInside: true
        }
      });
    }
  };

  /**
   * Simple navigation dropdown behavior.
   */
  // Drupal.behaviors.navigationDropdown = {
  //   attach: function (context, settings) {
  //
  //     // Handle dropdown toggles
  //     $('.dropdown-toggle', context).once('nav-dropdown').on('click', function(e) {
  //       e.preventDefault();
  //
  //       const $toggle = $(this);
  //       const $dropdownItem = $toggle.closest('.dropdown-item');
  //       const $dropdownMenu = $dropdownItem.find('.dropdown-menu-list').first();
  //
  //       // Close all other dropdowns
  //       $('.dropdown-item').not($dropdownItem).removeClass('open')
  //         .find('.dropdown-menu-list').slideUp(200);
  //
  //       // Toggle current dropdown
  //       if ($dropdownItem.hasClass('open')) {
  //         $dropdownItem.removeClass('open');
  //         $dropdownMenu.slideUp(200);
  //       } else {
  //         $dropdownItem.addClass('open');
  //         $dropdownMenu.slideDown(200);
  //       }
  //     });
  //
  //     // Close dropdowns when clicking outside
  //     $(document).on('click', function(e) {
  //       if (!$(e.target).closest('.dropdown-item').length) {
  //         $('.dropdown-item.open').removeClass('open')
  //           .find('.dropdown-menu-list').slideUp(200);
  //       }
  //     });
  //
  //   }
  // };
})(jQuery, Drupal, once);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('img[src$=".svg"]').forEach(img => {
    const imgURL = img.getAttribute('src');

    fetch(imgURL)
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.querySelector("svg");

        if (svgElement) {
          // Copy ID and classes from the original <img> to the inline <svg>
          if (img.id) svgElement.id = img.id;
          if (img.className) svgElement.classList.add(...img.className.split(/\s+/));

          // Copy any other data-* attributes
          Array.from(img.attributes).forEach(attr => {
            if (/^data-/.test(attr.name)) {
              svgElement.setAttribute(attr.name, attr.value);
            }
          });

          // Replace <img> with inline <svg>
          img.replaceWith(svgElement);
        }
      })
      .catch(err => console.error("Error loading SVG:", err));
  });
});
