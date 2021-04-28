document.addEventListener("DOMContentLoaded", function() {
    var lazyloadImages;
    if ("IntersectionObserver" in window) {
        lazyloadImages = document.querySelectorAll(".lazy");
        var imageObserver = new IntersectionObserver(function(entries, observer) { 
            entries.forEach(function(entry) {
              if (entry.isIntersecting && !$(entry.target).parents().hasClass('header-botrow')) {
                if($(entry.target).parents().hasClass('slick-slider') && !$(entry.target).parents().hasClass('heroCarousel-wrapper')){       
                    $(entry.target).parents('.slick-slider').find('.slick-slide img.lazy').each(function() { 
                      var image = $(this);
                      image.attr('src',image.data('src'));
                      image.removeClass("lazy"); 
                    });  
                }else{
                  var image = entry.target; 
                  image.src = image.dataset.src;
                  image.classList.remove("lazy"); 
                }
                imageObserver.unobserve(entry.target);
              }
          });
        }, {rootMargin: "0px 0px 350px 0px"});
 
        lazyloadImages.forEach(function(image) {
            imageObserver.observe(image);
        });
    } else {
        var lazyloadThrottleTimeout;
        lazyloadImages = document.querySelectorAll(".lazy");
 
        function lazyload() {
            if (lazyloadThrottleTimeout) {
                clearTimeout(lazyloadThrottleTimeout);
            }
 
           lazyloadThrottleTimeout = setTimeout(function() {
                var scrollTop = window.pageYOffset;
                lazyloadImages.forEach(function(img) {
                    if (img.offsetTop < (window.innerHeight + scrollTop)) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                });
                if (lazyloadImages.length == 0) {
                    document.removeEventListener("scroll", lazyload);
                   window.removeEventListener("resize", lazyload);
                    window.removeEventListener("orientationChange", lazyload);
                }
            }, 20);
        }
 
        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
    }
});

// Lazy on hover for header

$('.main-menu__level-1').hover(function(){ 
  lazyHeader($(this));
});
$('.main-menu__level-1').on("click",function(){ 
  lazyHeader($(this));
});

function lazyHeader(e) {
  $(e).find('img').each(function() {  
    var image = $(this);
    image.attr('src',image.data('src'));
    image.removeClass("lazy");
  });
}