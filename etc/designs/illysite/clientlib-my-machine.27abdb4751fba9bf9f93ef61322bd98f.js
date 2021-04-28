var redirectUrl = $("#redirectUrl").val();
if($('.machine-registration-wrapper').length){
      // Mock machine registaration

      // variables declaration and init:
      var parent = '.machine-registration-wrapper';
      var parents = '.machine-registration-wrapper .step-1';
      var parents2 = '.machine-registration-wrapper .machine-registration-step2-wrapper';
      var searchButton = $(parents).find('.find-code-button');
      var continueButton = $(parents).find('.continue-button');
      var inputText = $(parents).find('#insert-machine-code');
      var progressBar = $(parent).find('.progress-registration');
      var progressStatus1 = $(progressBar).find('li:nth-child(1)');
      var progressStatus2 = $(progressBar).find('li:nth-child(2)');
      var imgMachine = $(parents).find('.container-img').find('img');
      var serialNumberExamplePath = $(imgMachine).attr('src');
      var imgCamera = $(parents).find('.container-icon-machine-code img');
      var cameraMobilePath = $('.container-icon-machine-code img').data('cameramobileimage');
      imgCamera.attr('src', cameraMobilePath);
      var imgMachine2 = $('#machine-image');
      var backStep1 = $(parents2).find('.deepLink');
      var scroll;
      var barcodeScanner = null;
      var retryMsg = $(parents).find('.confirm-message-under-input-code');
      var retry = $(parents).find('.confirm-message-under-input-code').find('button');
      var params = $().serializeArray();
      var paramsApiGateway = $().serializeArray();
      var defaultOwnership=getOwnershipByPageLanguage(document.getElementsByName('language_country')[0].content);

      var dateMachine = $(parents2).find('#date-machine');
      var selectStore = $(parents2).find('#company-machine');
      var selectOther = $(parents2).find('#location-purchase');
      var confirmFormMyMachine = $(parents2).find('.confirm-form-my-machine');
      var fileuploadMachine = $(parents2).find('#file-upload-machine');
      var base64File;
      var currentPath = location.href.replace(".com/", ".com/content/illysite/").replace('.html','').replace('#','').replace("?wcmmode=disabled","");
      var gatewayIsEnabled = $("#there-is-adult-control").attr("data-gateway");

      //Function on inputText change
      inputText.keyup(function () {
        imgMachine.removeClass("placeholder-machine");
        continueButton.prop("disabled", true);//disable button continue
        //remove all loaded classes from any html's components
        $(parents).find('.wrong-code-error').addClass("hide");
        $(parents).find('.code-already-present-error').addClass("hide");
        $(parents).find('.code-not-in-list').addClass("hide");
        inputText.removeClass('form-etrio__error');//remove class error to form
        $(parents).find('.container-img').removeClass('loaded');
        $(parents).find('.machine-name-title').removeClass('loaded');
        $(parents).find('.machine-name-title-mobile').removeClass('loaded');
        $(parents).find('.machine-name').removeClass('loaded');
        $(parents).find('#to-pull').removeClass('loaded');
        $(parents).find('#to-push').removeClass('loaded');
        //Change machine img with placeholder img
        imgMachine.attr('src', serialNumberExamplePath);
        imgCamera.attr('src', cameraMobilePath);
        retryMsg.addClass("hide");
        $(parents).find('.container-icon-machine-code img').removeClass('correct-barcode');
        if ($(window).width() > 1023) {
          $(parents).find('.container-icon-machine-code img').css("display", "none");
        }
        $(parents).find('.wrong-code-error').addClass("hide");
        invertColumn();//call function invertColumn
        isValidCode();
      });

      //Function on inputText copy and paste code
      inputText.on("paste", function () {
        setTimeout(() => {
            isValidCode();
            inputText.blur();
        }, 300);
      });


      //Function on searchButton Click
      searchButton.on("click", function (e) {
        e.preventDefault();
        if (inputText.hasClass('form-etrio__valid')) {// if form valid
          searchButton.prop("disabled", true);// disable searchButton

          var basePath = document.querySelector('meta[name="basePath"]').content;

        if (gatewayIsEnabled == "false" || gatewayIsEnabled == undefined) {
          var registerUrl = currentPath + '/.myMachineRegistration.json';
          addParam('operation', "retrieveImage");
          addParam('serialNumber', inputText.val());
          addParam('countryLanguage', $('meta[name=language_country]').attr("content"));
          $.ajax({
              type: 'POST',
              url: registerUrl,
              data: params,
              async: false,
              success: function (data, status, xhr) { // if request returns no error
                    if(data.imageLink == undefined || data.imageLink == ''){
                        data.imageLink = $('#to-push').data('placeholder-image');
                        imgMachine.addClass("placeholder-machine");
                    }
                    //REFACTOR

                    if(redirectUrl != "") {
                        if($('#to-push').data('placeholder-image') != data.imageLink){
                        	localStorage['machineImageUrl'] = data.imageLink;
                        }
                        localStorage['redirectUrl'] = redirectUrl;
                    }
                    //END OF REFACTOR
                    if(data.machineName != undefined && data.machineName != ""){
                        $('.machine-name').text(data.machineName);
                        $('.name-machine-step2').text(data.machineName);
                    }
                    addParam('imageLink', data.imageLink);
                    addParam('assetStatus', data.assetStatus);
                    addParam('assetId', data.assetId);
                    addParam('email', data.email);
                    addParam('firstName', data.firstName);
                    addParam('lastName', data.lastName);
                    addParam('contactId', data.contactId);
                    addParam('warranty', data.warranty);
                    addParam('productCode', data.productCode);
                    addParam('ownership', defaultOwnership);
                    if(data.assetStatus == "Active"){
                        imgMachine.attr('src', data.imageLink);//change placeholder image with machine image
                        $(parents).find('.code-already-present-error').removeClass("hide");//show error message
                        inputText.addClass('form-etrio__error');
                        $(parents).find('.container-img').addClass('loaded');
                        $(parents).find('.machine-name-title').addClass('loaded');
                        $(parents).find('.machine-name-title-mobile').addClass('loaded');
                        $(parents).find('.machine-name').addClass('loaded');
                        $(parents).find('#to-pull').addClass('loaded');
                        $(parents).find('#to-push').addClass('loaded');
                        invertColumn();
                    } else if(data.inList == "false"){
                        $(parents).find('.code-not-in-list').removeClass("hide");//show error message
                        inputText.addClass('form-etrio__error');
                    } else{
                        imgMachine.attr('src', data.imageLink);//change placeholder image with machine image
                        imgMachine2.attr('src', data.imageLink);
                        //added all loaded class for all html elements that need it.
                        $(parents).find('.container-img').addClass('loaded');
                        $(parents).find('.machine-name-title').addClass('loaded');
                        $(parents).find('.machine-name-title-mobile').addClass('loaded');
                        $(parents).find('.machine-name').addClass('loaded');
                        $(parents).find('#to-pull').addClass('loaded');
                        $(parents).find('#to-push').addClass('loaded');
                        invertColumn(); //call the invertColumn for the style
                        continueButton.prop("disabled", false);//enable continue button

                        $(parents).find('.container-icon-machine-code img').attr('src', $('.container-icon-machine-code').data('serialcheckedimage'));
                        retryMsg.removeClass("hide");
                        $(parents).find('.container-icon-machine-code img').addClass('correct-barcode');
                        $(parents).find('.container-icon-machine-code img').css("display", "block");
                    }
              },
              error: function (xhr, ajaxOptions, thrownError) { //if request returns error
                    $(parents).find('.wrong-code-error').removeClass("hide");//show error message
                    inputText.addClass('form-etrio__error');//add class error to form
              }
          });
          } else {
              var registerUrlApiGateway = currentPath + '/.getMyMachine.json';
              addParamApiGateway('operation', "retrieveImage");
              addParamApiGateway('serialNumber', inputText.val());
              addParamApiGateway('countryLanguage', $('meta[name=language_country]').attr("content"));
              $.ajax({
                   type: 'POST',
            	   url: registerUrlApiGateway,
            	   data: paramsApiGateway,
            	   async: false,
            	   success: function(data, status, xhr) { // if request returns no error
            			 if (data.imageLink == undefined || data.imageLink == '') {
            				data.imageLink = $('#to-push').data('placeholder-image');
            				imgMachine.addClass("placeholder-machine");
            			 }
            			 //REFACTOR
            			 if (redirectUrl != "") {
            				if ($('#to-push').data('placeholder-image') != data.imageLink) {
            					localStorage['machineImageUrl'] = data.imageLink;
            				}
            			localStorage['redirectUrl'] = redirectUrl;
            			 }
            			//END OF REFACTOR
            			if (data.machineName != undefined && data.machineName != "") {
            	     		$('.machine-name').text(data.machineName);
            				$('.name-machine-step2').text(data.machineName);
            			}
            			addParamApiGateway('imageLink', data.imageLink);
            			addParamApiGateway('assetStatus', data.assetStatus);
            			addParamApiGateway('assetId', data.assetId);
            			addParamApiGateway('email', data.email);
            			addParamApiGateway('firstName', data.firstName);
            			addParamApiGateway('lastName', data.lastName);
            			addParamApiGateway('contactId', data.contactId);
            			addParamApiGateway('warranty', data.warranty);
            			addParamApiGateway('productCode', data.productCode);
            			addParamApiGateway('ownership', defaultOwnership);
            			addParamApiGateway('sso', data.sso);

            			if (data.assetStatus == "Active") {
            				imgMachine.attr('src', data.imageLink);//change placeholder image with machine image
            				$(parents).find('.code-already-present-error').removeClass("hide");//show error message
            				inputText.addClass('form-etrio__error');
            				$(parents).find('.container-img').addClass('loaded');
            				$(parents).find('.machine-name-title').addClass('loaded');
            				$(parents).find('.machine-name-title-mobile').addClass('loaded');
            				$(parents).find('.machine-name').addClass('loaded');
            		    	$(parents).find('#to-pull').addClass('loaded');
            				$(parents).find('#to-push').addClass('loaded');
            				invertColumn();
            			} else if (data.inList == "false") {
            				$(parents).find('.code-not-in-list').removeClass("hide");//show error message
            				inputText.addClass('form-etrio__error');
            			} else {
            			     imgMachine.attr('src', data.imageLink);//change placeholder image with machine image
            				 imgMachine2.attr('src', data.imageLink);
            				//added all loaded class for all html elements that need it.
            				 $(parents).find('.container-img').addClass('loaded');
            				 $(parents).find('.machine-name-title').addClass('loaded');
            				 $(parents).find('.machine-name-title-mobile').addClass('loaded');
            				 $(parents).find('.machine-name').addClass('loaded');
            				 $(parents).find('#to-pull').addClass('loaded');
            				 $(parents).find('#to-push').addClass('loaded');
            				 invertColumn(); //call the invertColumn for the style
            				 continueButton.prop("disabled", false);//enable continue button

        					 $(parents).find('.container-icon-machine-code img').attr('src', $('.container-icon-machine-code').data('serialcheckedimage'));
            				 retryMsg.removeClass("hide");
            				 $(parents).find('.container-icon-machine-code img').addClass('correct-barcode');
            				 $(parents).find('.container-icon-machine-code img').css("display", "block");
            			}
            	   },
            	   error: function(xhr, ajaxOptions, thrownError) { //if request returns error
            			$(parents).find('.wrong-code-error').removeClass("hide");//show error message
            			inputText.addClass('form-etrio__error');//add class error to form
            	   }
          	  });
            }
          }
      });

      function addParamApiGateway(paramName, paramValue) {
      		var found = false;
      		$.each(paramsApiGateway, function(key, data) {
      			if (this.name == paramName) {
      				this.value = paramValue;
      				found = true;
      			}
      		});
      		if (!found)
      			paramsApiGateway.push({ name: paramName, value: paramValue });
      	}


      function addParam(paramName, paramValue){
        var found = false;
        $.each(params, function(key, data){
          if (this.name == paramName){
              this.value=paramValue;
              found = true;
          }
        });
        if(!found)
          params.push({name: paramName, value: paramValue});
      }

      $('#registration-machine').on('submit', function(event) {
          event.preventDefault();
          event.stopPropagation();
          $('.overlay-registration').css("display", "block");
          setTimeout(function () {
              var cont = 0;
              $('#registration-machine').find('.form-etrio__error').each(function () {
                  if ($(this).is(":visible")) {
                      cont++;
                  }
              });
              if (cont === 0) {
                  if (gatewayIsEnabled == "false" || gatewayIsEnabled == undefined) {
                  var basePath = document.querySelector('meta[name="basePath"]').content;
                  var registerUrl = currentPath + '/.myMachineRegistration.json';
                  retrieveParams();
                  $.ajax({
                      type: 'POST',
                      url: registerUrl,
                      data: params,
                      async: true,
                  });
                  setTimeout(function() {
                      $('.overlay-registration').css("display", "none");
                      location.href = redirectUrl;
                	}, 300)
              } else {
                   var basePath = document.querySelector('meta[name="basePath"]').content;
                   var registerUrlApiGateway = currentPath + '/.getMyMachine.json';
                   retrieveParamsApiGateway();
                   $.ajax({
                		type: 'POST',
                		url: registerUrlApiGateway,
                		data: paramsApiGateway,
                		async: true,
                   });
                   setTimeout(function() {
                   $('.overlay-registration').css("display", "none");
                	location.href = redirectUrl;
                	}, 300)

                }
              } else {
                   $('.overlay-registration').css("display", "none");
              }

          }, 200);
      });


	       function retrieveParamsApiGateway() {
		      var storeSelected = selectStore.val();
		      var storeSelectedOther = selectOther.val();
		      $.each(paramsApiGateway, function(key, data) {
			      if (this.name == "operation")
				  this.value = "submit";
		      });
		      addParamApiGateway('storeSelected', storeSelected);
		      addParamApiGateway('storeSelectedOther', storeSelectedOther);
		      addParamApiGateway('dateSelected', dateMachine.val());

		      if ($('.filename-download').text() != "" && $('.filename-download').text() != undefined) {
			     addParamApiGateway('fileName', $('.filename-download').text());
			     addParamApiGateway('file', base64File.replace(/^data:.+;base64,/, ''));
		      }

	       }

          function retrieveParams(){
              //encodeBase64File();
              //encodeBase64File();
              var storeSelected = selectStore.val();
              var storeSelectedOther = selectOther.val();

              $.each(params, function(key, data){
                  if (this.name == "operation")
                      this.value="submit";
              });
              addParam('storeSelected', storeSelected);
              addParam('storeSelectedOther', storeSelectedOther);
              addParam('dateSelected', dateMachine.val());
              if($('.filename-download').text() != "" && $('.filename-download').text() != undefined){
                addParam('fileName', $('.filename-download').text());
                addParam('file', base64File.replace(/^data:.+;base64,/, ''));
              }
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


        class ReadFiles {
          constructor() {}
          async addImage(event) {
            const newArr = [];
            for (let i = 0; i < event.target.files.length; i++) {
                base64File = await this.getBase64(event.target.files[i])
            }
            const o = {
              files: newArr
            };
            console.log(o);
          }

          getBase64(file) {
            return new Promise(function(resolve) {
              var reader = new FileReader();
              reader.onloadend = function() {
                resolve(reader.result)
              }
              reader.readAsDataURL(file);
            })
          }

        }

    let reader = new ReadFiles();



       /* const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });*/

      retry.on("click", function () {
        $(parents).find('.container-icon-machine-code img').attr('src', $('.container-icon-machine-code img').data('cameramobileimage'));
        $(parents).find('.container-icon-machine-code img').removeClass('correct-barcode')
        inputText.val('');
        retryMsg.addClass("hide");
        imgMachine.attr('src', $('#to-push').data('serial-number')); //Change machine img with placeholder img
        //remove all loaded classes from any html's components
        $(parents).find('.container-img').removeClass('loaded');
        $(parents).find('.machine-name-title').removeClass('loaded');
        $(parents).find('.machine-name-title-mobile').removeClass('loaded');
        $(parents).find('.machine-name').removeClass('loaded');
        $(parents).find('#to-pull').removeClass('loaded');
        $(parents).find('#to-push').removeClass('loaded');
        continueButton.prop("disabled", true); //disable button continue
        invertColumn();
      });

      //Function on continueButton Click
      continueButton.on("click", function (e) {
        e.preventDefault();
        if (window.receiptRequired) {
            $(parents2).find('.optional-required').removeClass('hide');
        } else {
            $(parents2).find('.optional-required').addClass('hide');
        }
        //function to pass from step1 to step2(just style)
        progressStatus1.addClass('step-disabled');
        progressStatus1.find('.indicator').html('✓');
        progressStatus2.removeClass('step-disabled');
        $(parents).addClass('transition-step-1');
        setTimeout(function () {
          $(parents).addClass('hide-step-1');
          $(parent).find('.step-2').find('.machine-registration-step2-wrapper').removeClass('hide-step-2');
        }, 500);
        $(parent).find('.step-2').find('.machine-registration-step2-wrapper').removeClass('hide');
        $(parent).find('.step-2').css("display", "block");
        validationStep2();
        if (imgMachine.hasClass('placeholder-machine')) {
          $(parents2).find('.image-machine-step2').find('img').addClass('placeholder-machine');
        } else {
          $(parents2).find('.image-machine-step2').find('img').removeClass('placeholder-machine');
        }
      });

      //Function on backButton Click
      backStep1.on("click", function (e) {
        e.preventDefault();
        //function to pass from step1 to step2(just style)
        progressStatus1.removeClass('step-disabled');
        progressStatus1.find('.indicator').html('1');
        progressStatus2.addClass('step-disabled');
        $(parent).find('.step-2').find('.machine-registration-step2-wrapper').addClass('hide-step-2');
        setTimeout(function () {
          $(parents).removeClass('hide-step-1');
          setTimeout(function () {
            $(parents).removeClass('transition-step-1');
            $(parent).find('.step-2').find('.machine-registration-step2-wrapper').addClass('hide');
          }, 100);
        }, 500);
      });


      $(document).ready(function () {
        invertColumn();
      });

      $(window).resize(function () {
        invertColumn();
      });

        function isValidCode() {
            setTimeout(function () {
                if (inputText.val().length > 13 && inputText.val().length < 18 && ($('#insert-machine-code-error').is(':hidden') || $('#insert-machine-code-error').length < 1)) { //if form has no error enable searchButton
                    searchButton.prop("disabled", false);
                } else {
                    searchButton.prop("disabled", true);
                }
            }, 300);
        }

      function invertColumn() {//Function to call on resize, on load, on input change and on search button click. (This function is used just for the style)
        if ($(window).width() < 768 && $('.machine-registration-wrapper').find('#to-push').hasClass('loaded')) {//if under tablet viewPort
          $('.machine-registration-wrapper').find('#to-push').addClass('small-push-6');//Add this class to switch col position with pull
          $('.machine-registration-wrapper').find('#to-push').removeClass('small-12');//if upload code you have to remove old col size and add
          $('.machine-registration-wrapper').find('#to-push').addClass('small-6');// this new col size
          $('.machine-registration-wrapper').find('#to-pull').addClass('small-pull-6');//Add this class to switch col position with push
          $('.machine-registration-wrapper').find('#to-pull').css('height', $('.machine-registration-wrapper').find('#to-push').outerHeight());// i need to have the same height of other column
        } else {// if not reset param
          $('.machine-registration-wrapper').find('#to-push').removeClass('small-push-6');
          $('.machine-registration-wrapper').find('#to-pull').removeClass('small-pull-6');
          $('.machine-registration-wrapper').find('#to-push').addClass('small-12');
          $('.machine-registration-wrapper').find('#to-pull').css('height', "auto");
        }
        if ($(window).width() > 1023) {
          $(parents).find('.container-icon-machine-code span').html('');
          if (!$(parents).find('.container-icon-machine-code img').hasClass('correct-barcode')) {
            $(parents).find('.container-icon-machine-code img').css("display", "none");
          }
        } else {
          $(parents).find('.container-icon-machine-code span').html('|');
          $(parents).find('.container-icon-machine-code img').css("display", "block");
        }
      }

      // Initializate scanning librery
      $(parents).find('.container-icon-machine-code img').on("click", function (e) {
        e.preventDefault();
        imgMachine.removeClass("placeholder-machine");
        if ($(window).width() < 1024) {
          if (!$(parents).find('.container-icon-machine-code img').hasClass('correct-barcode')) {
            $('#scanner-video-container').removeClass('hide');
            $('body').css("overflow", "hidden");
            scroll = $(window).scrollTop(); // save old position
            $(window).scrollTop(0);
            Dynamsoft.BarcodeScanner.createInstance({
              UIElement: document.getElementById('scanner-video-container'),
              onUnduplicatedRead: (txt) => {
                document.getElementById('insert-machine-code').value = txt;
                barcodeScanner.onUnduplicatedRead = undefined;
                // Hide the scanner if you only need to read these three barcodes
                barcodeScanner.stop();
                barcodeScanner.hide();
                $('#scanner-video-container').addClass('hide');
                $('body').css("overflow", "auto");
                $(window).scrollTop(scroll);
                $('input').blur();
                isValidCode();
              }
            }).then(scanner => {
              barcodeScanner = scanner;
              barcodeScanner.show();
            });
          }
        }
      });

      //close bar-code scanning
      $(parents).find('.scanner-video-container').find('.close-scanner').on("click", function (e) {
        barcodeScanner.stop();
        barcodeScanner.hide();
        $('#scanner-video-container').addClass('hide');
        $('body').css("overflow", "auto");
        $(window).scrollTop(scroll);
      });



      // Step 2    --------------------------------------

    if ($(parents2).length) {
      validationStep2();
      document.querySelector("#file-upload-machine").addEventListener('change', function (e) {
        e.preventDefault();

        // First disabled failure, success containers and button submit
        $('.failure-operation-machine-step2').css('display', 'none');
        $('.success-operation-machine-step2').css('display', 'none');

        // File selected by user
        var all_files = this.files;
        var file = all_files[0];

        // Files types allowed
        // we are reading text file in this example
        var allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (allowed_types.indexOf(file.type) == -1) {
          $('.failure-operation-machine-step2').css('display', 'block');
          return;
        }

        // Max 7 MB allowed
        var max_size_allowed = 7 * 1024 * 1024;
        if (file.size > max_size_allowed) {
          $('.failure-operation-machine-step2').css('display', 'block');
          return;
        }

        // File validation is successful
        // we will now read the file
        reader.addImage.call(reader, e)
        var fileName = file.name;
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toUpperCase();
        var filesize = file.size;
        var sizeFile = (filesize / 1048576).toFixed(2) + ' MB';

        // Pass file name, file type, file size value
        $('.filename-download').append(fileName);
        $('.filetype-download').append(extFile);
        $('.filesize-download').append(sizeFile);

        // Switch red-btn to grey-btn and viceversa
        $('.file-upload-illy-button').addClass('disabled-button');

        // Enabled Submit button and disabled Carica input
        fileuploadMachine.prop('disabled', true);

        // Display the success container block
        $('.success-operation-machine-step2').css('display', 'block');
        validationStep2();
      });

      $('#cancel-upload-machine').on('click', function (e) {
        e.preventDefault();
        var emptyValue = '';
        // Reset value file selected
        $('#file-upload-machine').val('');

        // Reset file name, file type, file size value
        $('.filename-download').html(emptyValue);
        $('.filetype-download').html(emptyValue);
        $('.filesize-download').html(emptyValue);

        // Remove the success and failure containers
        $('.failure-operation-machine-step2').css('display', 'none');
        $('.success-operation-machine-step2').css('display', 'none');

        // Switch red-btn to grey-btn and viceversa
        $('.file-upload-illy-button').removeClass('disabled-button')

        // Enabled Carica input and disabled Submit button
        if (window.receiptRequired) {
           confirmFormMyMachine.prop('disabled', true);
        }
        fileuploadMachine.prop('disabled', false);
      })
      
      dateMachine.on('click', function () {
        validationStep2();
      });
      dateMachine.change(function () {
        validationStep2();
      });
      selectStore.on('click', function () {
        validationStep2();
      });
      selectOther.on('click', function () {
        validationStep2();
      });
      selectOther.keyup(function () {
        validationStep2();
      });

      function validationStep2() {
        var formIsvalid = false;
        if (((selectStore.val() == '' || selectStore.val() == null)
          || (dateMachine.val() == '' || dateMachine.val() == null) || dateMachine.hasClass('form-etrio__error')) && $('.failure-operation-machine-step2').is(":hidden")) {
          confirmFormMyMachine.prop('disabled', true);
          formIsvalid = false;
        } else {
            if (window.receiptRequired) {
              confirmFormMyMachine.prop('disabled', true);
              if ($('.file-upload-illy-button').hasClass('disabled-button')) {
                confirmFormMyMachine.prop('disabled', false);
                formIsvalid = true;
              }
            }else {
                confirmFormMyMachine.prop('disabled', false);
                formIsvalid = true;
            }
        }

        // Sulla validation della registrazione, prevedere la scleta di "Altro" ed procedere alla validation del campo <selectOther>
        if (selectOther.is(":visible")) {
          if (selectOther.val().length > 0 && formIsvalid) {
            confirmFormMyMachine.prop('disabled', false);
          } else {
            confirmFormMyMachine.prop('disabled', true);
          }
        }
      }
    }
}