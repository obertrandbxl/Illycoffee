$(document).ready(function() {
    var gatewayIsEnabled = $("#registration-form").attr("data-gateway");
    var ownershipApi = $("#registration-form").attr("data-ownership");
    var logged = $("#registration-optin").val();
    if (logged != "true") {
        $("input[hidden=hidden]").prop("hidden", "");
        $("label[hidden=hidden]").prop("hidden", "");
    } else {
        $("input[hidden=hidden]").remove();
        $("label[hidden=hidden]").remove();
    }

    if ($('.registration-form-wrapper').length) {
        var defaultOwnership;
        defaultOwnership = getOwnershipByPageLanguage(document.getElementsByName('language_country')[0].content);
        createNationalitySelect();
        prefill();

        $('#registration-form').on('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var isCircoloIlly = $('#registration-form').data('iscircoloilly');
            var urlLink = $('.overlay-registration').data("linkurl");
            $('.overlay-registration').css("display", "block");
            optinRequiredConfigurableErrorMsg();
            setTimeout(function() {
                var cont = 0;
                $('#registration-form').find('.form-etrio__error').each(function() {
                    if ($(this).is(":visible")) {
                        cont++;
                    }
                });
                if (cont === 0) {

                    if (!($('#emailExistsMessage').hasClass('display-none'))) {
                        $('#emailExistsMessage').addClass('display-none');
                    }
                    var params = $().serializeArray();
                    var paramsApiGateway = $().serializeArray();
                    var basePath = location.pathname.replace(".html", "");
                    var registerUrl = basePath + '/.ssoRegistration.json?_' + Date.now();
                    var loyaltyGroup = $('#loyaltyGroup').val();
                    if (loyaltyGroup != "" && loyaltyGroup != undefined) {
                        registerUrl = basePath + '/.loyaltyRegistration.json';
                        params.push({
                            name: 'groupToVerify',
                            value: loyaltyGroup
                        });
                    }
                    if (gatewayIsEnabled == "false" || gatewayIsEnabled == undefined) {

                        retrieveParams(params, loyaltyGroup);
                        $.ajax({
                            type: 'POST',
                            url: registerUrl,
                            data: params,
                            async: false,
                            success: function(data, status, xhr) {
                                if (loyaltyGroup != "") {
                                    var responseStatusCode = xhr.responseJSON.code;
                                } else {
                                    var responseStatusCode = data.status['code'];
                                }
                                if (responseStatusCode == '500') {
                                    $('.overlay-registration').css("display", "none");
                                    resetOverlay();
                                    $('#emailExistsMessage').removeClass('display-none');
                                    $("html, body").animate({
                                        scrollTop: $('#emailExistsMessage').offset().top - 200
                                    }, 1000);
                                } else {
                                    if (isCircoloIlly) {
                                        changeOverlayContent();
                                    } else {


                                        var params = $().serializeArray();
                                        var basePath = document.querySelector('meta[name="basePath"]').content;
                                        var userAccessUrl = basePath + '/.userAccess.json?_' + Date.now();
                                        params.push({
                                            name: 'groupToVerify',
                                            value: "loyalty"
                                        });
                                        $.ajax({
                                            type: 'GET',
                                            url: userAccessUrl,
                                            async: true,
                                            data: params,
                                            success: function(data, status, xhr) {

                                                $('.overlay-registration').css("display", "none");
                                                window.location.href = urlLink;


                                            },
                                            error: function(xhr, ajaxOptions, thrownError) {
                                                console.log('Something went wrong (status code: ' + xhr.status + ')');
                                            }
                                        });


                                    }
                                }
                            },
                            error: function(xhr, ajaxOptions, thrownError) {
                                console.log('Something went wrong (status code: ' + xhr.status + ')');
                            }
                        });
                    } else {
                        var registerUrlApiGateway = basePath + '/.getContact.mymachine.json?_' + Date.now();
                        if (loyaltyGroup != "" && loyaltyGroup != undefined) {
                            registerUrlApiGateway = basePath + '/.loyaltyRegistration.json';
                            paramsApiGateway.push({
                                name: 'groupToVerify',
                                value: loyaltyGroup
                            });
                        }
                        retrieveParamsApiGateway(paramsApiGateway, loyaltyGroup);
                        $.ajax({
                            type: 'POST',
                            url: registerUrlApiGateway,
                            data: paramsApiGateway,
                            async: false,
                            success: function(data, status, xhr) {
                               if (loyaltyGroup != "") {
                                   var responseStatusCode = xhr.responseJSON.code;
                               } else {
                                   var responseStatusCode = data.status['code'];
                                   if (responseStatusCode == undefined) {
                                       responseStatusCode = data.code;
                                   }
                               }
                                if (responseStatusCode == '500') {
                                    $('.overlay-registration').css("display", "none");
                                    resetOverlay();
                                    $('#emailExistsMessage').removeClass('display-none');
                                    $("html, body").animate({
                                        scrollTop: $('#emailExistsMessage').offset().top - 200
                                    }, 1000);
                                } else if (responseStatusCode == '200') {
                                    if (isCircoloIlly) {
                                        changeOverlayContent();
                                    } else {
                                        var params = $().serializeArray();
                                        var basePath = document.querySelector('meta[name="basePath"]').content;
                                        var userAccessUrl = basePath + '/.userAccess.json?_' + Date.now();
                                        params.push({
                                            name: 'groupToVerify',
                                            value: "loyalty"
                                        });
                                        $.ajax({
                                            type: 'GET',
                                            url: userAccessUrl,
                                            async: true,
                                            data: params,
                                            success: function(data, status, xhr) {

                                                $('.overlay-registration').css("display", "none");
                                                window.location.href = urlLink;
                                            },
                                            error: function(xhr, ajaxOptions, thrownError) {
                                                console.log('Something went wrong (status code: ' + xhr.status + ')');
                                            }
                                        });


                                    }
                                }else{
                                 $('.overlay-registration').css("display", "none");
                                 resetOverlay();
                                 $('#genericErrorMessage').removeClass('display-none');
                                 $("html, body").animate({
                                     scrollTop: $('#genericErrorMessage').offset().top - 200
                                 }, 1000);
                                }
                            },
                            error: function(xhr, ajaxOptions, thrownError) {
                                console.log('Something went wrong (status code: ' + xhr.status + ')');
                            }
                        });


                    }
                } else {
                    $('.overlay-registration').css("display", "none");
                    resetOverlay();
                }
            }, 200);
        });


        function optinRequiredConfigurableErrorMsg() {
            $('.privacy-checkbox.optinCodes').each(function() {
                if (!($(this).is(':checked')) && ($(this).attr('requiredConfigured') != undefined && $(this).attr('requiredConfigured') != '')) {
                    var id = $(this).attr('id');
                    $(this).addClass('form-etrio__error');
                    $(this).attr('aria-describedby', id + '-error');
                    var configurableMessageContainer = $(this).parent().find('.privacy-terms_requiredErrorMsg');
                    var msgValue = configurableMessageContainer.find('.msgValue').html();
                    var messageContainer = configurableMessageContainer.find('p.form-etrio__error');
                    messageContainer.attr('style', '');
                    messageContainer.html(msgValue);
                    configurableMessageContainer.removeClass('hidden');
                    $(this).on('click', function() {
                        if ($(this).is(':checked')) {
                            var configurableMessageContainer = $(this).parent().find('.privacy-terms_requiredErrorMsg');
                            var messageContainer = configurableMessageContainer.find('p.form-etrio__error');
                            messageContainer.attr('style', 'display:none;');
                            $(this).removeClass('form-etrio__error');
                            $(this).attr('aria-describedby', '');
                        } else {
                            var id = $(this).attr('id');
                            $(this).addClass('form-etrio__error');
                            $(this).attr('aria-describedby', id + '-error');
                            var configurableMessageContainer = $(this).parent().find('.privacy-terms_requiredErrorMsg');
                            var msgValue = configurableMessageContainer.find('.msgValue').html();
                            var messageContainer = configurableMessageContainer.find('p.form-etrio__error');
                            messageContainer.attr('style', '');
                            messageContainer.html(msgValue);
                            configurableMessageContainer.removeClass('hidden');
                        }
                    })
                }
            })
        }

        function getOwnershipByPageLanguage(lang) {

            var ownershipUrl = '/etc/designs/illysite/static/ownershipAndCountry.json';
            var ownershipAndCountries = null;
            $.ajax({
                type: "GET",
                url: ownershipUrl,
                async: false,
                success: function(data) {
                    countries = data;
                },
                error: function() {
                    console.log('call  ko')
                }
            });
            return countries[lang.substr(lang.length - 2)];
        }

        function resetOverlay() {
            $('.overlay-registration').find('.loading-img').css("display", "block");
            $('.overlay-registration').find('.overlay-cta').css("display", "none");
            $('.overlay-registration').find('.overlay-title').css("display", "block");
            $('.overlay-registration').find('.overlay-title.success').css("display", "none");
            $('.overlay-registration').find('.overlay-body-content').css("display", "block");
            $('.overlay-registration').find('.overlay-body-content.success').css("display", "none");
            $('.overlay-registration').find('.overlay-body-section').css("display", "none");
        }

        function changeOverlayContent() {
            $('.overlay-registration').find('.loading-img').css("display", "none");
            $('.overlay-registration').find('.overlay-cta').css("display", "block");
            $('.overlay-registration').find('.overlay-title').css("display", "none");
            $('.overlay-registration').find('.overlay-title.success').css("display", "block");
            $('.overlay-registration').find('.overlay-body-content').css("display", "none");
            $('.overlay-registration').find('.overlay-body-content.success').css("display", "block");
            $('.overlay-registration').find('.overlay-body-section').css("display", "flex")
        }

        function retrieveParamsApiGateway(paramsApiGateway, loyaltyGroup) {
            if (social_cookie != "") {
                var decoded_c = atob(social_cookie);
                var decodedCookie = decodeURIComponent(decoded_c);

                var obj = JSON.parse(decodedCookie);
                if (obj) {
                    paramsApiGateway.push({
                        name: 'socialid',
                        value: obj.socialid
                    });
                    paramsApiGateway.push({
                        name: 'socialtype',
                        value: obj.socialtype
                    });
                }
            }

            if (loyaltyGroup != "") {
                if ($('#us_date').length) {
                    paramsApiGateway.push({
                        name: 'birthDate',
                        value: '01/' + $('#us_date').val()
                    });
                } else {
                    paramsApiGateway.push({
                        name: 'birthDate',
                        value: $('#birth_date').val()
                    });
                }
                var parent = $('#phone-number').parent();
                var phoneNumber = $(parent).find('.iti__selected-dial-code').text() + $('#phone-number').val();
                paramsApiGateway.push({
                    name: 'telephoneNumber',
                    value: phoneNumber
                });
            }
            paramsApiGateway.push({
                name: 'givenName',
                value: $('#firstname').val()
            });
            paramsApiGateway.push({
                name: 'familyName',
                value: $('#lastname').val()
            });
            paramsApiGateway.push({
                name: 'nationality',
                value: $('#nationality :selected').text()
            });
            if ($('#email').val() == $('#confirm_email').val()) {
                paramsApiGateway.push({
                    name: 'mail',
                    value: $('#email').val()
                });
            } else {
                return;
            }
            if ($('#password').val() == $('#confirm-password').val()) {
                paramsApiGateway.push({
                    name: 'password',
                    value: $('#password').val()
                });
            } else {
                return;
            }
            if ($('#nationality').length) {
                var isCircoloIlly = $('#registration-form').data('iscircoloilly');
                var nationality = $('#nationality').val();
                if (isCircoloIlly) {
                    var countrySite = document.querySelector('meta[name="language_country"]').content;
                    paramsApiGateway.push({
                        name: 'ownership',
                        value: ownershipApi
                    });
                    paramsApiGateway.push({
                        name: 'country',
                        value: nationality
                    });
                } else {
                    paramsApiGateway.push({
                        name: 'ownership',
                        value: defaultOwnership
                    });
                    paramsApiGateway.push({
                        name: 'country',
                        value: nationality
                    });
                }
            } else {
                paramsApiGateway.push({
                    name: 'ownership',
                    value: defaultOwnership
                });
                paramsApiGateway.push({
                    name: 'country',
                    value: defaultOwnership
                });
            }

            var isCircoloIlly = $('#registration-form').data('iscircoloilly');
            if (isCircoloIlly) {
                var countrySite = document.querySelector('meta[name="language_country"]').content;
                paramsApiGateway.push({
                    name: 'countrySite',
                    value: countrySite
                });
                paramsApiGateway.push({
                    name: 'companyName',
                    value: $('#company-name').val()
                });
                paramsApiGateway.push({
                    name: 'occupation',
                    value: $('#occupation').val()
                });
                paramsApiGateway.push({
                    name: 'role',
                    value: $('#role').val()
                });
                paramsApiGateway.push({
                    name: 'size',
                    value: $('#size-plantation').val()
                });
                var findOutCircoloIllyValue = $('input[name="how-find"]:checked').val();

                if ($('#how-find-input').length) {
                    paramsApiGateway.push({
                        name: 'findOutCircoloIlly',
                        value: 'Other - ' + $('#how-find-input').val()
                    });
                } else {
                    paramsApiGateway.push({
                        name: 'findOutCircoloIlly',
                        value: findOutCircoloIllyValue
                    });
                }
                var informationValue = $('input[name="which-type"]:checked').val();

                if ($('#which-type-input').length) {
                    paramsApiGateway.push({
                        name: 'informations',
                        value: 'Other - ' + $('#which-type-input').val()
                    });
                } else {
                    paramsApiGateway.push({
                        name: 'informations',
                        value: informationValue
                    });
                }

                if (!$('#working-illy').parent().hasClass('hide')) {
                    paramsApiGateway.push({
                        name: 'alreadyWork',
                        value: $('#already-work').val()
                    });
                    paramsApiGateway.push({
                        name: 'workingIlly',
                        value: $('#working-illy').val()
                    });
                } else {
                    paramsApiGateway.push({
                        name: 'alreadyWork',
                        value: $('#already-work').val()
                    });
                    paramsApiGateway.push({
                        name: 'workingIlly',
                        value: ''
                    });
                }
            }
            var lang = $('html').attr('lang');
            var privacyOptions = $().serializeArray();
            $('input.privacy-checkbox').each(function() {
                var option = $(this);
                var optinType = $(option).data('optintype');
                if ($(option).is(":checked") || $(option).hasClass('textCheckBox')) {
                    privacyOptions.push({
                        name: optinType,
                        value: 'Y'
                    });
                } else {
                    privacyOptions.push({
                        name: optinType,
                        value: 'N'
                    });
                }
            })
            privacyOptionsString = JSON.stringify(privacyOptions);
            paramsApiGateway.push({
                name: 'privacyOptions',
                value: privacyOptionsString
            });

            paramsApiGateway.push({
                name: 'acceptMail',
                value: true
            });
            paramsApiGateway.push({
                name: 'acceptMail2',
                value: true
            });
            paramsApiGateway.push({
                name: 'privacyId',
                value: 'sso_v1'
            });
            paramsApiGateway.push({
                name: 'lang',
                value: lang
            });
        }




        function retrieveParams(params, loyaltyGroup) {
            if (social_cookie != "") {
                var decoded_c = atob(social_cookie);
                var decodedCookie = decodeURIComponent(decoded_c);

                var obj = JSON.parse(decodedCookie);
                if (obj) {
                    params.push({
                        name: 'socialid',
                        value: obj.socialid
                    });
                    params.push({
                        name: 'socialtype',
                        value: obj.socialtype
                    });
                }
            }

            if (loyaltyGroup != "") {
                if ($('#us_date').length) {
                    params.push({
                        name: 'birthDate',
                        value: '01/' + $('#us_date').val()
                    });
                } else {
                    params.push({
                        name: 'birthDate',
                        value: $('#birth_date').val()
                    });
                }
                var parent = $('#phone-number').parent();
                var phoneNumber = $(parent).find('.iti__selected-dial-code').text() + $('#phone-number').val();
                params.push({
                    name: 'telephoneNumber',
                    value: phoneNumber
                });
            }
            params.push({
                name: 'givenName',
                value: $('#firstname').val()
            });
            params.push({
                name: 'familyName',
                value: $('#lastname').val()
            });
            params.push({
                name: 'nationality',
                value: $('#nationality :selected').text()
            });
            if ($('#email').val() == $('#confirm_email').val()) {
                params.push({
                    name: 'mail',
                    value: $('#email').val()
                });
            } else {
                return;
            }
            if ($('#password').val() == $('#confirm-password').val()) {
                params.push({
                    name: 'password',
                    value: $('#password').val()
                });
            } else {
                return;
            }
            if ($('#nationality').length) {
                var nationality = $('#nationality').val();
                params.push({
                    name: 'ownership',
                    value: defaultOwnership
                })
                params.push({
                    name: 'country',
                    value: nationality
                })
            } else {
                params.push({
                    name: 'ownership',
                    value: defaultOwnership
                })
                params.push({
                    name: 'country',
                    value: defaultOwnership
                })
            }

            var isCircoloIlly = $('#registration-form').data('iscircoloilly');
            if (isCircoloIlly) {
                var countrySite = document.querySelector('meta[name="language_country"]').content;
                params.push({
                    name: 'countrySite',
                    value: countrySite
                });
                params.push({
                    name: 'companyName',
                    value: $('#company-name').val()
                });
                params.push({
                    name: 'occupation',
                    value: $('#occupation').val()
                });
                params.push({
                    name: 'role',
                    value: $('#role').val()
                });
                params.push({
                    name: 'size',
                    value: $('#size-plantation').val()
                });
                var findOutCircoloIllyValue = $('input[name="how-find"]:checked').val();

                if ($('#how-find-input').length) {
                    params.push({
                        name: 'findOutCircoloIlly',
                        value: 'Other - ' + $('#how-find-input').val()
                    });
                } else {
                    params.push({
                        name: 'findOutCircoloIlly',
                        value: findOutCircoloIllyValue
                    });
                }
                var informationValue = $('input[name="which-type"]:checked').val();

                if ($('#which-type-input').length) {
                    params.push({
                        name: 'informations',
                        value: 'Other - ' + $('#which-type-input').val()
                    });
                } else {
                    params.push({
                        name: 'informations',
                        value: informationValue
                    });
                }

                if (!$('#working-illy').parent().hasClass('hide')) {
                    params.push({
                        name: 'alreadyWork',
                        value: $('#already-work').val()
                    });
                    params.push({
                        name: 'workingIlly',
                        value: $('#working-illy').val()
                    });
                } else {
                    params.push({
                        name: 'alreadyWork',
                        value: $('#already-work').val()
                    });
                    params.push({
                        name: 'workingIlly',
                        value: ''
                    });
                }
            }
            var lang = $('html').attr('lang');
            var privacyOptions = $().serializeArray();
            $('input.privacy-checkbox').each(function() {
                var option = $(this);
                var optinType = $(option).data('optintype');
                if ($(option).is(":checked") || $(option).hasClass('textCheckBox')) {
                    privacyOptions.push({
                        name: optinType,
                        value: 'Y'
                    });
                } else {
                    privacyOptions.push({
                        name: optinType,
                        value: 'N'
                    });
                }
            })
            privacyOptionsString = JSON.stringify(privacyOptions);
            params.push({
                name: 'privacyOptions',
                value: privacyOptionsString
            });

            params.push({
                name: 'acceptMail',
                value: true
            });
            params.push({
                name: 'acceptMail2',
                value: true
            });
            params.push({
                name: 'privacyId',
                value: 'sso_v1'
            });
            params.push({
                name: 'lang',
                value: lang
            });
        }

        function createNationalitySelect() {
            var countriesUrl = '/etc/designs/illysite/static/allCountries.json';
            var ownershipAndCountriesUrl = '/etc/designs/illysite/static/ownershipAndCountry.json';
            var countries = null;
            var ownershipAndCountries = null;
            $.ajax({
                type: "GET",
                url: countriesUrl,
                async: false,
                success: function(data) {
                    countries = data;
                    $.ajax({
                        type: "GET",
                        url: ownershipAndCountriesUrl,
                        async: false,
                        success: function(data) {
                            ownershipAndCountries = data;
                            var countrySelect = $('select#nationality');
                            for (var i = 0; i < countries.length; i++) {
                                var value = ownershipAndCountries[countries[i].alpha2Code];
                                if (value != undefined) {
                                    if (value === defaultOwnership) {
                                        var option = '<option value="' + value + '" selected="selected">' + countries[i].name + '</option>';
                                    } else {
                                        var option = '<option value="' + value + '">' + countries[i].name + '</option>';
                                    }
                                    $(countrySelect).append(option);
                                }
                            }
                        },
                        error: function() {
                            console.log('call  ko')
                        }
                    });
                },
                error: function() {
                    console.log('call  ko')
                }
            });
        }

        function prefill() {
            var decoded_new_user = "";
            var decoded_social = "";
            social_cookie = getCookie("social_login_res");
            loyalty_cookie = getCookie("loyalty_login_res");
            newuser_cookie = getCookie("loyalty_new_user");
            var decoded_c = "";
            if (social_cookie != "") {
                decoded_social = atob(social_cookie);
            } else if (loyalty_cookie != "") {
                decoded_c = atob(loyalty_cookie);
            } else if (newuser_cookie != "") {
                decoded_new_user = atob(newuser_cookie);
            }

            if (decoded_social != "") {
                var decodedCookie = decodeURIComponent(decoded_social);
                var obj = JSON.parse(decodedCookie);
                if (obj) {
                    $("#firstname").val(obj.name);
                    $("#lastname").val(obj.lastname);
                    $("#email").val(obj.email);
                    $("#confirm_email").val(obj.email);
                    $("#confirm_email").attr('disabled', true);
                    $("#passwordRow").remove();
                    $("#email").attr('disabled', true);

                    $("#firstname").attr('disabled', true);
                    $("#lastname").attr('disabled', true);
                }
            }

            if (decoded_new_user != "") {
                var decodedCookie = decodeURIComponent(decoded_new_user);
                var obj = JSON.parse(decodedCookie);
                if (obj) {
                    $("#email").val(obj.email);
                    $("#confirm_email").val(obj.email);
                    $("#confirm_email").attr('disabled', true);
                    $("#email").attr('disabled', true);
                }
            }

            if (decoded_c != "") {
                var decodedCookie = decodeURIComponent(decoded_c);
                var obj = JSON.parse(decodedCookie);
                if (obj) {
                    $("#firstname").val(obj.name);
                    $("#lastname").val(obj.lastname);
                    $("#email").val(obj.email);
                    $("#confirm_email").val(obj.email);
                    $("#passwordRow").remove();
                    $("#confirm_email").attr('disabled', true);
                    $("#email").attr('disabled', true);

                    $("#firstname").attr('disabled', true);
                    $("#lastname").attr('disabled', true);
                }
            }
        }

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
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
    }
});