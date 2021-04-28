$( document ).ready(function() {
	var paramValue = getUrlParameter('q');
	var queryString = window.location.search.substring(1);
    if (paramValue != '' && paramValue != undefined){
        var newQueryString = queryString.replace(/[&]*userdata=([^&]$|[^&]*)/g, '');
        if(newQueryString != '' && newQueryString != undefined){
            var iframeUrl = $('#surveyIframe').attr('src');
            if(iframeUrl.lastIndexOf("/") != (iframeUrl.length+1) && !(paramValue.startsWith('/'))){
                paramValue = '/' + paramValue
            }
            $('#surveyIframe').attr('src',iframeUrl + paramValue + '?' + newQueryString);
        }
    }


	function getUrlParameter(param) {
        var pageUrl = window.location.search.substring(1);
        var urlVariables = pageUrl.split('&');
        var parameterName;
        for (var i = 0; i < urlVariables.length; i++) {
            parameterName = urlVariables[i].split('=');
            if (parameterName[0] === param) {
                return parameterName[1] === undefined ? '' : decodeURIComponent(parameterName[1]);
            }
        }
    };
})

