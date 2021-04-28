$( document ).ready(function() {
    setTimeout(() => {
        if(window.localStorage.hasOwnProperty('redirectUrl') && window.localStorage.hasOwnProperty('machineImageUrl')){
            var currentPath = location.href.replace(location.protocol,'').replace('//','').replace(location.host,'');
            var redirectUrl = window.localStorage.getItem('redirectUrl').replace(location.protocol,'').replace('//','').replace(location.host,'');
            if(currentPath === redirectUrl){
                var myMachineImageUrl = window.localStorage.getItem('machineImageUrl');
                $('#imagePlaceholderTP').children('img').attr('src',myMachineImageUrl);
            }else{
                localStorage.removeItem('machineImageUrl');
            }
        }
    }, 800);
  if ($('.userAccess-wrapper').length || $('.heroLoyalty').length) {
    var params = $().serializeArray();
    var basePath = document.querySelector('meta[name="basePath"]').content;
    var userAccessUrl = basePath + '/.userAccess.json?_' + Date.now();
    var groupToVerify = $('#groupToVerify').val();
    params.push({ name: 'groupToVerify', value: groupToVerify });
    $.ajax({
      type: 'GET',
      url: userAccessUrl,
      data: params,
      success: function (data, status, xhr) {
        var loginStatus = data['status'];
        if (loginStatus === "notLoggedInIlly") {
          $('#isLoggedAndRegistered').remove();
          $('#isLoggedAndNotRegistered').remove();
          $('#notLoggedInIlly').show();
          $('.loggedAndLoyalty').remove();
          $('.loggedNotLoyalty').remove();
          $('.loyaltyNotLogged').removeClass('hidden');
        } else if (loginStatus === "isLoggedAndRegistered") {
          if($('.heroLoyalty').length == 0){
            $('#notLoggedInIlly').remove();
            $('#isLoggedAndNotRegistered').remove();
            $('#isLoggedAndRegistered').show();
            var href = $('#userAccessRegister').attr('href') + data['userId'];
            $('#userAccessRegister').attr('href', href);
          }else{
            $('.userAccess-wrapper').remove();
            $('.loyaltyNotLogged').remove();
            $('.loggedNotLoyalty').remove();
            $('.loggedAndLoyalty').removeClass('hidden');
          }
        } else if (loginStatus === "isLoggedAndNotRegistered") {
          if($('.heroLoyalty').length == 0){
            $('#notLoggedInIlly').remove();
            $('#isLoggedAndRegistered').remove();
            $('#isLoggedAndNotRegistered').show();
          }else{
            $('.userAccess-wrapper').remove();
            $('.loyaltyNotLogged').remove();
            $('.loggedAndLoyalty').remove();
            $('.loggedNotLoyalty').removeClass('hidden');
          }
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log('Something went wrong (status code: ' + xhr.status + ')');
      }
    });
  }
  
  $("#userAccessRegister").on("click", function (event) {
	  if(groupToVerify == "Loyalty"){
          if($('#userAccess-register-form').valid()) {
              event.preventDefault();
              var basePath = location.pathname.replace(".html", "");
              var registerUrl = basePath + "/.checkDuplicate.json?";
              var params = $().serializeArray();
              params.push({name: 'email', value: $("#emailRegister").val()});
              params.push({name: 'groupToVerify', value: groupToVerify});
              $.ajax({
                  type: "POST",
                  url: registerUrl,
                  data: params,
                  async: false,
                  success: function (data, status, xhr) {
                      if (status === "success" && xhr.responseJSON.code == 200) {
                          location.href = xhr.responseJSON.redirectURL;
                      }
                      else if (status === "success" && xhr.responseJSON.code == 500) {
                          if (xhr.responseJSON.loyaltyRegistered === "true") {
                              if (xhr.responseJSON.isSocial != undefined && xhr.responseJSON.isSocial != '' && xhr.responseJSON.isSocial == 'true') {
                                  $('#userAlreadyRegisteredSocial').removeClass("hidden");
                              } else {
                                  $('#userAlreadyRegistered').removeClass("hidden");
                                  fillLoginWithEmail();
                              }

                          } else if (xhr.responseJSON.loyaltyRegistered === "false") {
                              //location.href = xhr.responseJSON.redirectURL;
                              if (xhr.responseJSON.isSocial != undefined && xhr.responseJSON.isSocial != '' && xhr.responseJSON.isSocial == 'true') {
                                  $('#userAlreadyRegisteredSocial').removeClass("hidden");
                              } else {
                                  $('#userAlreadyRegisteredSSO').removeClass("hidden");
                                  fillLoginWithEmail();
                              }
                          }

                          $('#userAccess-register-form #emailRegister').on("keydown click", function () {
                              $('#userAccess-register-form .response__error').each(function () {
                                  $(this).addClass("hidden");
                              })
                          });
                      }
                  },
                  error: function (xhr, ajaxOptions, thrownError) {
                      console.log("Something went wrong (status code: " + xhr.status + ")");
                  }
              });
          }
	  }
  });
  
  $("#dwfrm_login").on("submit", function (event) {

    event.preventDefault();
    var basePath = document.querySelector("meta[name='basePath']").content;
    var salesforceScope = document.querySelector("meta[name='salesforceScope']").content;
    var loginUrl = basePath + "/j_sf_security_check";
    var params = $().serializeArray();
    params.push({ name: 'j_username', value: $("#dwfrm_login_username_d0jwajzbhwtk").val() });
    params.push({ name: 'j_password', value: $("#dwfrm_login_password_d0jvfvsxisyn").val() });
    params.push({ name: 'salesforceScope', value: salesforceScope });
    $.ajax({
      type: "POST",
      url: loginUrl,
      data: params,
      async: false,
      success: function (data, status, xhr) {
        if (status === "success" && xhr.status == 200) {
          let redirectUrl = $("#redirectUrl").val();
          if (redirectUrl != "") {
            location.href = redirectUrl;
          }
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log("Something went wrong (status code: " + xhr.status + ")");
      }
    });
  });

  $('.login-btn').on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    var cont = 0;
    $('#login-form').find('.form-etrio__error').each(function () {
      if ($(this).is(":visible")) {
        cont++;
      }
    });
    if (cont === 0) {
      var basePath = document.querySelector('meta[name="basePath"]').content;
      var params = $().serializeArray();
      var groupToVerify = $('#groupToVerify').val();
      params.push({ name: 'username', value: $('#email').val() });
      params.push({ name: 'password', value: $('#password').val() });
      params.push({ name: 'groupToVerify', value: groupToVerify });

      if(groupToVerify === "CommunityGrower" || groupToVerify === "default" || groupToVerify === ""){
          var loginUrl = basePath + '/.ssoLogin.json?_' + Date.now();
          $.ajax({
            type: 'POST',
            url: loginUrl,
            data: params,
            async: false,
            success: function (data, status, xhr) {
              if (status === "success" && xhr.status == 200) {
                if (data.isAuthorized) {
                  let redirectUrl = "";
                  var groupToVerify = $('#groupToVerify').val();
                  if (groupToVerify === "CommunityGrower" && data.ssoId != null) {
                    redirectUrl = $('#login-form').attr('action').replace(".html", "") + "?usid=" + data.ssoId;
                  } else {
                    redirectUrl = $('#login-form').attr('action').replace(".html", "");
                  }
                  let newTab = $('#login-form').data('redirect-new-tab');
                  if (redirectUrl != "") {
                    if (newTab) {
                      window.open(redirectUrl, '_blank')
                    } else {
                      location.href = redirectUrl;
                    }
                  }
                } else if (data.isPending) {
                  $(".overlay-wrapper.hidden").removeClass("hidden");
                } else if (data.AthenticationFailed) {
                  $("#bad-credentials").removeClass("hidden");
                } else if (data.redirectToRegister) {
                  let redirectUrl = $('#userAccessRegister').attr('href');
                  if (redirectUrl != "") {
                    location.href = redirectUrl;
                  }
                }
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              console.log('Something went wrong (status code: ' + xhr.status + ')');
              let redirectUrl = $('#userAccessRegister').attr('href');
              if (redirectUrl != "") {
                location.href = redirectUrl;
              }
            }
          });
        }else if(groupToVerify == "Loyalty"){
          var loginUrl = basePath + '/.loginLoyalty.json?_' + Date.now();
          var loginLoyaltyLink = $('#loginLoyaltyLink').val();
          var registerLoyaltyLink = $('#registerLoyaltyLink').val();
          $.ajax({
            type: 'POST',
            url: loginUrl,
            data: params,
            async: false,
            success: function (data, status, xhr) {
                if (status === "success" && xhr.status == 200) {
                    if (data.redirectToMyLoyalty) {
                         location.href = loginLoyaltyLink;
                    }else if (data.redirectToRegister){
                         location.href = registerLoyaltyLink;
                    }
                    else{
                    	$("#bad-credentials").removeClass("hidden");
                        $('#login-form #password,#login-form #email').on("keydown", function () { // funzione da rimuovere
                            $("#bad-credentials").addClass("hidden");
                        });
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {

            }
          });
        }
    }
  });

  function removeError() {
    $("#bad-credentials").addClass("hidden");
  }

  $('#email').change(removeError);
  $('#password').change(removeError);

});


$(window).on('load', function () {
	var groupToVerify = $('#groupToVerify').val();	
	if (groupToVerify === "CommunityGrower" || groupToVerify === "default" || groupToVerify === "" ){
		$('#emailRegister').remove();
	}
  if ($(window).width() > 767) {
    resizeUserReg(); 
  }
  $('.userAccess-wrapper').css("visibility", "visible");
  $('p.response__error').attr("role", "alert");

  // SSO - user access registration
  ssoUserRegistration();
});

$(window).resize(function () {
  $('.userAccess-wrapper').find('.col-height').css("height", "unset");
  $('.userAccess-wrapper').find('.col-height-passive').css("height", "unset");
  $('.userAccess-wrapper').find('.col-height-passive').find('.description').css("height", "unset");
  $('.userAccess-wrapper').find('.title-height').css("height", "unset");
  $('.userAccess-wrapper').find('.register-form-container .form-etrio__input').css("width", "100%");
  $('.userAccess-wrapper').find('.register-form-container .register-btn').css("width", "100%");
  if ($(window).width() > 767) {
    resizeUserReg();
  }
  ssoUserRegistration();
});

function resizeUserReg() {
  var heightCol = 0;
  var heightTitle = 0;
  $('.userAccess-wrapper').find('.col-height').each(function () {
    if (heightCol < $(this).outerHeight()) {
      heightCol = $(this).outerHeight();
    }
  });
  $('.userAccess-wrapper').find('.title-height').each(function () {
    if (heightTitle < $(this).outerHeight()) {
      heightTitle = $(this).outerHeight();
    }
  });
  if (heightCol !== 0) {
    $('.userAccess-wrapper').find('.col-height').css("height", heightCol + 'px');
    $('.userAccess-wrapper').find('.col-height-passive').css("height", heightCol + 'px');
    $('.userAccess-wrapper').find('.col-height-passive.register-container').find('.description').css("height", heightCol - ($('.userAccess-wrapper').find('.register-form-container .form-etrio__input').length > 0 ? $('.userAccess-wrapper').find('.register-form-container .form-etrio__input').outerHeight(true) : 0 )- 130 + 'px');
    $('.userAccess-wrapper').find('.col-height-passive.social-container').find('.description').css("height", heightCol - ($('.userAccess-wrapper').find('.social-button').length > 2 ? $('.userAccess-wrapper').find('.social-button').outerHeight(true) : 0) - 130 + 'px');
    $('.userAccess-wrapper').find('.title-height').css("height", heightTitle + 'px');
    $('.userAccess-wrapper').find('.register-form-container .form-etrio__input').css("width", $('.userAccess-wrapper').find('.login-btn').outerWidth() + 'px');
    $('.userAccess-wrapper').find('.register-form-container .register-btn').css("width", $('.userAccess-wrapper').find('.login-btn').outerWidth() + 'px');
  } else {
    $('.userAccess-wrapper').find('.col-height-passive').css("height", 340 + 'px');
    $('.userAccess-wrapper').find('.col-height-passive.register-container').find('.description').css("height", 340 - ($('.userAccess-wrapper').find('.register-form-container .form-etrio__input').length > 0 ? $('.userAccess-wrapper').find('.register-form-container .form-etrio__input').outerHeight(true) : 0 )- 130 + 'px');
    $('.userAccess-wrapper').find('.col-height-passive.social-container').find('.description').css("height", 340 - ($('.userAccess-wrapper').find('.social-button').length > 2 ? $('.userAccess-wrapper').find('.social-button').outerHeight(true) : 0) - 130 + 'px');
    $('.userAccess-wrapper').find('.register-form-container .form-etrio__input').css("width", $('.register-container').find('.description').width() + 'px');
    $('.userAccess-wrapper').find('.register-form-container .register-btn').css("width", $('.register-container').find('.description').width() + 'px');
  }
  ssoUserRegistration();
}


function fillLoginWithEmail(){
	var emailRegister=$("#emailRegister").val();
	$("#email").val(emailRegister);
	$("#email").attr('disabled', true);
	$("#emailRegister").val("");
}

function ssoUserRegistration() {
  var parent = $('.userAccess-wrapper').find('.color-background-user-access');
  if ($(parent).length) {
    $(parent).parent().find('.image').css('display', 'none');
  } else {
    $(parent).css('background-color', 'inherit');
    if ($(window).width() < 767) {
      $('hr.sso-user-registration').css('display', 'none');
    } else {
      $('hr.sso-user-registration').css('display', 'block');
    }
  }
}
