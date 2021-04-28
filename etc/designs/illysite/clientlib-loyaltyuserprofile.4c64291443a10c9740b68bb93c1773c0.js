var widthProgressBar = $('.loyaltyUserProfile-wrapper').find('.loyaltyUserProfile-progressBar');
var widthProgressBarFilled = $('.loyaltyUserProfile-wrapper').find('.loyaltyUserProfile-progressBar-filled');
var progressBarScore = $('.loyaltyUserProfile-wrapper').find('.loyaltyUserProfile-progressBar-filled-score');
var userScore;
var level02ScoreText = $('.loyaltyUserProfile-wrapper').find('.level-02-score');
var level03ScoreText = $('.loyaltyUserProfile-wrapper').find('.level-03-score');
var containerTop = $('.loyaltyUserProfile-wrapper').find('.container-top-img');
var oldFocus;

//BENEFITS
var carouselComponent, loyaltyBenefitsCarousel, loyaltyProgramBenefitsCarousel, space, spaceMargin, carouselRows, cardVariableWidthTablet, slidesToShowDesk, slidesToShowTablet;
var seeItLabel = $('.container-justBenefitsCarousel #seeItLabel').val();
var benefitsStatusValues = $().serializeArray();

$('#benefitsStatus input[type="hidden"]').each(function(){
    var statusId = $(this).attr('id');
    benefitsStatusValues[statusId] = $(this).val();
});

$(document).ready(function () {

    if ($('#userProfile').length) {

    var loyaltyUserCookie = getCookie("loyalty_login_res");
    if (loyaltyUserCookie && loyaltyUserCookie != '') {

        var cluster = getCookie("cluster_user").toLowerCase();
        var loyaltyUserDecoded = decode64(loyaltyUserCookie);
        var loyaltyUser = JSON.parse(loyaltyUserDecoded);
        var name = loyaltyUser.name;
        var initialsContainer = $('.loyaltyUserProfile-wrapper .user-avatar').find('.content-txt');
        var userNameContainer = $('.loyaltyUserProfile-wrapper').find('.user-name');
        var clusterContainer = $('.loyaltyUserProfile-wrapper').find('#cluster');
        var salutation = userNameContainer.text();
        var initials = getInitials(loyaltyUser.name,loyaltyUser.lastname);
        /*if(cluster == 'explorer'){
            var backgroundImage = $('#level1-background').val();
            $('.loyaltyUserProfile-wrapper .container-top-img').attr('style','background-image: url(' + backgroundImage + ');');
        }else if(cluster == 'master'){
            var backgroundImage = $('#level2-background').val();
            $('.loyaltyUserProfile-wrapper .container-top-img').attr('style','background-image: url(' + backgroundImage + ');');
        }else if(cluster == 'ambassador'){
            var backgroundImage = $('#level3-background').val();
            $('.loyaltyUserProfile-wrapper .container-top-img').attr('style','background-image: url(' + backgroundImage + ');');
        }*/
        var socialUserCookie = getCookie("social_login_res");
        if(loyaltyUser.photo != '' && loyaltyUser.photo != undefined){
            $('#userProfileImage').attr('src',loyaltyUser.photo);
            $('#userProfileImage').removeClass('hide');
            initialsContainer.addClass('hide');

        } else if(socialUserCookie && socialUserCookie != ''){
            var socialUserDecoded = decode64(socialUserCookie);
            var socialUser = JSON.parse(socialUserDecoded);
            if(socialUser.photo != '' && socialUser.photo != undefined){
                $('#userProfileImage').attr('src',socialUser.photo);
                $('#userProfileImage').removeClass('hide');
                initialsContainer.addClass('hide');
            }else{
                initialsContainer.text(initials);
            }
        } else{
            initialsContainer.text(initials);
        }

        userNameContainer.text(salutation + ' ' + name.charAt(0).toUpperCase() + name.slice(1));
        clusterContainer.text(cluster.charAt(0).toUpperCase() + cluster.slice(1));

    }

        var basePath = location.pathname.replace(".html","");
        var balancePointsUrl = basePath + '/.getBalancePointLoyalty.json?_' + Date.now();
        var params = $().serializeArray();
        $.ajax({
            type: 'POST',
            url: balancePointsUrl,
            data: params,
            async: true,
            success: function (data, status, xhr) {
                try {
                    console.log('test success' + xhr.status);
                    if (data && data.entityList && data.entityList.saldoDisponibile) {
                        userScore = data.entityList.saldoDisponibile.points;
                        progressBarWidth();

                        var score = parseInt($('.loyaltyUserProfile-progressBar-filled-score').html());
                        var secondScore = parseInt($('#level02Score').val());
                        var thirdScore = parseInt($('#level03Score').val());

                        if (score >= 0 && score < secondScore) {
                            if ($(window).width() > 767) {
                                $('.container-top-img').css('background-image', 'url(' + $('#level-01-desktop').val() + ')');
                            } else {
                                $('.container-top-img').css('background-image', 'url(' + $('#level-01-mobile').val() + ')');
                            }
                        }
                        if (score >= secondScore && score < thirdScore) {
                            if ($(window).width() > 767) {
                                $('.container-top-img').css('background-image', 'url(' + $('#level-02-desktop').val() + ')');
                            } else {
                                $('.container-top-img').css('background-image', 'url(' + $('#level-02-mobile').val() + ')');
                            }
                        }
                        if (score >= thirdScore) {
                            if ($(window).width() > 767) {
                                $('.container-top-img').css('background-image', 'url(' + $('#level-03-desktop').val() + ')');
                            } else {
                                $('.container-top-img').css('background-image', 'url(' + $('#level-03-mobile').val() + ')');
                            }
                        }

                        var remainingPointsLabel = $('#remainingPoints').html();
                        var remainingPoints;
                        if (userScore < secondScore) {
                            remainingPoints = secondScore - userScore;
                        } else if (userScore < thirdScore) {
                            remainingPoints = thirdScore - userScore;
                        }
                        if(!(userScore >= thirdScore)){
                            $('#remainingPoints').html(remainingPointsLabel.replace('{0}', remainingPoints));
                            $('#remainingPoints').removeClass('hide');
                        }
                    }
                    $('#userProfile').removeClass('invisible');
                    progressBarWidth()
                }
                catch(er) {
                    console.error(er);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log('Something went wrong (status code: ' + xhr.status + ')');
            }
        });

    }



    //BENEFITS CALL
    if($('.loyaltyBenefitsCarousel-wrapper').length){
        benefitsRetrieveAndCarouselCreation('');
    }



	    
	}); 

function progressBarWidth() {
    // variabili che devono leggere i valori configurati da dialog, qui simulate con lettura dai campi hidden sopra
    var level02Score = parseInt($('#level02Score').val());
    var level03Score = parseInt($('#level03Score').val());

    // posizionamento marker livello 2
    var level02Position = (widthProgressBar.width() * level02Score / level03Score);
    $('.level-02').css('left', level02Position + 'px');

    // visualizzazione del livello raggiunto (label, marker, immagine testata)
    if (userScore < 0) {
      $('.level-step').removeClass('level-reached');
      $('.level-step .level-icon img').hide();
    }
    if (userScore >= 0 && userScore < level02Score) {
      $('.level-step').removeClass('level-reached');
      $('.level-01').addClass('level-reached');
      $('.level-step .level-icon img').hide();
      $('.level-01 .level-icon img').show();
      if ($(window).width() > 767) {
        containerTop.css('background-image', 'url(' + $('#level-01-desktop').val() + ')');
      } else {
        containerTop.css('background-image', 'url(' + $('#level-01-mobile').val() + ')');
      }
    }
    if (userScore >= level02Score && userScore < level03Score) {
      $('.level-step').removeClass('level-reached');
      $('.level-01').addClass('level-passed');
      $('.level-02').addClass('level-reached');
      $('.level-step .level-icon img').hide();
      $('.level-02 .level-icon img').show();
      if ($(window).width() > 767) {
        containerTop.css('background-image', 'url(' + $('#level-02-desktop').val() + ')');
      } else {
        containerTop.css('background-image', 'url(' + $('#level-02-mobile').val() + ')');
      }
    }
    if (userScore >= level03Score) {
      $('.level-step').removeClass('level-reached');
      $('.level-01').addClass('level-passed');
      $('.level-02').addClass('level-passed');
      $('.level-03').addClass('level-reached');
      $('.level-step .level-icon img').hide();
      $('.level-03 .level-icon img').show();
      if ($(window).width() > 767) {
        containerTop.css('background-image', 'url(' + $('#level-03-desktop').val() + ')');
      } else {
        containerTop.css('background-image', 'url(' + $('#level-03-mobile').val() + ')');
      }
    }

    // posizionamento cursore utente e riempimento barra
    var userPosition;
    if ($(window).width() > 767) {
      userPosition = (widthProgressBar.width() * userScore / level03Score) + 18;
    } else {
      userPosition = (widthProgressBar.width() * userScore / level03Score) + 12;
    }
    if (userScore >= 0) {
      if ((userScore <= (level03Score)) && (userPosition < widthProgressBar.width())) {
        widthProgressBarFilled.css("width", userPosition);
      } else {
        widthProgressBarFilled.css("width", widthProgressBar.width());
      }
    }

    // testo punteggio livelli
    level02ScoreText.html(level02Score);
    level03ScoreText.html(level03Score);

    // testo punteggio utente
    progressBarScore.html(userScore);

  }


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getInitials(firstName,lastName) {
    var firstNameInitials = firstName.substring(0,1);
    var lastNameInitials = lastName.substring(0,1);
    var initials = firstNameInitials + lastNameInitials;
    return initials.toUpperCase();
}

$('.level-navigation button').on('click',function(){
    $('.container-justBenefitsCarousel').removeClass('container-justBenefitsCarousel-visible');
    benefitsRetrieveAndCarouselCreation($(this).data('cluster'));
});

function slidesToShowCount(offset) {
    if ($('.loyaltyBenefitsCarousel-wrapper').length) {
      space = $(window).width();
      slidesToShowDesk = Math.trunc(((space - offset) / 240));
    }
    if ($('.loyaltyProgram-wrapper').length) {
      space = $('.loyaltyProgram-wrapper').find('.program-cards').outerWidth();
      if ($(window).width() >= 1440) {
        slidesToShowDesk = Math.trunc(((space - offset) / 255));
     } else {
       slidesToShowDesk = 2;
     }
    }
  }

function cardHtmlCreation(benefit){
    var title = benefit.title;
    var dnProd = benefit.dnProd;
    var dnProdExt = benefit.dnProdExt;
    var statusCode = benefit.status;
    var status = benefitsStatusValues[statusCode];
    var img1 = benefit.img1;
    var img2 = benefit.img2;
    var img1p = benefit.img1p;
    var id = benefit.idRewardRule;
    var expireDate = benefit.extraData['expireDate'];
    var benefitBackgroundType = '';
    var benefitIcon = '';
    var benefitBackground = '';
    var benefitCardImage = '';
    var benefitModalImage = '';
    var iconStatus = 'hide';

    if(img2 != ''){
        iconStatus = '';
        benefitBackgroundType = 'color';
        if(statusCode == 'USED' || statusCode == 'EXPIRED'){
            benefitIcon = img1;
            benefitBackground = 'used-card-icon';
        } else {
            benefitIcon = img2;
            benefitBackground = '';
        }
    }else{
        benefitBackgroundType = 'image';
        benefitBackground = 'white-content';
        benefitCardImage = 'style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .7)), url(' + img1 + ');"';
        benefitModalImage = img1p;
    }

    var hiddenValuesForModal = '<div class="display-none" id="modalValues">'
                             + '<input type="hidden" id="benefitTitle" value="' + title + '">'
                             + '<input type="hidden" id="benefitId" value="' + id + '">'
                             + '<input type="hidden" id="benefitStatus" value="' + status + '">'
                             + '<input type="hidden" id="benefitStatusCode" value="' + statusCode + '">'
                             + '<input type="hidden" id="benefitDnProd" value="' + dnProd + '">'
                             + '<input type="hidden" id="benefitDnProdExt" value="' + dnProdExt + '">'
                             + '<input type="hidden" id="benefitExpireDate" value="' + expireDate + '">'
                             + '<input type="hidden" id="benefitIcon" value="' + benefitIcon + '">'
                             + '<input type="hidden" id="benefitBackgroundType" value="' + benefitBackgroundType + '">'
                             + '<input type="hidden" id="benefitBackground" value="' + benefitBackground + '">'
                             + '<input type="hidden" id="benefitModalImage" value="' + benefitModalImage + '"></div>';

    var html = '<div class="loyaltyBenefits-carousel-item ' + benefitBackground + '"><div class="loyaltyBenefits-carousel-item-card" ' + benefitCardImage + '>' + hiddenValuesForModal
             + '<div class="icon-benefits ' + iconStatus + '"><img src="' + benefitIcon + '" alt=""></div>'
             + '<div class="loyaltyBenefits-text-area p-b-5"><div class="title p-l-21">' + title + '</div><div class="subtitle p-l-21">' + dnProd
             + '</div><div class="row expanded collapse" data-equalizer="cta"><div class="column small-6 container-text" data-equalizer-watch="cta">'
             + '<div class="p-l-21">' + seeItLabel + '</div></div><div class="column small-6" data-equalizer-watch="cta"><button class="arrow-style" aria-label="open modal">'
             + '<div class="body-arrow"></div><div class="head-arrow"></div></button></div></div></div></div><div class="loyaltyBenefits-label p-t-8 p-l-21">'
             + status + '</div></div>';

    return html;
}

function benefitsRetrieveAndCarouselCreation(cluster){
    var basePath = document.querySelector('meta[name="basePath"]').content;
    var userLoggedUrl = basePath + '/.loyaltyGetBenefits.json?_' + Date.now();
    var params = $().serializeArray();
    if(cluster != ''){
        var language = document.querySelector("meta[name='language_country']").content;
        var country = language.substring(0,2).toUpperCase();
        params.push({ name: 'country', value: country });
        params.push({ name: 'cluster', value: cluster });
    }
    $.ajax({
        type: "POST",
        url: userLoggedUrl,
        data: params,
        async: true,
        success: function (data, status, xhr) {
            if(data.code == '200'){
                var benefits = data.entityList;
                $('.container-justBenefitsCarousel').text('');
                var carousel = '<div class="row"><div class="column small-12"><div class="container-left-arrow"><button class="slick-prev" aria-label="vai alla slide precedente">'
                             + '</button></div><div class="loyaltyBenefitsCarousel-slick">';

                $(benefits).each(function(){
                    var benefitCardHtml = cardHtmlCreation(this);
                    carousel = carousel + benefitCardHtml;
                });

                carousel = carousel + '</div><div class="container-right-arrow"><button class="slick-next" aria-label="vai alla slide successiva"></button></div></div></div>';
                $('.container-justBenefitsCarousel').append(carousel);
                loyaltyBenefitsCarousel = $('.loyaltyBenefitsCarousel-wrapper').find('.loyaltyBenefitsCarousel-slick');
                loyaltyProgramBenefitsCarousel = $('.loyaltyProgram-wrapper').find('.loyaltyBenefitsCarousel-slick');
                if ($('.loyaltyProgram-wrapper').length) {
                    carouselComponent = loyaltyProgramBenefitsCarousel;
                    spaceMargin = 0;
                    carouselRows = 2;
                    cardVariableWidthTablet = true;
                    slidesToShowTablet = 1;
                  }
                if ($('.loyaltyBenefitsCarousel-wrapper').length) {
                    carouselComponent = loyaltyBenefitsCarousel;
                    spaceMargin = 34;
                    carouselRows = 1;
                    cardVariableWidthTablet = false;
                    slidesToShowTablet = 3;                 
                }
                slidesToShowCount(spaceMargin);
                loyaltyBenefitsCarouselInit(carouselComponent, cardVariableWidthTablet, slidesToShowTablet);
                fillModal(cluster);
                if($('.loyaltyProgram-wrapper').length){
                    setTimeout(() => {
                        $('.container-justBenefitsCarousel').addClass('container-justBenefitsCarousel-visible');
                    }, 100);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log("Something went wrong (status code: " + xhr.status + ")");
        }
    });
}

function loyaltyBenefitsCarouselInit(component, cardWidth, slidesTablet) {
    if (component) {
        component.each(function () {
            $(this).slick({
                cssEase: 'linear',
                touchThreshold: 50,
                slidesToShow: slidesToShowDesk,
                slidesToScroll: 1,
                rows: carouselRows,
                variableWidth: false,
                prevArrow: $(this).siblings('.container-left-arrow'),
                nextArrow: $(this).siblings('.container-right-arrow'),
                infinite: false,
                draggable: false,
                responsive: [
                    {//desktop small
                        breakpoint: 1440,
                        settings: {
                            slidesToShow: slidesToShowDesk
                        }
                    },
                    {//tablet
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: slidesTablet,
                            variableWidth: cardWidth
                        }
                    },
                    {//mobile
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            rows: 1,
                            variableWidth: false
                        }
                    },
                ]
            });
        });
    }
}

$(window).resize(function () {
  progressBarWidth();
    if ($(window).width() > 1023) {
      setTimeout(() => {
        slidesToShowCount(spaceMargin);
        if(carouselComponent != undefined) carouselComponent.slick('unslick');
        loyaltyBenefitsCarouselInit(carouselComponent, cardVariableWidthTablet, slidesToShowTablet);
      }, 100);
    }
});

function fillModal(cluster){
    $('.loyaltyBenefits-carousel-item-card').each(function(){
        $(this).on('click keydown', function(){
            var loyaltyProgramContainer = $(this).parents('.loyaltyProgram-wrapper');
            var modalValues = $(this).find('#modalValues');
            var modalContainer = $('.loyaltyModalStructure-wrapper');
            var benefitTitle = modalValues.find('#benefitTitle').val();
            var benefitStatus = modalValues.find('#benefitStatus').val();
            var benefitStatusCode = modalValues.find('#benefitStatusCode').val();
            var benefitDnProd = modalValues.find('#benefitDnProd').val();
            var benefitId = modalValues.find('#benefitId').val();
            var benefitExpireDate = modalValues.find('#benefitExpireDate').val();
            var benefitIcon = modalValues.find('#benefitIcon').val();
            var benefitBackgroundType = modalValues.find('#benefitBackgroundType').val();
            var benefitBackground = modalValues.find('#benefitBackground').val();
            var benefitModalImage = modalValues.find('#benefitModalImage').val();

            var availabilityLabel = modalValues.find('#availabilityLabel').val();
            var ctaActiveLabel = modalValues.find('#ctaActiveLabel').val();
            var ctaUsedLabel = modalValues.find('#ctaUsedLabel').val();

            $('.benefit-title').text(benefitTitle);
            $('.benefit-label').text(benefitStatus);
            if(loyaltyProgramContainer.length){
                $('.benefit-label').addClass('hide');
            }else{
                $('.benefit-date-descritpion').text(availabilityLabel);
                $('.benefit-date').text(benefitDnProd);
            }
            var basePath = document.querySelector('meta[name="basePath"]').content;
            var url = basePath + '/.loyaltyGetBenefitDetail.json?_' + Date.now();
            var params = $().serializeArray();
            params.push({ name: 'idRewardRule', value: benefitId });
            var language = document.querySelector("meta[name='language_country']").content;
            var country = language.substring(0,2).toUpperCase();
            params.push({ name: 'country', value: country });
            params.push({ name: 'cluster', value: cluster });

            $.ajax({
                type: "POST",
                url: url,
                data: params,
                sync: false,
                success: function (data, status, xhr) {
                    if(data.code == '200'){
                        var benefit = data.entityList;
                        $('.loyaltyModal-text-area-content').html(benefit.dnProdExt);
                    }
                    $('.loyaltyModalStructure-wrapper').removeClass('hide');
                    $('.loyaltyModalStructure-wrapper').find('.close-loyaltyModal').focus();
                    $('body').css('overflow', 'hidden');
                    oldFocus = $(this).find('button');
                },
                error: function (xhr, ajaxOptions, thrownError) {
                  console.log("Something went wrong (status code: " + xhr.status + ")");
                  $('.loyaltyModalStructure-wrapper').removeClass('hide');
                  $('.loyaltyModalStructure-wrapper').find('.close-loyaltyModal').focus();
                  $('body').css('overflow', 'hidden');
                  oldFocus = $(this).find('button');
                }
            });


            /*if(benefitStatusCode == 'AVAILABLE' || benefitStatusCode == 'ACTIVE'){
                $('.loyaltyButtonActive').removeClass('hide');
                $('.loyaltyButtonUsed').addClass('hide');

            }else if(benefitStatusCode == 'USED'){
                $('.loyaltyButtonActive').addClass('hide');
                $('.loyaltyButtonUsed').removeClass('hide');
            }*/
            if(benefitBackgroundType == 'color'){
                $('.icon-benefit img').attr('src', benefitIcon);
                $('.icon-benefit').removeClass('hide');
                $('.loyaltyModal-background').removeAttr('style');
                if(benefitStatusCode == 'USED' || benefitStatusCode == 'EXPIRED'){
                    $('.loyaltyModal-container').attr('style','background-image: linear-gradient(to bottom, #c1c2c3, #63666a);');
                    $('.loyaltyModal-container').removeClass('icon-case');
                } else {
                    $('.loyaltyModal-container').attr('style','background-color: white;');
                    $('.loyaltyModal-container').addClass('icon-case');
                }
            }else if(benefitBackgroundType == 'image'){
                $('.icon-benefit').addClass('hide');
          		$('.loyaltyModal-container').removeClass('icon-case');
                if (benefitStatusCode == 'USED' || benefitStatusCode == 'EXPIRED'){
                    $('.loyaltyModal-background').attr('style','background-image: linear-gradient(to bottom, #c1c2c3, #63666a), url(' + benefitModalImage + ');');
                } else {
                    $('.loyaltyModal-background').attr('style','background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.47)), url(' + benefitModalImage + ');');
                }
            }
        });
     });

    $('.loyaltyModalStructure-wrapper').find('.close-loyaltyModal').on("click keydown", function (e) {
        if (e.keyCode == 13 || e.button == 0) {
            $('.loyaltyModalStructure-wrapper').addClass('hide');
            $('body').css('overflow', 'auto');
            oldFocus.focus();
        }
    });

    $('.loyaltyModalStructure-wrapper').find('.loyaltyModal-overlay').on("click", function () {
        $('.loyaltyModalStructure-wrapper').addClass('hide');
        $('body').css('overflow', 'auto');
        oldFocus.focus();
    });
}