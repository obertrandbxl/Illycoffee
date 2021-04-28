var carouselComponent, loyaltyBenefitsCarousel, loyaltyProgramBenefitsCarousel, space, spaceMargin, carouselRows, cardVariableWidthTablet, slidesToShowDesk, slidesToShowTablet;
var seeItLabel = $('.container-justBenefitsCarousel #seeItLabel').val();
var benefitsStatusValues = $().serializeArray();
var oldFocus;

$('#benefitsStatus input[type="hidden"]').each(function(){
    var statusId = $(this).attr('id');
    benefitsStatusValues[statusId] = $(this).val();
});


$(document).ready(function () {
	var params = $().serializeArray();
    var basePath = document.querySelector('meta[name="basePath"]').content;
    var userAccessUrl = basePath + '/.userAccess.json?_' + Date.now();
    
    params.push({ name: 'groupToVerify', value: "loyalty" });
    if (!$('#userProfile').length) {
	    $.ajax({
	      type: 'GET',
	      url: userAccessUrl,
	      data: params,
	      success: function (data, status, xhr) {    	  
			    if($('.loyaltyProgram-wrapper').length){
			        var cluster = $('.level-navigation button[aria-selected="true"]').data('cluster');
			        benefitsRetrieveAndCarouselCreation(cluster);
			    }
	      },
	      error: function (xhr, ajaxOptions, thrownError) {
	        console.log('Something went wrong (status code: ' + xhr.status + ')');
	      }
	    });
    }
});

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
             + '<div class="loyaltyBenefits-text-area"><div class="title">' + title + '</div><div class="subtitle">' + dnProd
             + '</div><div class="row expanded collapse" data-equalizer="cta"><div class="column small-6 container-text" data-equalizer-watch="cta">'
             + '<div>' + seeItLabel + '</div></div><div class="column small-6" data-equalizer-watch="cta"><button class="arrow-style" aria-label="open modal">'
             + '<div class="body-arrow"></div><div class="head-arrow"></div></button></div></div></div></div><div class="loyaltyBenefits-label">'
             + status + '</div></div>';

    return html;
}

function benefitsRetrieveAndCarouselCreation(cluster){
    var basePath = document.querySelector('meta[name="basePath"]').content;
    var userLoggedUrl = basePath + '/.loyaltyGetBenefits.json?_' + Date.now();
    var params = $().serializeArray();
    if(cluster != ''){
        var language = document.querySelector("meta[name='language_country']").content;
        var country = language.substring(3,5).toUpperCase();
        params.push({ name: 'country', value: country });
        params.push({ name: 'cluster', value: cluster });
    }
    $.ajax({
        type: "POST",
        url: userLoggedUrl,
        data: params,
        sync: false,
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
    if(component) {
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
    if ($(window).width() > 1023) {
      setTimeout(() => {
        slidesToShowCount(spaceMargin);
        if(carouselComponent != undefined) carouselComponent.slick('unslick');
        loyaltyBenefitsCarouselInit(carouselComponent, cardVariableWidthTablet, slidesToShowTablet);
        }, 100);
    }
    setTimeout(() => {
        fillModal($('.level-navigation button.active').data('cluster'));
    }, 200);
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
            var country = language.substring(3,5).toUpperCase();
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
                        if (benefit) {
                            $('.loyaltyModal-text-area-content').html(benefit.dnProdExt);
                        }
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