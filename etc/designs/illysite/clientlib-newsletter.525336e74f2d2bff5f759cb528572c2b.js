$( document ).ready(function() {
    var gatewayIsEnabled = $("#submitNewsletter").attr("data-gateway");
    $('#newsletterMail').on('keyup',function(){
        var email = $(this).val();
        var divParent = $(this).parent();
        if(email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/) != null) {
            $(this).addClass('valid');
        } else {
            $(this).removeClass('valid');
        }
    });


    $('.newsletter-signup').submit(function(e) {
    	e.preventDefault();
    	if(gatewayIsEnabled == "false" || gatewayIsEnabled == undefined){
            if($('#newsletterMail').hasClass('valid') && $('#newsletter-terms').is(':checked')){
                var params = $().serializeArray();
                params.push({name: 'email', value: $('#newsletterMail').val()});
                var basePath = document.querySelector("meta[name='basePath']").content;

                var language_country = document.querySelector("meta[name='language_country']").content;
                var servletSelector = "newsletterItaRegistration";

                $.ajax({
                    type: "GET",
                    data: params,
                    url: basePath+"/." + servletSelector + ".json?_" + Date.now(),
                    async: false,
                    success:function(result){
                        switch(result.Code){
                            case 200:
                                $('.success').removeClass('hidden');
                                $('.success').addClass('show');
                                $(".newsletter-container").find('.container-email').addClass('validated');      // add confirm registration email's check
                                $('#submitNewsletter').prop("disabled", true);                                  // and disable button
                                setTimeout(function(){
                                    $('.success').removeClass('show');
                                    $('.success').addClass('hidden');
                                }, 5000);
                            break;
                            case 403:
                                $('.duplicate-mail-error').removeClass('hidden');
                                $('.duplicate-mail-error').addClass('show');
                                setTimeout(function(){
                                    $('.duplicate-mail-error').removeClass('show');
                                    $('.duplicate-mail-error').addClass('hidden');
                                }, 5000);
                            break;
                            case 500:
                                $('.generic-error').removeClass('hidden');
                                $('.generic-error').addClass('show');
                                setTimeout(function(){
                                    $('.generic-error').removeClass('show');
                                    $('.generic-error').addClass('hidden');
                                }, 5000);
                            break;
                        }
                    }
                });
            }else if(!$('#newsletterMail').hasClass('valid') && (!$('#newsletter-terms').is(':checked'))){
                $('.both-error').removeClass('hidden');
                $('.both-error').addClass('show');
                setTimeout(function(){
                    $('.both-error').removeClass('show');
                    $('.both-error').addClass('hidden');
                }, 5000);
            }else if(!$('#newsletterMail').hasClass('valid')){
                $('.email-error').removeClass('hidden');
                $('.email-error').addClass('show');
                setTimeout(function(){
                    $('.email-error').removeClass('show');
                    $('.email-error').addClass('hidden');
                }, 5000);
            }else if(!$('#newsletter-terms').is(':checked')){
                $('.flag-error').removeClass('hidden');
                $('.flag-error').addClass('show');
                setTimeout(function(){
                    $('.flag-error').removeClass('show');
                    $('.flag-error').addClass('hidden');
                }, 5000);
            }
        }else{
                        if($('#newsletterMail').hasClass('valid') && $('#newsletter-terms').is(':checked')){
                            var params = $().serializeArray();
                            params.push({name: 'email', value: $('#newsletterMail').val()});
                            var langCountry =$('meta[name=language_country]').attr("content");
                            params.push({name: 'ownership', value: langCountry});
                            var lang = $('html').attr('lang');
                            params.push({name: 'lang', value: lang});
                            var basePath = document.querySelector("meta[name='basePath']").content;

                            var language_country = document.querySelector("meta[name='language_country']").content;
                            var servletSelector = "getContact.newsletter";

                            $.ajax({
                                type: "POST",
                                data: params,
                                url: basePath+"/." + servletSelector + ".json?_" + Date.now(),
                                async: false,
                                success:function(result){
                                    switch(result.Code){
                                        case 200:
                                            $('.success').removeClass('hidden');
                                            $('.success').addClass('show');
                                            $(".newsletter-container").find('.container-email').addClass('validated');      // add confirm registration email's check
                                            $('#submitNewsletter').prop("disabled", true);                                  // and disable button
                                            setTimeout(function(){
                                                $('.success').removeClass('show');
                                                $('.success').addClass('hidden');
                                            }, 5000);
                                        break;
                                        case 403:
                                            $('.duplicate-mail-error').removeClass('hidden');
                                            $('.duplicate-mail-error').addClass('show');
                                            setTimeout(function(){
                                                $('.duplicate-mail-error').removeClass('show');
                                                $('.duplicate-mail-error').addClass('hidden');
                                            }, 5000);
                                        break;
                                        case 500:
                                            $('.generic-error').removeClass('hidden');
                                            $('.generic-error').addClass('show');
                                            setTimeout(function(){
                                                $('.generic-error').removeClass('show');
                                                $('.generic-error').addClass('hidden');
                                            }, 5000);
                                        break;
                                    }
                                }
                            });
                        }else if(!$('#newsletterMail').hasClass('valid') && (!$('#newsletter-terms').is(':checked'))){
                            $('.both-error').removeClass('hidden');
                            $('.both-error').addClass('show');
                            setTimeout(function(){
                                $('.both-error').removeClass('show');
                                $('.both-error').addClass('hidden');
                            }, 5000);
                        }else if(!$('#newsletterMail').hasClass('valid')){
                            $('.email-error').removeClass('hidden');
                            $('.email-error').addClass('show');
                            setTimeout(function(){
                                $('.email-error').removeClass('show');
                                $('.email-error').addClass('hidden');
                            }, 5000);
                        }else if(!$('#newsletter-terms').is(':checked')){
                            $('.flag-error').removeClass('hidden');
                            $('.flag-error').addClass('show');
                            setTimeout(function(){
                                $('.flag-error').removeClass('show');
                                $('.flag-error').addClass('hidden');
                            }, 5000);
                        }

    }});
});


// active button when you change value of input text
// and remove confirm registration email's check
$(".newsletter-container").find('input[type=email]').change(function() {
    $(".newsletter-container").find('.container-email').removeClass('validated');
    $('#submitNewsletter').prop("disabled", false);
 });
