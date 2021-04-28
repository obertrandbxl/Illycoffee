$(document).ready(function() {
    $('.contactForm').submit(function(e) {
    e.preventDefault();
    var params = $().serializeArray();
    var basePath = document.querySelector("meta[name='basePath']").content;

    var firstName = document.getElementById("dwfrm_contactus_firstname").value;
    var lastName = document.getElementById("dwfrm_contactus_lastname").value;
    var emailFrom = document.getElementById("dwfrm_contactus_email").value;
    var phone = document.getElementById("dwfrm_contactus_phone").value;
    var orderNumber = document.getElementById("dwfrm_contactus_ordernumber").value;
    var comment = document.getElementById("dwfrm_contactus_comment").value;

    params.push({name: 'firstName', value:firstName});
    params.push({name: 'lastName', value:lastName});
    params.push({name: 'emailFrom', value:emailFrom});
    params.push({name: 'phone', value:phone});
    params.push({name: 'orderNumber', value:orderNumber});
    params.push({name: 'comment', value:comment});
    $.ajax({
        type: "POST",
        data: params,
        url: basePath+"/.contactform.html",
        async: false,
        success: function (result) {

        },
        error: function(request,error){
            console.log("Request: "+JSON.stringify(request));
        }
    });
    });
});