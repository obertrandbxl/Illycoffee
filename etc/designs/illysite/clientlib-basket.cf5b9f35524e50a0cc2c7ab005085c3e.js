function getProduct(code) {
    var obj;
    var basePath = document.querySelector("meta[name='basePath']").content;
    var salesforceLocale = document.querySelector("meta[name='salesforceLocale']").content;
    var getProductURL = basePath+"/.getProductInformation.json?productCode="+code+"&locale="+salesforceLocale;
    $.ajax({
        type: "get",
        url: getProductURL,
        async: false,
        error: function () {
            console.log("getProductURL KO");
        }
    }).then(function(data){
        obj = data;
    });
    return obj;
}
$( document ).ready(function() {
    var basePath = document.querySelector("meta[name='basePath']").content;
    var getCartURL = basePath+"/.getBasketsInformation.json?ch_ck=" + Date.now();
    $.ajax({
        type: "get",
        url: getCartURL,
        async: true,
        cache: false,
        success: function (data) {
            if(data.basketsInfo && data.basketsInfo.fault){
                console.log("CART: "+data.basketsInfo.fault.message);
            }else{
                fillCart(data);
            }
        },
        error: function () {
            console.log("cart KO");
            $(".mini-cart-content").remove();
            $(".minicart-quantity").html(0);
        }
    });
});
function fillCart(data) {
	//delete old minicart and create the new minicart
	 $('#mini-cart-section .mini-cart-content').remove();
	
    var quantity =$('div.mini-cart-quantity > span.label').text();
    var quantityTotal = 0;
    var basketsInfo= data.basketsInfo;
    var designPath = document.querySelector("meta[name='designPath']").content;
    var currency = document.querySelector("meta[name='currencySymbol']").content;
    
    var buttonLink = '';
    if(document.querySelector(".buttonLink")){
    	buttonLink = document.querySelector(".buttonLink").textContent;
    }
    
    var qtyLabel = '';
    if(document.querySelector(".qtyLabel")){
    	qtyLabel = document.querySelector(".qtyLabel").textContent;
    }
    
    var subTotLabel = '';
    if(document.querySelector(".subTotLabel")){
    	subTotLabel = document.querySelector(".subTotLabel").textContent;
    }
    
    var colorLabel = '';
    if(document.querySelector(".colorLabel")){
    	colorLabel = document.querySelector(".colorLabel").textContent;
    }
    
    var buttonLabel = '';
    if(document.querySelector(".buttonLabel")){
    	buttonLabel = document.querySelector(".buttonLabel").textContent;
    }
    
    //da capire questi dati cosa sono
    var messageReturn = document.querySelector(".messageReturn");
    var linkMessageReturn = document.querySelector(".linkMessageReturn");
    var messageReturnValue = '';
    if( messageReturn ){ 
      messageReturnValue =  '<div class="mini-cart-slot">'
                          + '<div class="html-slot-container">'
                          + '<p id="smc_mr"><span>'
                          + messageReturn.textContent
                          + '</span></p></div></div>';
    }

    if(basketsInfo && basketsInfo.product_items){
    	var subTotal = basketsInfo.product_sub_total;
        $('#mini-cart-section').append('<div class="mini-cart-content">'+
            '<div id="products" class="mini-cart-products">'+
            //list products
            '</div>'+
            '<div class="mini-cart-totals">'+
            '<div class="mini-cart-subtotals">'+
            '<span class="label">' + subTotLabel + '</span>'+
            '<span class="value">'+currency+' '+ parseFloat(Math.round(subTotal * 100) / 100).toFixed(2) +'</span>'+
            '</div>'+
            '<div class="mini-cart-footer">'+
            messageReturnValue +
            '<a class="illy-button red-btn round-button mini-cart-link-cart btn btn-primary btn-block btn-icon"'+
            'href="'+buttonLink+'" title="'+buttonLabel+'">'+
            buttonLabel+
            '</a>'+
            '</div>'+
            '</div>'+
            '</div>');


        for (var i = 0; i < basketsInfo.product_items.length; i++) {
            quantityTotal += basketsInfo.product_items[i].quantity;
            let imgUrl = designPath + "/static/assets/not_found_image.png";
            let isVariant = false;
            let color = '';
            let product_name_from_object = '';
            if(basketsInfo.product_items[i].product_id){
                var response = getProduct(basketsInfo.product_items[i].product_id);
                if(response.imgUrl) {
                    imgUrl = response.imgUrl;
                    isVariant = response.isVariant;
                    color = response.color_transparent;
					product_name_from_object = response.product_name;
                }
            }else{

            }
			product_name_from_object = product_name_from_object != null && product_name_from_object != '' && product_name_from_object != undefined ? product_name_from_object : basketsInfo.product_items[i].product_name;
            var htmlProduct = 
            	'<div class="mini-cart-product">'+
		        	'<div class="mini-cart-image">'+
			    		'<img itemprop="" itemtype="" data-sizes="auto" alt="" title="" '+
			    			'data-src="' + imgUrl + '" '+
			    			'srcset="' + imgUrl + '" '+
			    			'data-srcset="' + imgUrl + '"'+
			    			'class="null lazyautosizes lazyloaded" '+
			    			'sizes="45px" src="' + imgUrl + '"/>'+
			    	'</div>'+
			    	'<div class="mini-cart-product-info">'+
			    		'<div class="mini-cart-name">'+
			    			'<span class="product-name">'+product_name_from_object+'</span>'+
			    		'</div>';
            if(isVariant){
		            	htmlProduct = htmlProduct + 
		            	'<div class="mini-cart-attributes">'+
		            		'<div class="attribute" data-attribute="color">'+
		            			'<span class="label">' + colorLabel + '</span>'+
		            			'<span class="value">' + color + '</span>'+
		            		'</div>'+
		            	'</div>';
            }
            
            var price = basketsInfo.product_items[i].price;
            htmlProduct = htmlProduct + 
		    			'<div class="mini-cart-pricing">'+
		    				'<div class="mini-cart-quantity">'+
		    					'<span class="label">'+qtyLabel+' </span>'+
		    					'<span class="value">'+basketsInfo.product_items[i].quantity+'</span>'+
		    				'</div>'+
		    				'<div class="order-groove-wrapper">'+
		    					'<div class="og-offer" data-og-module="cart_flydown" data-og-product="7191ME">'+
		    						'<div class="og-type-CartRadioWidget og-offer-e78fb19832a911e8917abc764e106cf4 og-locale-en-us"></div>'+
		    					'</div>'+
		    				'</div>'+
		    				'<span class="mini-cart-price"> '+ currency + ' ' + parseFloat(Math.round(price * 100) / 100).toFixed(2); +'</span>'+
		    			'</div>'+
		    		'</div>'+
		    	'</div>'
                      
            $("#products").append(htmlProduct);
        }
    }

    if( linkMessageReturn && messageReturn ){
      var target = $('#smc_mr span');
      target.replaceWith('<a href="' + linkMessageReturn.textContent + '">'+ messageReturn.textContent +'</a>');
    }

    var numberMenu = $('.chart-number-menu');
	if(data.basketsInfo != null && data.basketsInfo != undefined){
        var basketsInfo = data.basketsInfo;
        var productItems = basketsInfo.product_items;
        if(!productItems) {
            $(numberMenu).css('display','none');
            return;
        }
        var quantity = fillQuantity(productItems);
        $(numberMenu).text(quantity);
        $(numberMenu).show();
	}

}

/* jQuery mouseover to show hidden div and to show div if only mouse still over the div - START */

// timer for hiding the div
var Wwindow;
var hideTimer;

// show the DIV on mouse over
$('#mini-cart').mouseover(function() {
  var products = $('.mini-cart-content');
  if(products.length != 0){
	// forget any hiding events in timer
	clearTimeout( hideTimer );
	Wwindow = window.innerWidth;
	if(Wwindow >= 1230){
		$('#mini-cart-section').addClass('show');
	}
  }
});

$(".mini-cart-content").mouseover(function() {
  var products = $('.mini-cart-content');
  if(products.length != 0){
	// forget any hiding events in timer
	clearTimeout( hideTimer );
	Wwindow = window.innerWidth;
	if(Wwindow >= 1230){
		$('#mini-cart-section').addClass('show');
	}
  }
});

// set a timer to hide the DIV
$('#mini-cart').mouseout(function() {
	hideTimer = setTimeout( hideCart, 333 );
});

$(".mini-cart-content").mouseout(function() {
	hideTimer = setTimeout( hideCart, 333 );
});

// hides the DIV
function hideCart() {
	$('#mini-cart-section').removeClass('show');
}

/* jQuery mouseover to show hidden div and to show div if only mouse still over the div - END */

function fillCart1(data) {
	var numberMenu = $('.chart-number-menu');
	var basketsInfo = data.basketsInfo;
	var productItems = basketsInfo.product_items;
	if(!productItems) {
		$(numberMenu).css('display','none');
		return;
	}
	var quantity = fillQuantity(productItems);
	$(numberMenu).text(quantity);
	$(numberMenu).show();
}

function fillQuantity(productItems) {
	var totalQuantity=0;
	$(productItems).each(function(){
		totalQuantity += this.quantity;
	});
	return totalQuantity;
}


