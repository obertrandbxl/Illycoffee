var language = "";
var jsonType = "";
var basePath = "";
var servletUrl = "";
const REGIONE = "REGIONE";
const AREA = "AREA";
const PAESE = "PAESE";
const CITTA = "CITTA";

$(document).ready(function () {
    var buttonMap = document.querySelector(".buttonMap");
    var buttonMapColor = document.querySelector(".buttonMapColor");
    var buttonTextMap = document.querySelector(".buttonTextMap");
    var buttonTextMapColor = document.querySelector(".buttonTextMapColor");
    if (typeof buttonMap != 'undefined' && buttonMap != null && typeof buttonTextMap != 'undefined' && buttonTextMap != null) {
        buttonMap = buttonMap.textContent;
        buttonTextMap = buttonTextMap.textContent;
    }
    if (typeof buttonMapColor != 'undefined' && buttonMapColor != null) {
        buttonMapColor = buttonMapColor.textContent;
    } else {
        buttonMapColor = 'red-btn';
    }
    if (typeof buttonTextMapColor != 'undefined' && buttonTextMapColor != null) {
        buttonTextMapColor = buttonTextMapColor.textContent;
    } else {
        buttonTextMapColor = 'red-btn';
    }

    basePath = document.querySelector("meta[name='basePath']").content;
    servletUrl = Granite.HTTP.externalize(basePath + "/.squaredBoxMap.json");
    jsonType = $('.bannerSelection-wrapper').data('type');
    language = $('#mtdSelectContinent').data('language');
    if (typeof language == 'undefined' && language == null) {
        language = 'EN';
    } else {
        language = language.toUpperCase();
    }
    if(jsonType != undefined){
        var params = $().serializeArray();
        params.push({ name: 'sequence', value: "first" });
        params.push({ name: 'type', value: jsonType });
        params.push({ name: 'lang', value: language });
        $.ajax({
            type: "GET",
            url: servletUrl,
            async: false,
            data: params,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                loadFirstSelect(result);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("Something went wrong (status code: " + xhr.status + ")");
            }
        });
    }

});

function loadFirstSelect(continents) {
    for (var i = 0; i < continents.length; i++) {
        var option = '<option value="' + continents[i] + '">' + continents[i] + '</option>';
        $('#mtdSelectContinent').append(option);
    }
    $('#mtdSelectContinent').on("DOMSubtreeModified", { filter: continents }, function (evt) { onchangeFirstSelect(evt.data.filter) });
}

function onchangeFirstSelect(filterArea) {
    removeListOldOption();
    remove();
    var area = $('#mtdSelectContinent').val();
    var params = $().serializeArray();
    params.push({ name: 'sequence', value: "second" });
    params.push({ name: 'type', value: jsonType });
    params.push({ name: 'lang', value: language });
    params.push({ name: 'area', value: area });
    $.ajax({
        type: "GET",
        url: servletUrl,
        async: false,
        data: params,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadSecondSelect(result);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Something went wrong (status code: " + xhr.status + ")");
        }
    });
}

function loadSecondSelect(countries) {
    for (var i = 0; i < countries.length; i++) {
        var option = '<option value="' + countries[i] + '">' + countries[i] + '</option>';
        $('#mtdSelectCountry').append(option);
    }
    createSecondSelect();
    $('#mtdSelectCountry').on("DOMSubtreeModified", { obj: countries }, function (evt) { onchangeSecondSelect(evt.data.obj) });
}

function onchangeSecondSelect(call) {
    remove();

    var obj = "";
    var arrayObj = [];
    var country = $('#mtdSelectCountry').val();
    var area = $('#mtdSelectContinent').val();
    var buttonMap = document.querySelector(".buttonMap");
    var buttonMapColor = document.querySelector(".buttonMapColor");
    var buttonTextMap = document.querySelector(".buttonTextMap");
    var buttonTextMapColor = document.querySelector(".buttonTextMapColor");
    var showButton = document.querySelector(".showButton").innerHTML == 'true';

    if (typeof buttonMap != 'undefined' && buttonMap != null && typeof buttonTextMap != 'undefined' && buttonTextMap != null) {
        buttonMap = buttonMap.textContent;
        buttonTextMap = buttonTextMap.textContent;
    }
    if (typeof buttonMapColor != 'undefined' && buttonMapColor != null) {
        buttonMapColor = buttonMapColor.textContent;
    } else {
        buttonMapColor = 'red-btn';
    }
    if (typeof buttonTextMapColor != 'undefined' && buttonTextMapColor != null) {
        buttonTextMapColor = buttonTextMapColor.textContent;
    } else {
        buttonTextMapColor = 'red-btn';
    }


    var params = $().serializeArray();
    params.push({ name: 'sequence', value: "third" });
    params.push({ name: 'type', value: jsonType });
    params.push({ name: 'lang', value: language });
    params.push({ name: 'area', value: area });
    params.push({ name: 'country', value: country });
    $.ajax({
        type: "GET",
        url: servletUrl,
        async: false,
        data: params,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (call) {
            var div = [];
            var content = "";
            var rowNumber = 1;
            var insertedRows = 0;
            for (var i = 0; i < call.length; i++) {
                if (call[i].AREA != null) {
                    //if (call[i].AREA == area && call[i].PAESE == country) {
                        div.push(tMap(i, call[i], buttonMap, buttonMapColor, Math.floor(insertedRows / 2)));
                        insertedRows++;
                    //}
                } else {
                    //if (call[i].REGIONE == area && call[i].CITTA == country) {
                        div.push(tMap(i, call[i], buttonMap, buttonMapColor, Math.floor(insertedRows / 2)));
                        insertedRows++;
                    //}
                }
                if ((i + 1) % 2 == 0) {
                    rowNumber = rowNumber + 1;
                }
            }
            var alternate = false;
            for (var i = 0; i < div.length; i++) {
                var divMap = div[i + 1] == null ? "" : div[i + 1];
                if (alternate) {
                    content += '<div class="maps-wrapper squaredBoxMaps-wrapper row expanded collapse">' +
                        div[i] +
                        divMap +
                        '</div>';
                    alternate = false;
                } else {
                    content += '<div class="maps-wrapper squaredBoxMaps-wrapper row expanded collapse">' +
                        div[i] +
                        divMap +
                        '</div>';
                    alternate = true;
                }

                i++;
            }
            $('#contentMap').append(content);
            for (var i = 0; i < call.length; i++) {
                if (call[i].AREA != null) {
                    //if (call[i].AREA == area && call[i].PAESE == country) {
                        initSquaredMap(i, call[i], buttonTextMap, buttonTextMapColor, showButton);
                    //}
                } else {
                    //if (call[i].REGIONE == area && call[i].CITTA == country) {
                        initSquaredMap(i, call[i], buttonTextMap, buttonTextMapColor, showButton);
                    //}
                }
            }

            //scroll to the maps
            $([document.documentElement, document.body]).animate({
                scrollTop: $(".container-content-squared .map-container").offset().top - $(".header-botrow").outerHeight() - 40
            }, "slow");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Something went wrong (status code: " + xhr.status + ")");
        }
    });
}

function getItalyData(obj) {
    if (obj == null) {
        return;
    }
    var filterRegion = functionFilterArea(obj, REGIONE);
    for (var i = 0; i < filterRegion.length; i++) {
        var option = '<option value="' + filterRegion[i] + '">' + filterRegion[i] + '</option>';
        $('#mtdSelectContinent').append(option);
    }
    var filterCity = functionFilterPaese(obj, filterRegion, REGIONE, CITTA);

    $('#mtdSelectContinent').on("DOMSubtreeModified", { filter: filterCity }, function (evt) { onchangeFirstSelect(evt.data.filter) });
    $('#mtdSelectCountry').on("DOMSubtreeModified", { obj: obj }, function (evt) { onchangeSecondSelect(evt.data.obj) });
}

function remove() {
    var removeDiv = $("#contentMap");
    var children = removeDiv.children().remove();
}

function removeListOldOption() {
    var country = $('#mtdSelectCountry');
    country.unbind("DOMSubtreeModified")
    var option = country.find("option");
    if (option.length > 2) {
        for (var i = 2; i < option.length; i++) {
            option[i].remove()
        }
    }
}

function tMap(index, data, buttonMap, buttonColor, rowNumber) {
    var tipo = "";
    var br = "<br>";
    if (data.TIPO != null) {
        tipo = data.TIPO + br;
    }
    var pushClass = '';
    var pullClass = '';
    if (rowNumber % 2 == 0) {
        pushClass = 'large-push-3';
        pullClass = 'large-pull-3';
    }
    var contentIdMap = '<div class="column small-12 medium-6 ' + pullClass + ' large-3" style="float:left;"><div class="container-content-squared"><div id="map' + index + '" class="map-container" style="position: relative; overflow: hidden; height: 300px;">' + '</div></div></div>';

    var contentText = '<div class="column small-12 medium-6 ' + pushClass + ' large-3" style="float:left;">' +
        '<div class="container-content-squared txtBox">' +
        '<div class="title-maps" id="title-maps' + index + '">' + tipo + data.NOME + '</div>' +
        '<div class="store-details illy-link">';

    if (data.PERSONA1 != null) {
        contentText += data.PERSONA1 + '<br>';
    }
    if (data.PERSONA2 != null) {
        contentText += data.PERSONA2 + '<br>';
    }
    if (data.PERSONA3 != null) {
        contentText += data.PERSONA3 + '<br>';
    }
    if (data.PERSONA4 != null) {
        contentText += data.PERSONA4 + '<br>';
    }
    if (data.TELEFONO1 != null) {
        contentText += '<a href=' + data.TELEFONO1 + '>' + data.TELEFONO1 + '</a><br>';
    }
    if (data.TELEFONO2 != null) {
        contentText += '<a href=' + data.TELEFONO2 + '>' + data.TELEFONO2 + '</a><br>';
    }
    if (data.FAX != null) {
        contentText += data.FAX + '<br>';
    }
    if (data.MOBILE != null) {
        contentText += data.MOBILE + '<br>';
    }
    if (data.MAIL1 != null) {
        contentText += data.MAIL1 + '<br>';
    }
    if (data.MAIL2 != null) {
        contentText += data.MAIL2 + '<br>';
    }
    if (data.MAIL3 != null) {
        contentText += data.MAIL3 + '<br>';
    }
    if (data.WEBSITE != null) {
        contentText += '<a href="'+data.WEBSITE + '">'+data.WEBSITE+'</a><br>';
    }
    if (data.SHOP != null) {
        contentText +=  '<a href="'+data.SHOP + '">'+data.SHOP+'</a><br>';
    }
    contentText += '<a href="https://www.google.com/maps/search/?api=1&query=' + data.LAT + ',' + data.LONG + '" target="_blank"><span class="illy-button ' + buttonColor + ' butt-call-to-action">' + buttonMap + '</span></a>' +
        '</div>' +
        '</div>' +
        '</div>';
    var divFull = contentText + contentIdMap;
    return divFull;
}


function initSquaredMap(index, data, buttonTextMap, buttonColor, showButton) {

    if (data == null) {
        return;
    }
    var map;
    var lat = null;
    var br = "<br>";
    var long = null;

    if (data.LAT != null) {
        lat = parseFloat(data.LAT);
    }
    if (data.LONG != null) {
        long = parseFloat(data.LONG);
    }
    map = new google.maps.Map(document.getElementById('map' + index), {
        zoom: 16,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: 'roadmap',
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [{
            featureType: "poi",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }]
    });

    var iconBase = 'https://www.illy.com/professional/images/company/gmap/';
    var icons = {
        info: {
            icon: iconBase + 'ico-map-locale.png'
        }
    };

    var features = [{
        position: new google.maps.LatLng(lat, long),
        type: 'info'
    }];

    var tipo = "";
    var br = "<br>";
    if (data.TIPO != null) {
        tipo = data.TIPO + ' - ';
    }
    var buttonContent = buttonTextMap.length != 0 && showButton ? '<a href="https://www.google.com/maps/search/?api=1&query=' + data.LAT + ',' + data.LONG + '" target="_blank"><span class="illy-button ' + buttonColor + ' butt-call-to-action">' + buttonTextMap + '</span></a>' : '';
    var indirizzo = data.INDIRIZZO != undefined ? data.INDIRIZZO : "";
    var postalInfoFooter = data.POSTALINFOOROTHER != undefined ? data.POSTALINFOOROTHER : "";
    var citta = data.CITTA != undefined ? data.CITTA : "";
    var contentString = '<div id="content" data-address="' + indirizzo + '">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<div class="bodyContent">' +
        '<h2 id="firstHeading" class="firstHeading ">' + tipo + data.NOME +
        '</h2>' +
        '<p>' + indirizzo + " - " + postalInfoFooter + " - " + citta +
        '</p>' +
        buttonContent +
        '</div>' +
        '</div>';


    var infowindow = new google.maps.InfoWindow({
        content: contentString,
    });

    var marker;
    features.forEach(function (feature) {
        marker = new google.maps.Marker({
            position: feature.position,
            icon: icons[feature.type].icon,
            map: map
        });
        marker.addListener('click', function () {
            if (!$("#map" + index).find('.gm-style-iw').length) {
                infowindow.open(map, marker);
            }
        });
        var latLng = marker.getPosition();
        map.setCenter(latLng);

    });

    $("#title-maps" + index).on('click', function () {
        if (!$("#map" + index).find('.gm-style-iw').length) {
            infowindow.open(map, marker);
        }
    });

    $("#map" + index).on('keydown', function () {
        if ((event.which == 13 || event.keyCode == 13) && (!$("#map" + index).find('.gm-style-iw').length) && ($('.markerIcon').is(":focus"))) {
            infowindow.open(map, marker);
        }
    });

    infowindow.open(map, marker);

    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        $('.maps-wrapper').find('iframe').attr('tabindex', -1);
        $('.maps-wrapper').find('div').attr('tabindex', -1);
        $('.maps-wrapper').find(".gm-style").find("div").find('img').filter("[src='professional/images/company/gmap/ico-map-locale.png']").attr('tabindex', 0).addClass('markerIcon'); //src should be configurated and connected to icon's path of map marker
    });
}