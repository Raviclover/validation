angular.module('validate',[]).directive('validate', function ($translate, regexService) {
    //TODO: Create checkbox logic for enroller/sponsor ids...
    //TODO: Create animation when continue button is clicked..

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var formcompletecheck = true;
            var StopExecution = true;
            /*--Window Blur logic---*/

            /* Note: In Chrome - if focused on an input and then you blur out of the browser ie: Click on a different application - two blurs get called
            the input blur and window.blur - the following logic addresses this use case. A check for windowBlur happens in showErr() method below... */

            var windowBlur = false;
            $(window).blur(function () { windowBlur = true; });
            $(window).focus(function () { windowBlur = false; });



            element.focus(function () {
                //on focus remove all visible error states/msgs
                element.closest('.control-group').removeClass('has-error');
                element.closest('.control-group').find(".has-error").remove();
                element.parent('.ds-field').removeClass('ds-field--has-error');
                element.parent('.ds-field').find(".has-error").remove();
                element.find('state-error').remove();
                element.removeClass('state-error');
                element.removeClass('state-success');
                element.find('state-success').remove();

            });

            /*---Cancel Validation Logic--*/
            var cancelBox = element.closest(".controls").find('.cancel-validation');
            cancelBox.click(function () {

                element.toggleClass('novalidate');

                if ($(this).is(":checked")) {
                    element.closest('.control-group').removeClass('has-error');
                    element.closest('.control-group').find(".has-error").remove();
                    element.closest('.control-group').hide();
                    scope.$apply(attrs.updateId);

                }
                else {

                    element.closest('.control-group').show();

                }

            });


            element.blur(function () {
                StopExecution = false;
                checkForm(element, 0);
            });

            element.keypress("keydown keypress", function (e) {

                if (!!element.attr('inputspace')) {

                    var altkeypress;
                    if (e.altKey) {
                        altkeypress = true;
                    }
                    else {
                        if (altkeypress) {
                            altkeypress = false;
                            return false;
                        }
                    }

                    if (e.which === 32 || e.which === 33 || e.which === 34 || e.which === 35 || e.which === 36 || e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40 || e.which === 41 || e.which === 42 || e.which === 43 || e.which === 44 || e.which === 46 || e.which === 47 || e.which === 45 || e.which === 58 || e.which === 59 || e.which === 60 || e.which === 61 || e.which === 62 || e.which === 63 || e.which === 64 || e.which === 91 || e.which === 93 || e.which === 92 || e.which === 94 || e.which === 95 || e.which === 96 || e.which === 123 || e.which === 124 || e.which === 125 || e.which === 126) {
                        return false;
                    }
                }
                if (!!element.attr('inputonlynumber')) {
                    if ((e.which >= 32 && e.which <= 47) || e.which === 58 || e.which === 59 || e.which === 60 || e.which === 61 || e.which === 62 || e.which === 63 || e.which === 64 || (e.which <= 122 && e.which >= 65) || e.which === 123 || e.which === 124 || e.which === 125 || e.which === 126) {
                        return false;
                    }
                }
                if (!!element.attr('inputmobilespacendash')) {
                    if (e.which === 33 || e.which === 34 || e.which === 35 || e.which === 36 || e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40 || e.which === 41 || e.which === 42 || e.which === 43 || e.which === 44 || e.which === 46 || e.which === 47 || e.which === 58 || e.which === 59 || e.which === 60 || e.which === 61 || e.which === 62 || e.which === 63 || e.which === 64 || e.which === 91 || e.which === 93 || e.which === 92 || e.which === 94 || e.which === 95 || e.which === 96 || e.which === 123 || e.which === 124 || e.which === 125 || e.which === 126) {
                        return false;
                    }
                }
                if (!!element.attr('inputspacehypens')) {
                    if (e.which === 32 || e.which === 45) {
                        return false;
                    }
                }
            });

            var checkForm = function (element, type) {
                var attr;
                var value = element.val();


                /*--attrs is not used because when the continue button is clicked attrs held the value of the button and not the element we passsed in - instead
                we check the old fashioned way with jQuery to see what validation needs to be done.--*/


                //not empty validation
                if (!!element.attr('noempty')) {
                    if ($.trim(value) === '') {
                        if (type === 0) {
                            showError('error_required_field', element);
                        }
                        else {
                            formcompletecheck = false;
                        }

                    }
                    else {
                        showSuccess(element);
                    }
                }

                if (!!element.attr('ValidName')) {
                    if (value.match(/[*^|\":<>[\]{}\\()';?/~!,]/)) {
                        if (type === 0) {
                            showError('error_special_char', element);
                        }
                        else {
                            formcompletecheck = false;
                        }
                    }
                    else {
                        showSuccess(element);
                    }
                }

                if (!!element.attr('phoneno')) {
                    if (!value.match(/^\d*$/)) {

                        if (type === 0) {
                            showError("error_only_numbers", element);
                        }
                        else {
                            formcompletecheck = false;
                        }

                    }
                }
                //min length validation
                if (!!element.attr('minlength')) {
                    attr = element.attr('minlength');
                    if (value) {
                        if (value.length < attr) {
                            if (type === 0) {
                                $(".ds-field--has-focus").addClass('ds-field--is-dirty');
                                showError("error_minimum_chars", element, attr);

                            }
                            else {
                                formcompletecheck = false;
                            }
                        }
                        else {
                            showSuccess(element);
                        }
                    }
                }

                //max length validation
                if (!!element.attr('validate-maxlength')) {
                    attr = element.attr('validate-maxlength');
                    if (value.length > attr) {
                        if (type === 0) {
                            var customErrorMessgae = element.attr("error-message");
                            if (customErrorMessgae) {
                                showError(customErrorMessgae, element, attr);
                            } else {
                                showError('error_maxlength_chars', element, attr);
                            }
                        }
                        else {
                            formcompletecheck = false;
                        }

                    }
                    else {
                        showSuccess(element);
                    }
                }
                //email validation
                if (!!element.attr('email')) {
                    if (value) {
                        validateEmail(value);
                    }
                }
                function validateEmail(value) {
                    var filter = new RegExp('^([\\w-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,10}|[0-9]{1,3})(\\]?)$');
                    if (filter.test(value)) {
                        showSuccess(element);
                    }
                    else {
                        if (type === 0) {
                            showError("error_valid_email", element);
                        }
                        else {
                            formcompletecheck = false;
                        }
                    }
                }

                if (!!element.attr('password-match')) {
                    var currentPw = $('#txtPassword').val();
                    if (element.val()) {
                        if (currentPw == element.val()) {
                            showSuccess(element);
                        } else {
                            if (type === 0) {
                                showError("password_not_match", element, attr);
                            }
                            else {
                                formcompletecheck = false;
                            }
                        }
                    }
                }
                //no spaces
                if (!!element.attr('nospaces')) {
                    if (value.match(/\s/g)) {
                        if (type === 0) {
                            showError('error_spaces_not_permitted', element);
                        }
                        else {
                            formcompletecheck = false;
                        }
                    }
                    else {
                        showSuccess(element);
                    }
                }
                //select validation
                if (!!element.attr('validate-select')) {
                    value = element.find('option:selected').text();

                    if (value.match(/Select a/) || value === "") {
                        if (type === 0) {
                            showError('error_make_selection', element);
                        }
                        else {
                            formcompletecheck = false;
                        }
                    }
                    else {
                        showSuccess(element);
                    }
                }
                //checkbox validation
                if (!!element.attr('checkbox-validate')) {

                    if (!element.is(":checked")) {
                        if (type === 0) {
                            showError('checkbox_required', element.parent());
                        }
                        else {
                            formcompletecheck = false;
                        }

                    }
                    else {
                        showSuccess(element);
                    }
                }
                //checkbox validation
                if (!!element.attr('checkbox-validate-autoship')) {

                    if (!element.is(":checked") && element.hasClass("ischeck")) {
                        if (type === 0) {
                            showError('autoship_required', element.parent());
                        }
                        else {
                            formcompletecheck = false;
                        }

                    }
                    else {
                        showSuccess(element);
                    }
                }

                //regex validation
                if (!!element.attr('regxvalid')) {
                    if (value) {
                        regexValidate(value, element.attr('regxvalidValue'));
                    }

                }
                function regexValidate(value, regxExp) {
                    var filter = new RegExp(regxExp);
                    if (filter.test(value)) {
                        showSuccess(element);
                    }
                    else {
                        if (type === 0) {
                            showError("INVALID_PASSWORD_FORMAT", element);
                        }
                        else {
                            formcompletecheck = false;
                        }
                    }
                }

                //regex validation
                if (!!element.attr('regxvalidzip')) {
                    if (value) {
                        regexValidateZip(value, element.attr('regexcountry').toUpperCase());
                    }
                }
                function regexValidateZip(value, countrycode) {
                    var regxExp = regexService.getRegex(countrycode);
                    var filter = new RegExp(regxExp);
                    if (filter.test(value)) {
                        showSuccess(element);
                    }
                    else {
                        if (type === 0) {
                            showError("INVALID ZIP", element);
                        }
                        else {
                            formcompletecheck = false;
                        }
                    }
                }
            };

            var showError = function (msg, element, value) {
                if (!element.hasClass('novalidate') && !windowBlur) {
                    if (element.closest('.control-group').find('span').hasClass('has-error')) {
                    }
                    else {
                        //create and display error message
                        element.removeClass('state-success');
                        element.addClass('state-error');
                        var container = $("<small />");

                        if (element.attr('custommsg')) {
                            msg = element.attr('custommsg');
                        }
                        else {
                            msg = msg;
                        }
                        msg = $translate(msg, { value: value });
                        container.text(msg).addClass('has-error help-block ng-scope').attr('translate', '');
                        element.parent(".ds-field").addClass('ds-field--has-error');
                        if (element.hasClass('ds-checkbox') || element.hasClass('ds-radio')) {
                            element.append(container);
                        } if (element.parent().hasClass('ds-field--has-error')) {
                            element.after(container);
                        }

                        element.closest(".control-group").addClass('has-error');
                    }
                }
            };
            var showSuccess = function (element) {
                if (!element.hasClass('novalidate') && !windowBlur) {
                    if (element.closest('.control-group').find('span').hasClass('has-error')) {
                    }
                    else {
                        //create and display error message 
                        element.removeClass('state-error');
                        element.addClass('state-success');
                    }
                }
            };

            if (attrs.triggerCheck) {
                element.click(function (ev) {
                    StopExecution = true;
                    ev.preventDefault();
                    //remove any visible errors
                    $('.control-group.has-error').removeClass('has-error');
                    $('.control-group').find(".has-error").remove();

                    scope.$apply(attrs.pvCheck);

                    //grab all inputs set for validation minus the button triggering the check
                    var inputs = $("[validate]").not("input[trigger-check]");

                    //loop through inputs and send them through checkForm
                    inputs.each(function (i, e) {
                        var element = $(e);
                        checkForm(element, 0);
                    });

                    var errors = $(".control-group.has-error");
                    if (errors.length === 0) {

                        scope.$apply(function () {

                            if (scope.account) {

                                $.each(scope.account, function (i) {

                                    scope.order.profile[i] = scope.account[i];
                                    scope.order.payment[i] = scope.order.payment[i];
                                });
                            }

                            if (scope.payment) {

                                $.each(scope.payment, function (i) {
                                    scope.order.payment[i] = scope.payment[i];
                                });

                                $.each(scope.shipping, function (i) {
                                    scope.order.shipping[i] = scope.shipping[i];
                                });
                            }

                            if (scope.signature) {
                                scope.order.signature = scope.signature;
                            }

                        });

                        scope.$apply(attrs.success);
                    } else {
                        var target = $(".control-group.has-error")[0];
                        $('html, body').animate({
                            scrollTop: $(target).offset().top - 100
                        }, 1000); //animate scroll to first error
                    }
                });
            }
        }
    };
});