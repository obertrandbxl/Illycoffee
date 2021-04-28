$(document).ready(function(){

	var promobarButton = $('.wrapper-special-offer');
	if (typeof promobarButton != 'undefined' && promobarButton  != null) { 	
		if(promobarButton.length != 0 && $(promobarButton).data('enabled-promo-button')) {
			var promoHref = $(promobarButton).attr('href');
			var promoText = $(promobarButton).find('p').text();
			var promoForMobile = $('#special-offer-mobile');
			var promoSpecialOfferMobile = $(promoForMobile).find('.special-offer-mobile');
			$(promoSpecialOfferMobile).attr('href', promoHref);
			$(promoSpecialOfferMobile).find('p').text(promoText);
		}else {
			$('#special-offer-mobile').hide();
		}
	}

    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var encode64CiGroup = "";
    var encode64CiGroupUser = "";
    for (var i = 0, l = cookies.length; i < l; i++) {
        var cookie = mySplit(cookies[i],'=');

        if(cookie[0] == 'CI_Group'){
            encode64CiGroup = cookie[1];
        }

        if(cookie[0] == 'CI_Group_User'){
            encode64CiGroupUser = cookie[1];
        }
    }
    if(encode64CiGroupUser != "") {
        var ciGroupUser = decode64(encode64CiGroupUser);
        var obj = JSON.parse(ciGroupUser);
        var logoutLabel = '';
        var links = [];
        var urlLoyalty = '';
        if($('#loggedIn-informations').length){
            logoutLabel = $('#logout-label').text();
            urlLoyalty = $('#url-loyalty-profile').text();
            $('.link-item').each(function(){
                var link = $().serializeArray();
                link.label = $(this).find('#link-label').text();
                link.url = $(this).find('#link-url').text();
                link.isIllyLovers = $(this).find('#isIllyLovers').text();
                links.push(link);
            });
        }
        var socialCookie = getCookie("social_login_res");
        if(socialCookie != ""){
            var socialUser = JSON.parse(decode64(socialCookie));
            if(socialUser.photo != undefined && socialUser.photo != "" ){
                obj.photo = socialUser.photo;
            }
        }
        obj.logoutLabel = logoutLabel;
        obj.links = links;
        obj.urlLoyalty = urlLoyalty;
        fillComponentLoggedCIUser(obj);
    }else{
        var basePath = document.querySelector('meta[name="basePath"]').content;
        var userLoggedUrl = basePath + '/.userLogged.json?_' + Date.now();
        $.ajax({
            type: "GET",
            url: userLoggedUrl,
            async: false,
            success: function (data, status, xhr) {
                if(data.logged){
                    if($('.machine-registration-wrapper').length){

                        var text = $('#privacyTextMachineRegistration').html();
                        var user = data.user;
                        text = text.replace('{nome}', user.givenName);
                        text = text.replace('{cognome}', user.familyName);
                        text = text.replace('{email}', user.mail);
                        var country = getOwnershipByPageLanguage(user.country).toLowerCase();
                        if (country && country != null) {
                            var splittedCountry = country.split("-");
                            if (splittedCountry.length > 0) {
                                country = splittedCountry[1];
                            }
                        } else{
                            country = user.country;
                        }
                        text = text.replace('{country}', country.charAt(0).toUpperCase() + country.slice(1));
                        $('#privacyTextMachineRegistration').html(text);
                    }
                    
                    if($('.privacyCheckbox-component-submitButton').length){
                        $('.privacyCheckbox-component-submitButton div.privacy-checkbox').each(function(){
                            if($(this).data('isforloggeduser') == false || $(this).data('isforloggeduser') == undefined){
                                $(this).remove();
                            }
                        });
                        $('.textLoggedUser').removeClass('hidden');
                        $('.privacyCheckbox-component-submitButton div.privacy-checkbox').each(function(index){
                            var i = index + 1;
                            $(this).removeAttr('class');
                            $(this).addClass('privacy-checkbox privacy-checkbox-'+i);
                        });
                    }
                    var logoutLabel = '';
                    var links = [];
                    var urlLoyalty = '';
                    if($('#loggedIn-informations').length){
                        logoutLabel = $('#logout-label').text();
                        urlLoyalty = $('#url-loyalty-profile').text();
                        $('.link-item').each(function(){
                            var link = $().serializeArray();
                            link.label = $(this).find('#link-label').text();
                            link.url = $(this).find('#link-url').text();
                            link.isIllyLovers = $(this).find('#isIllyLovers').text();
                            links.push(link);
                        });
                    }
                    var user = data.user;
                    user.logoutLabel = logoutLabel;
                    user.links = links;
                    user.urlLoyalty = urlLoyalty;
                    var loyaltyCookie = getCookie("loyalty_login_res");
                    var socialCookie = getCookie("social_login_res");
                    var loyaltyUser;
                    if(loyaltyCookie && loyaltyCookie != ""){
                        loyaltyUser = JSON.parse(decode64(loyaltyCookie));
                    }

                    if(loyaltyUser && loyaltyUser.photo != undefined && loyaltyUser.photo != '' ){
                        user.photo = loyaltyUser.photo;
                    }else if(socialCookie != ""){
                        var socialUser = JSON.parse(decode64(socialCookie));
                        if(socialUser.photo != undefined && socialUser.photo != "" ){
                            user.photo = socialUser.photo;
                        }
                    }
                    fillComponentLoggedUser(user);
                    $('#logout').click(function() {
                        var logoutBasePath = document.querySelector("meta[name='logoutBasePath']").content;
                        var lang = logoutBasePath.substring(logoutBasePath.lastIndexOf("/"),logoutBasePath.length);
                        var basePath = location.protocol + "//" + location.hostname + logoutBasePath.substring(0,logoutBasePath.lastIndexOf(lang));
                        var path = basePath + "/" + document.querySelector("meta[name='salesforceScope']").content + lang + "/Login-Logout";
                        createCookie('LtpaToken2',"",-1);
                        createCookie('social_login_res',"",-1);
                        createCookie('loyalty_login_res',"",-1);
                        createCookie('sso_token',"",-1);
                        createCookie('loyalty_token',"",-1);
                        window.location.href = path;
                    });
                    if($('.machine-registration-wrapper').length){
                        $('.machine-registration-wrapper').removeClass('display-none');
                        if($('.container-hero-with-banner').length){
                            var cta = $('.cta-first-part').find('a');
                            var anchor = $('.cta-first-part').data('anchor-my-machine');
                            $(cta).attr('href',anchor);
                        }
                        if($('.userAccessRegistration').length){
                            $('.userAccessRegistration').remove();
                        }
                    }

                }else{
                    fillComponentNotLoggedUser();
                    if($('.privacyCheckbox-component-submitButton').length){
                        $('.privacyCheckbox-component-submitButton div.privacy-checkbox').each(function(){
                            if($(this).data('isforloggeduser') == true){
                                $(this).remove();
                            }
                        });
                        $('.textNotLoggedUser').removeClass('hidden');
                        $('.privacyCheckbox-component-submitButton div.privacy-checkbox').each(function(index){
                            var i = index + 1;
                            $(this).removeAttr('class');
                            $(this).addClass('privacy-checkbox privacy-checkbox-'+i);
                        });
                    }
                    if($('.userAccess-wrapper').length){
                        $('.userAccess-wrapper').removeClass('display-none');
                        if($('.container-hero-with-banner').length){
                            var cta = $('.cta-first-part').find('a');
                            var anchor = $('.cta-first-part').data('anchor-user-access');
                            $(cta).attr('href',anchor);
                        }
                        $('.machine-registration-wrapper').remove();
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("Something went wrong (status code: " + xhr.status + ")");
                fillComponentNotLoggedUser();
                if($('.privacyCheckbox-component-submitButton').length){
                    $('.privacyCheckbox-component-submitButton div.privacy-checkbox').each(function(){
                        if($(this).data('isforloggeduser') == true){
                            $(this).remove();
                        }
                    });
                    $('.textNotLoggedUser').removeClass('hidden');
                    $('.privacyCheckbox-component-submitButton div.privacy-checkbox').each(function(index){
                        var i = index + 1;
                        $(this).removeAttr('class');
                        $(this).addClass('privacy-checkbox privacy-checkbox-'+i);
                    });
                }
                if($('.userAccess-wrapper').length){
                    $('.userAccess-wrapper').removeClass('display-none');
                    if($('.container-hero-with-banner').length){
                        var cta = $('.cta-first-part').find('a');
                        var anchor = $('.cta-first-part').data('anchor-user-access');
                        $(cta).attr('href',anchor);
                    }
                }
            }
        });
    }

    $('#logoutCI').click(function() {
        createCookie('CI_Group_User',"",-1);
        createCookie('CI_Group',"",-1);
        createCookie('LtpaToken2',"",-1);
        createCookie('social_login_res',"",-1);
        createCookie('loyalty_login_res',"",-1);
        createCookie('sso_token',"",-1);
        createCookie('loyalty_token',"",-1);
        var path = window.location.href;
        path  = path.split('?')[0];
        window.location.href = path;
    });

    $('.illy-button.button-login').click(function() {
    	var link = $(this).data('link');
    	window.location.href = link;
    });

    $('.icon-search.icon-image').click(function() {
        var searchText = $('.search-input').val();
        var searchPattern = location.origin + document.querySelector("meta[name='searchPattern']").content;
        var searchPath = searchPattern.replace('q=','q='+searchText);
        window.location.href = searchPath;
    });

    function createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 *1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
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

    function getOwnershipByPageLanguage(lang) {

        var ownershipUrl = '/etc/designs/illysite/static/ownershipAndCountry.json';
        var ownershipAndCountries = null;
        $.ajax({
            type: "GET",
            url: ownershipUrl,
            async: false,
            success: function (data) {
                countries = data;
            },
            error: function () {
                console.log('call  ko')
            }
        });
        return countries[lang.substr(lang.length - 2)];
    }
});
function mySplit(cookieString,char) {
    var arr = new Array();
    arr[0] = cookieString.substring(0, cookieString.indexOf(char));
    arr[1] = cookieString.substring(cookieString.indexOf(char) + 1);
    return arr;
}
var keyStr = "ABCDEFGHIJKLMNOP" +
    "QRSTUVWXYZabcdef" +
    "ghijklmnopqrstuv" +
    "wxyz0123456789+/" +
    "=";

function encode64(input) {
    input = escape(input);
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
}

function decode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return unescape(output);
}
function fillComponentNotLoggedUser() {
	var $notloggedUserContainers = $('.login-button-not-logged');
	var $userInfo = $('#user-info');
	var loginTrigger = $('.login-wrap,.login-wrap__icon');
	if(loginTrigger.length){
        var $loginTarget = loginTrigger.find('.login-wrap__content');
            $loginTarget.removeClass('logged').addClass('not-logged');
	}
	$notloggedUserContainers.each(function() {
        if($(this).hasClass('disable')) {
            $(this).removeClass('disable');
        }
	});
	if($userInfo) {
		$userInfo.remove();
	}
}

function getInitials(firstName,lastName) {
	var firstNameInitials = firstName.substring(0,1);
	var lastNameInitials = lastName.substring(0,1);
	var initials = firstNameInitials + lastNameInitials;
	return initials.toUpperCase();
}

function fillComponentLoggedUser(obj) {
	var $notloggedUserContainers = $('.login-wrap__content__logged-out');
    var $loggedUserContainer = $('.login-wrap__content');
    	$notloggedUserContainers.hide();
    var loginTrigger = $('.login-wrap,.login-wrap__icon');
    if(loginTrigger.length){
        var $loginTarget = loginTrigger.find('.login-wrap__content');
            $loginTarget.removeClass('not-logged').addClass('logged');
    }
    var linksContainer = "<div class='login-wrap__content__logged-in__head'>";
    var myAccountPath = document.querySelector("meta[name='myAccountPath']").content;
    var domain = document.querySelector("meta[name='domain']").content;
    var path = domain + myAccountPath;
    var profilePhoto = "<div class='initials-box'>" + getInitials(obj.givenName,obj.familyName) + "</div>";
    if(obj.photo != undefined && obj.photo != ""){
        profilePhoto = "<img class='initials-box' src='" + obj.photo + "'>";
    }
    $(obj.links).each(function(){
        var link = this.url;
        if(this.isIllyLovers == 'true' && obj.groups.toLowerCase().indexOf('loyalty') >= 0){
            link = obj.urlLoyalty;
        }
        linksContainer += "<div class='user-name'><a href='" + link + "'>" + this.label + "</a></div>";
    });
    linksContainer += "<div class='user-logout'><a href='#' class='deepLink' id='logout'><div class='deepLink-arrow '>" + obj.logoutLabel + "</div></a></div></div>";

	$loggedUserContainer.append("<div class='login-wrap__content__logged-in'><div class='login-wrap__content__logged-in__top'>"
	+ "</div><div class='login-wrap__content__logged-in__body'><div class='user-avatar'>" + profilePhoto
	+ "</div><div class='user-fullname'>" + obj.fullName + "</div></div>" + linksContainer + "</div>");
}

function fillComponentLoggedCIUser(obj) {
	var $notloggedUserContainers = $('.login-wrap__content__logged-out');
    	var $loggedUserContainer = $('.login-wrap__content');
    	$notloggedUserContainers.hide();
	var loginTrigger = $('.login-wrap,.login-wrap__icon');
    if(loginTrigger.length){
        var $loginTarget = loginTrigger.find('.login-wrap__content');
            $loginTarget.removeClass('not-logged').addClass('logged');
    }
    var linksContainer = "<div class='login-wrap__content__logged-in__head'>";
    var myAccountPath = document.querySelector("meta[name='myAccountPath']").content;
    var domain = document.querySelector("meta[name='domain']").content;
    var path = domain + myAccountPath;
    var profilePhoto = "<div class='initials-box'>" + getInitials(obj.givenName,obj.familyName) + "</div>";
    if(obj.photo != undefined && obj.photo != ""){
        profilePhoto = "<img class='initials-box' src='" + obj.photo + "'>";
    }
    $(obj.links).each(function(){
        var link = this.url;
        if(this.isIllyLovers == 'true' && obj.groups.toLowerCase().indexOf('loyalty') >= 0){
            link = obj.urlLoyalty;
        }
        linksContainer += "<div class='user-name'><a href='" + link + "'>" + this.label + "</a></div>";
    });
    linksContainer += "<div class='user-logout'><a href='#' class='deepLink' id='logoutCI'><div class='deepLink-arrow '>" + obj.logoutLabel + "</div></a></div></div>";

    $loggedUserContainer.append("<div class='login-wrap__content__logged-in'><div class='login-wrap__content__logged-in__top'>"
    + "</div><div class='login-wrap__content__logged-in__body'><div class='user-avatar'>" + profilePhoto
    + "</div><div class='user-fullname'>" + obj.fullName + "</div></div>" + linksContainer + "</div>");
}
