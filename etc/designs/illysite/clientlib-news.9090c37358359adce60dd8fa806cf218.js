(function ($, author) {
    "use strict";

    function getNews(url) {
        var result;
        $.ajax({
            url: url + ".getNews.json", 
            async: false,
            success: function(response) {
                result = response;
            }
        });

        return result;
    }

    function getCurrentComponentProperties(url) {
        var properties;
        $.ajax({
            url: url, 
            async: false,
            success: function(response) {
                properties = response;
            }
        });

        return properties;
    }

    function buildCheckbox(news, currentComponentProperties) {
        var input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", "./newsItem." + news.title);
        if(currentComponentProperties["newsItem." + news.title] && currentComponentProperties["newsItem." + news.title] == "true") {
            input.setAttribute("checked", currentComponentProperties["newsItem." + news.title]);
        }
        input.value = "true";
        input.className = "coral-Checkbox-input";

        var spanCheckmark = document.createElement("span");
        spanCheckmark.className = "coral-Checkbox-checkmark";
        
        var spanDescription = document.createElement("span");
        spanDescription.className = "coral-Checkbox-description";
        spanDescription.innerText = news.title;
        
        var inputDelete = document.createElement("input");
        inputDelete.setAttribute("type", "hidden");
        inputDelete.setAttribute("name", "./newsItem." + news.title + "@Delete");

        var inputDefault = document.createElement("input");
        inputDefault.setAttribute("type", "hidden");
        inputDefault.setAttribute("name", "./newsItem." + news.title + "@DefaultValue");
        inputDefault.value="false";

        var inputDefaultWhenMissing = document.createElement("input");
        inputDefaultWhenMissing.setAttribute("type", "hidden");
        inputDefaultWhenMissing.setAttribute("name", "./newsItem." + news.title + "@UseDefaultWhenMissing");
        inputDefaultWhenMissing.value="true";

        var label = document.createElement("label");
        label.className="coral-Checkbox coral-Form-field"
        label.appendChild(input);
        label.appendChild(spanCheckmark);
        label.appendChild(spanDescription);
        label.appendChild(inputDelete);
        label.appendChild(inputDefault);
        label.appendChild(inputDefaultWhenMissing);

        var div = document.createElement("div");
        div.className="coral-Form-fieldwrapper coral-Form-fieldwrapper--singleline";
        div.appendChild(label);
        
        $(document).find(".custom-dialog-container-news-component").append(div);
    }

    $(document).on("dialog-ready", function () {
        
        var currentComponentUrl = $("coral-dialog.cq-dialog-floating").find("form.foundation-form").attr("action") + ".json";
        if(currentComponentUrl) {
            var currentPageUrl = $("coral-dialog.cq-dialog-floating").find("form.foundation-form").data("cq-dialog-pageeditor").replace(/\/editor\.html/, "").replace(/\.html/, "");
            var news = getNews(currentPageUrl);
            var currentComponentProperties = getCurrentComponentProperties(currentComponentUrl);
            
            if(news && currentComponentProperties) {
                for(var i = 0; i < news.length; i++) {
                    buildCheckbox(news[i], currentComponentProperties);
                }
            }
        }
    });
})($, Granite.author);
$(document).ready(function() {
    var limit;    
    var toShow;
    if(window.screen.width > 768) {
    	limit = $("#limitDesktop").val() || 12;
    	toShow = $("#toShowDesktop").val() || 9;
    } else {
    	limit = $("#limitMobile").val() || 8;
    	toShow = $("#toShowMobile").val() || 7;
    }
    
    var items = $(".singleNewsItem");
    for(var i = 0; i < items.length; i++) {
    	if(i >= limit) {
    		$(items[i]).addClass("hidden");
    	}
    }

    hiddenNews = $(".singleNewsItem.hidden");
    if(hiddenNews.length > 0) {
        $("#moreNewsButton").removeClass("hidden");
    }
    
    $("#moreNewsButton").on("click", function() {
        var hiddenNews = $(".singleNewsItem.hidden");

    	for(var i = 0; i < toShow; i++) {
    		if($(hiddenNews[i])) {
    			$(hiddenNews[i]).removeClass("hidden");
    		}
        }
        
        hiddenNews = $(".singleNewsItem.hidden");
        if(hiddenNews.length == 0) {
            $("#moreNewsButton").addClass("hidden");
        }
    });

    function manageChange() {
        var selectedYear = $("#yearSelect option:selected").val();
        var selectedTag = $("#tagSelect option:selected").val();
        var resourcePath = $("#resourcePath").val();
        var limit;
        if(window.screen.width > 768) {
            limit = $("#limitDesktop").val() || 12;
        } else {
            limit = $("#limitMobile").val() || 8;
        }

        $.ajax({
            url: resourcePath + ".filteredAndSortedNews.ext?year=" + selectedYear + "&tag=" + selectedTag + "&limit=" + limit, 
            async: false,
            dataType: 'html',
            success: function(response) {
                $(".singleNewsItem").remove()
                $(".gallery-wrapper .row.flexbox").append(response);
                
                hiddenNews = $(".singleNewsItem.hidden");
                if(hiddenNews.length > 0) {
                    $("#moreNewsButton").removeClass("hidden");
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
    
    $("#yearSelect").on("DOMSubtreeModified", manageChange);
    $("#tagSelect").on("DOMSubtreeModified", manageChange);
});
