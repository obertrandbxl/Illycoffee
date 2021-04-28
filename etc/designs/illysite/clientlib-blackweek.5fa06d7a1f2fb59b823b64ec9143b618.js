if ($('.dataCollectionForm-wrapper').length) {
	$(document).ready(function() {
		var gatewayIsEnabled = $("#data-collection-form").attr("data-gateway");
		var defaultOwnership;

		if ($('#country').length) {
			createNationalitySelect();
		} else {
			defaultOwnership = getOwnershipByPageLanguage(document.getElementsByName('language_country')[0].content);
		}


		$('#data-collection-form').on('submit', function(event) {
			if (gatewayIsEnabled == "false" || gatewayIsEnabled == undefined) {
				event.preventDefault();
				var cont = 0;
				$('#data-collection-form input.form-etrio__error, #data-collection-form select.form-etrio__error').each(function() {
					if ($(this).is(":visible") || !$(this).is("country")) {
						cont++;
					}
				});
				if (cont === 0) {
					var currentPath = location.href;
					if (location.href.indexOf('/content/illysite') == -1) {
						currentPath = location.href.replace('.com/', '.com/content/illysite/')
					}
					currentPath = currentPath.replace('.html', '');
					currentPath = currentPath.split('#')[0];
					currentPath = currentPath.split('?')[0];

					var blackWeekRegUrl = currentPath + '/.blackWeekReg.json?_' + Date.now();

					var params = $().serializeArray();

					params.push({ name: 'firstName', value: $('#firstName').val() });
					params.push({ name: 'lastName', value: $('#lastName').val() })
					params.push({ name: 'email', value: $('#email').val() })
					var parent = $('#phone').parent();
					var phoneNumber = $(parent).find('.iti__selected-dial-code').text() + $('#phone').val();
					params.push({ name: 'phones', value: phoneNumber })
					params.push({ name: 'isLanding', value: "true" })
					params.push({ name: 'city', value: $('#city').val() })
					params.push({ name: 'postal_code', value: $('#postal_code').val() })
					params.push({ name: 'password', value: $('#password').val() })


					if ($('#country').length) {
						params.push({ name: 'ownership', value: $('#country').val() })
						params.push({ name: 'country', value: $('#country').val() })

					} else {
						params.push({ name: 'ownership', value: defaultOwnership })
						params.push({ name: 'country', value: defaultOwnership })
					}
					params.push({ name: 'language', value: document.getElementsByTagName('html')[0].getAttribute('lang') })

					retrieveParams(params);
					var pageType = $('#page-type').val();

					if (pageType === "noRegistration") {
						showThankYou(false);
					}

					$.ajax({
						type: "POST",
						url: blackWeekRegUrl,
						data: params,
						success: function(response) {
							if (response.userExist && pageType === "withRegistration") {
								showThankYou(true);
							} else if (!response.userExist && pageType === "withRegistration") {
								showThankYou(false);
							}
							else if (response.redirectLink) {
								window.location.href = response.redirectLink;
							}
						}
					})
				}
			} else {
				event.preventDefault();
				var cont = 0;
				$('#data-collection-form input.form-etrio__error, #data-collection-form select.form-etrio__error').each(function() {
					if ($(this).is(":visible") || !$(this).is("country")) {
						cont++;
					}
				});
				if (cont === 0) {
					var currentPath = location.href;
					if (location.href.indexOf('/content/illysite') == -1) {
						currentPath = location.href.replace('.com/', '.com/content/illysite/')
					}
					currentPath = currentPath.replace('.html', '');
					currentPath = currentPath.split('#')[0];
					currentPath = currentPath.split('?')[0];

					var blackWeekRegUrl = currentPath + '/.getContact.crmlanding.json?_' + Date.now();

					var params = $().serializeArray();

					params.push({ name: 'firstName', value: $('#firstName').val() });
					params.push({ name: 'lastName', value: $('#lastName').val() })
					params.push({ name: 'email', value: $('#email').val() })
					var parent = $('#phone').parent();
                    var phoneNumber = $(parent).find('.iti__selected-dial-code').text() + $('#phone').val();
                    params.push({name: 'phones', value: phoneNumber})
                    params.push({name: 'isLanding', value: "true"})
                    params.push({name: 'city', value: $('#city').val()})
                    params.push({name: 'postal_code', value: $('#postal_code').val()})
                    params.push({name: 'password', value: $('#password').val()})


					if ($('#country').length) {
						params.push({ name: 'ownership', value: $('#country').val() })
                        params.push({name: 'country', value: $('#country').val()})

					} else {
						params.push({ name: 'ownership', value: defaultOwnership })
                        params.push({name: 'country', value: defaultOwnership})
					}
					params.push({ name: 'language', value: document.getElementsByTagName('html')[0].getAttribute('lang') })

					retrieveParamsGateway(params);
					var pageType = $('#page-type').val();

					if (pageType === "noRegistration") {
						showThankYou(false);
					}

					$.ajax({
						type: "POST",
						url: blackWeekRegUrl,
						data: params,
						success: function(response) {
							if (response.userExist && pageType === "withRegistration") {
								showThankYou(true);
							} else if (!response.userExist && pageType === "withRegistration") {
								showThankYou(false);
							}
							else if (response.redirectLink) {
								window.location.href = response.redirectLink;
							}
						}
					})
				}

			}
		})

		function retrieveParams(params) {

			var privacyOptions = $().serializeArray();

			$('.optinCodes').each(function() {
				var option = $(this);
				var optinCode = $(option).attr('id');

				if (optinCode.indexOf(",")) {
					var splittedOptins = optinCode.split(",")
					$.each(splittedOptins, function(index, optinFieldValue) {
						if ($(option).is(":checked") || $(option).hasClass("textCheckBox")) {
							params.push({ name: optinFieldValue, value: 'true' });
						} else {
							params.push({ name: optinFieldValue, value: 'false' });
						}
					});
					$(this).remove();
				} else {

					if ($(option).is(":checked") || $(option).hasClass("textCheckBox")) {
						params.push({ name: optinCode, value: 'true' });
					} else {
						params.push({ name: optinCode, value: 'false' });
					}
				}
			})

			$('.customFields').each(function(index) {
				var field = $(this);
				var fieldCode = $(field).attr('id');
				var fieldValue = $(field).val();
				params.push({ name: "isCustomCode_" + index, value: fieldCode });
				params.push({ name: fieldCode, value: fieldValue });

			})

		}
				function retrieveParamsGateway(params) {

        			var privacyOptions = $().serializeArray();

        			$('.optinCodes').each(function() {
        				var option = $(this);
        				var optinCode = $(option).attr('id');
                        var optin_loyalty = "optin_loyalty";
        				if (optinCode.indexOf(",")) {
        					var splittedOptins = optinCode.split(",")
        					$.each(splittedOptins, function(index, optinFieldValue) {
        						if ($(option).is(":checked") || $(option).hasClass("textCheckBox")) {
        						    params.push({ name: optinFieldValue, value: 'true' });
        						} else {
        						    params.push({ name: optinFieldValue, value: 'false' });
        						}
        					});
        					$(this).remove();
        				} else {

        					if ($(option).is(":checked") || $(option).hasClass("textCheckBox")) {
        						params.push({ name: optinCode, value: 'true' });
        					} else {
        						params.push({ name: optinCode, value: 'false' });
        					}
        				}
        			})

        			$('.customFields').each(function(index) {
        				var field = $(this);
        				var fieldCode = $(field).attr('id');
        				var fieldValue = $(field).val();
        				params.push({ name: "isCustomCode_" + index, value: fieldCode });
        				params.push({ name: fieldCode, value: fieldValue });

        			})

        		}

		function getOwnershipByPageLanguage(lang) {

			var ownershipUrl = '/etc/designs/illysite/static/ownershipAndCountry.json';
			var ownershipAndCountries = null;
			$.ajax({
				type: "GET",
				url: ownershipUrl,
				async: false,
				success: function(data) {
					countries = data;
				},
				error: function() {
					console.log('call  ko')
				}
			});
			return countries[lang.substr(lang.length - 2)];
		}

		function createNationalitySelect() {
			var countriesUrl = '/etc/designs/illysite/static/allCountries.json';
			var ownershipAndCountriesUrl = '/etc/designs/illysite/static/ownershipAndCountry.json';
			var countries = null;
			var ownershipAndCountries = null;
			$.ajax({
				type: "GET",
				url: countriesUrl,
				async: false,
				success: function(data) {
					countries = data;
					$.ajax({
						type: "GET",
						url: ownershipAndCountriesUrl,
						async: false,
						success: function(data) {
							ownershipAndCountries = data;
							var countrySelect = $('select#country');
							for (var i = 0; i < countries.length; i++) {
								var value = ownershipAndCountries[countries[i].alpha2Code];
								if (value != undefined) {
									var option = '<option value="' + value + '">' + countries[i].name + '</option>';
									$(countrySelect).append(option);
								}
							}
						},
						error: function() {
							console.log('call  ko')
						}
					});
				},
				error: function() {
					console.log('call  ko')
				}
			});
		}
	});

	function showThankYou(userExist) {
		if (userExist) {
			var collectionForm = document.getElementsByClassName("dataCollectionForm-wrapper")[0];
			collectionForm.scrollIntoView({ block: "start" });
			window.scrollBy(0, -121);
			$('.dataCollectionForm-wrapper').find('.registered').removeClass('hide');
			$('.dataCollectionForm-wrapper').find('#data-collection-form').addClass('hide');
			setTimeout(() => {
				$('.dataCollectionForm-wrapper').find('.registered').addClass('height-components');
			}, 1);
			setTimeout(() => {
				$('.dataCollectionForm-wrapper').find('.registered').find('.content-registered').removeClass('hide');
			}, 500);
		} else {
			var collectionForm = document.getElementsByClassName("dataCollectionForm-wrapper")[0];
			collectionForm.scrollIntoView({ block: "start" });
			window.scrollBy(0, -121);
			$('.dataCollectionForm-wrapper').find('.thank-you-page.notRegistered').removeClass('hide');
			$('.dataCollectionForm-wrapper').find('#data-collection-form').addClass('hide');
			setTimeout(() => {
				$('.dataCollectionForm-wrapper').find('.thank-you-page.notRegistered').addClass('height-components');
			}, 1);
			setTimeout(() => {
				$('.dataCollectionForm-wrapper').find('.thank-you-page.notRegistered').find('.content-thank-you').removeClass('hide');
			}, 500);
		}
	}
}

