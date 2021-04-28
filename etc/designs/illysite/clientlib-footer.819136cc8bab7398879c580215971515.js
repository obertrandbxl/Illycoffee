$(window).on("load", function() {
    try {
        apertura_accordion();
        // Get the modal
        var modal = document.getElementById('myModal');

        // Get the button that opens the modal
        var btn = document.getElementById("nationality-butt");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close_modal")[0];

        // When the user clicks the button, open the modal
        if (typeof  btn !=  'undefined'  && btn !=  null) {
            btn.onclick = function() {
                modal.style.display = "block";
            }
        }

        // When the user clicks on <span> (x), close the modal
        if (typeof  span !=  'undefined'  && span !=  null) {
            span.onclick = function() {
                modal.style.display = "none";
            }
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        if ($(window).width() < 767) {

            $(document).ready(function() {
                $(".max-z-index").each(function() {
                    if (!$(this).hasClass("display-none")) {
                        $('.title-pre-footer-container').addClass('margin-bottom-newsletter');
                    }
                });
            });
        }

        $(document).ready(function() {
            $(".div-input").addClass('without-after-element');
        });

    } catch (error) {
        console.error(error);
    }
});



$(window).resize(function() {
    apertura_accordion();
});


function apertura_accordion() {
    if ($(window).width() < 1025) {
        if ($(".section-footer").off()) {
            $(".section-footer").children(".section-footer-content").slideUp();
            $(".section-footer").children(".section-footer-header").children(".toggle-section-footer").children().children().removeClass('plus-active');


            $(".section-footer").on('click', function(e) {
                if ($(this).children(".section-footer-content").is(":not(:hidden)")) {
                    $(this).children(".section-footer-content").slideUp();

                } else {
                    $(".section-footer").children(".section-footer-content").slideUp();
                    $(".section-footer").children(".section-footer-header").children(".toggle-section-footer").children().children().removeClass('plus-active');
                    $(this).children(".section-footer-content").stop().slideToggle();
                }
                if ($(this).children(".section-footer-header").children(".toggle-section-footer").children().children().hasClass('plus-active'))
                    $(this).children(".section-footer-header").children(".toggle-section-footer").children().children().removeClass('plus-active');
                else { $(this).children(".section-footer-header").children(".toggle-section-footer").children().children().addClass('plus-active'); }
            });
        }
    } else {
        $(".section-footer").children(".section-footer-content").slideDown();
        $(".section-footer").off();
    }
}