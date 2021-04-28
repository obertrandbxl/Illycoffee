var providers = ["facebook", "googleplus", "linkedin", "yahoo"];
var enable_resize = true;
var providersPerPage = '4';
var currentPath = location.href.replace(".com/", ".com/content/illysite/").replace('.html','').replace('#','').replace("?wcmmode=disabled","");

(function () {
	if (typeof window.janrain !== 'object') window.janrain = {};
	if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
	/* _______________ can edit below this line _______________ */
	janrain.settings.tokenUrl = currentPath + "/.socialLogin.html";
	janrain.settings.type = 'embed';
	janrain.settings.appId = 'fhjnacjdijlobokdmgnl';
	janrain.settings.appUrl = 'https://login.illy.com';
	janrain.settings.providers = providers;
	janrain.settings.providersPerPage = providersPerPage;
	janrain.settings.format = 'one row';
	janrain.settings.actionText = ' ';
	janrain.settings.showAttribution = false;
	janrain.settings.fontColor = '#333333';
	janrain.settings.fontFamily = 'helvetica, sans-serif';
	janrain.settings.backgroundColor = '#FFFFFF';
	janrain.settings.width = '216';
	janrain.settings.borderColor = '#CCCCCC';
	janrain.settings.borderRadius = '10';
	janrain.settings.buttonBorderColor = '#CCCCCC';
	janrain.settings.buttonBorderRadius = '10';
	janrain.settings.buttonBackgroundStyle = 'gradient';
	janrain.settings.language = 'en';
	janrain.settings.custom = true;
	janrain.settings.linkClass = 'janrainEngage';

	function isReady() {
		janrain.ready = true;
	};
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", isReady, false);
	} else {
		window.attachEvent('onload', isReady);
	}

	var e = document.createElement('script');
	e.type = 'text/javascript';
	e.id = 'janrainAuthWidget';
	$(document).ready(function () {
		if ($('#userAccess-register-form').length) {
			if (document.location.protocol === 'https:') {
				e.src = 'https://rpxnow.com/js/lib/login.illy.com/engage.js';
			} else {
				e.src = 'http://widget-cdn.rpxnow.com/js/lib/login.illy.com/engage.js';
			}
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(e, s);
		}
	});
})();

// Error tracking
$(document).ajaxError(function (event, jqxhr, settings, exception) {
	console.log(event);
	console.log(jqxhr);
	console.log(settings);
	console.log(exception);
});

var janrainWidgetOnload = function () {
	janrain.events.onProviderLoginToken.addHandler(function (data) {
		$.ajax({
			type: "POST",
			url: currentPath + "/.socialLogin.html",
			data: {
				'token': data.token,
				'groupToVerify':$('#groupToVerify').val()
			},
			success: function (response) {
				if(response.redirectLink){
				    window.location.href = response.redirectLink;
				}
			}
		});
	});
};

janrain.settings.tokenAction = 'event';