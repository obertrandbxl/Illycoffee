function checkWhiteColor(color) {
	return color == "#fff"
		|| color == "#ffffff"
		|| color == "#FFF"
		|| color == "#FFFFFF" ? true : false;
}

var variantsCode = new Map();
$(document).ready(function() {
	$('.product-card').each(function() {
        var variants = $(this).find('.color-indicator');
        var variantList = [];
        if(variants.length > 0) {
			$(variants).each(function() {
                var productObj = {
                    'index': $(this).data('index'),
                    'id': $(this).data('id'),
                    'color': $(this).data('color'),
                    'img' : $(this).data('image'),
                    'title': $(this).data('title'),
                    'alt': $(this).data('alt'),
                    'price': $(this).data('price'),
                    'link': $(this).data('link'),
                    'isNew': $(this).data('new'),
                    'currency': $(this).data('currency')
                }
                variantList.push(productObj);
			});

			var product = $(this).closest('.product-card');
			product.attr('data-variants', variants.length);
			var baseProduct = product.attr('data-prdbase');
			variantsCode.set(baseProduct, variantList);

			var variantList = variantsCode.get(""+baseProduct);
			$(this).find('.product-image-link').attr('href', variantList[0].link);
			var productImage = $(this).find('.product-img');
			if(productImage.hasClass('lazy')){
                productImage.attr('data-src', variantList[0].img);
			}else{
			    productImage.attr('src', variantList[0].img);
			}
            productImage.attr('alt', variantList[0].alt);
            productImage.attr('title', variantList[0].title);
            $(this).find('.color-indicator-product-card').css("background-color", variantList[0].color);
            $(this).find('.color-indicator-product-card').css("border", "solid 1px " + variantList[0].color);
            if(checkWhiteColor(variantList[0].color)) {
            	$(this).find('.color-indicator-product-card').css("border", "solid 1px #636660");
            }
            $(this).find('.color-indicator-product-card').attr("data-product-id", variantList[0].id);
            $(this).find('.color-indicator-product-card').attr("data-product-index", variantList[0].index);

        	var productPrice = $(this).find(".product-price");
        	productPrice.html(variantList[0].currency + ' ' + variantList[0].price);
        	
        	if(variantList[0].isNew){
        		product.find(".mask-new").show();
            }else{
            	product.find(".mask-new").hide();
            }
    	}
	});
});

$('.previus-color-indicator-product-card').on('click', function() {
	var productContainer = $(this).closest(".product-card");
	var currentColor = $(this).siblings('.color-indicator-product-card');
	var index = currentColor.attr('data-product-index');
	var numberOfVariants = productContainer.data('variants');

	if(index == 0) {
		index = numberOfVariants-1;
	} else {
		index--;
	}

	var baseProduct = productContainer.data('prdbase');
	var variantList = variantsCode.get(""+baseProduct);
	var productImage = productContainer.find('.product-img');
	var productPrice= productContainer.find(".product-price");
    var productLink = productContainer.find('.product-image-link');
	var productName= productContainer.find(".main-text-product-card");
	
	productName.html(variantList[index].alt);
    productLink.attr('href', variantList[index].link);
	productImage.attr('src', variantList[index].img);
	productImage.attr('alt', variantList[index].alt);
	productImage.attr('title', variantList[index].title);
	productPrice.html(variantList[index].currency + ' ' + variantList[index].price  );

    currentColor.css("background-color", variantList[index].color);
    currentColor.css("border", "solid 1px " + variantList[index].color);
    if(checkWhiteColor(variantList[index].color)) {
    	currentColor.css("border", "solid 1px #636660");
    }
    currentColor.attr("data-product-id", variantList[index].id);
    currentColor.attr("data-product-index", index);
    
    
    if(variantList[index].isNew){
    	productContainer.find(".mask-new").show();
    }else{
    	productContainer.find(".mask-new").hide();
    }

});

$('.next-color-indicator-product-card').on('click', function() {
	var productContainer = $(this).closest(".product-card");
	var currentColor = $(this).siblings('.color-indicator-product-card');
	var index = currentColor.attr('data-product-index');
	var numberOfVariants = productContainer.data('variants');

	if(index == numberOfVariants-1) {
		index = 0;
	} else {
		index ++;
	}

	var baseProduct = productContainer.data('prdbase');
	var productImage = productContainer.find('.product-img');
	var productPrice= productContainer.find(".product-price");
    var variantList = variantsCode.get(""+baseProduct);
    var productLink = productContainer.find('.product-image-link');
	var productName= productContainer.find(".main-text-product-card");
	
	productName.html(variantList[index].alt);
    productLink.attr('href', variantList[index].link);
	productImage.attr('src', variantList[index].img);
	productImage.attr('alt', variantList[index].alt);
	productImage.attr('title', variantList[index].title);
    productPrice.html(variantList[index].currency + ' ' + variantList[index].price  );

    currentColor.css("background-color", variantList[index].color);
    currentColor.css("border", "solid 1px " + variantList[index].color);
    if(checkWhiteColor(variantList[index].color)) {
    	currentColor.css("border", "solid 1px #636660");
    }
    currentColor.attr("data-product-id", variantList[index].id);
    currentColor.attr("data-product-index", index);
    
    if(variantList[index].isNew){
    	productContainer.find(".mask-new").show();
    }else{
    	productContainer.find(".mask-new").hide();
    }
});


$(".add-button").on("click", function(e) {
	var basePath = document.querySelector("meta[name='basePath']").content;
	var productCard = $(this).closest(".product-card");
	var productId = productCard.find('.color-indicator-product-card').data('product-id');
	if(!productId) {
		productId = productCard.data('prdbase');
	}
	var $product_card = productCard.find('.product-card-quantity');
	var quantity = $product_card[0].dataset.product;
    var params = $().serializeArray();
    params.push({name: 'product_id', value: productId});
    params.push({name: 'quantity', value: quantity});

    var addToBasketURL = basePath + "/.addToBasket.json";
    var $addToCartButton = $(this);
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: addToBasketURL,
        data: params,
        async: false,
        success: function (data) {
            if(data.basketsInfo.fault){
                console.log("Add to Basket => KO -- message: "+ data.basketsInfo.fault.message);
            }else{
                var $added_button = $addToCartButton.siblings('.added-button');
                var addedLabel = $added_button.data('addedlabel');
                $added_button.find('span').first().html(addedLabel);
                $addToCartButton.siblings('.added-button').css('display', 'block');
            	$addToCartButton.css('display', 'none');
            	var that = this;
            	setTimeout(function () {
            		$addToCartButton.css('display', 'block');
            		$addToCartButton.siblings('.added-button').css('display', 'none');
            		$added_button.find('span').first().html('');
            		$addToCartButton.focus();
            	}, 5000);
                fillCart(data);
            }
        },
        error: function () {
            console.log("Add to Basket => KO");
        }
    });
})

$(".subscribe").on("click", function() {
	var link = $(this).data('link');
	window.location.href = link;
});
