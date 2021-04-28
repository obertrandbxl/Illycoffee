function getSiteType(){
    var type;
    if($(window).width() < 767) {
        type="mobile";
    }else if ($(window).width() > 767 && $(window).width() < 1024) {
        type="tablet";
    }else{
        type="desktop";
    }
    return type;
}

$(document).ready(function() {
    var params = $().serializeArray();
    var currentPath = location.href.replace(".html","");
    currentPath = currentPath.replace('#','');
    var pathSplitted = currentPath.split('?');
    if(pathSplitted.length == 2){
        currentPath = pathSplitted[0] + "/.tealium.json";
    }else{
        currentPath = currentPath +"/.tealium.json";
    }
    params.push({name: 'site_type', value:getSiteType()});
    $.ajax({
        type: "GET",
        data: params,
        url: currentPath,
        async: false,
        success: function (result) {
            if (result) {
                $("body").prepend("<script>var utag_data="+JSON.stringify(result, null, '\t')+";(function(a,b,c,d){a = '//tags.tiqcdn.com/utag/illy/shop/" + document.querySelector('meta[name=environment]').content + "/utag.js';b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=1;a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);})();<\/script>");
            }
        },
        error: function(request,error){
            console.log("Request: "+JSON.stringify(request));
        }
    });
});

