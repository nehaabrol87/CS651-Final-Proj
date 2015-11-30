import * as _ from 'lodash';

export class UpdateProfileController {

	public hasError = false;
	public errorMsg = " ";
	public startTimer;
	public maxDate = new Date();
	public minDate: Date;

	public updateProfileRequest = {
		'weight' : "",
		'height_in' : "",
		'height_ft' : "",
		'gender' : "male",
		'dob' : ""
	}

	static $inject = ['$mdDialog', '$timeout', '$http', 'successErrorService', '$rootScope'];

	constructor(private $mdDialog, private $timeout, private $http, private successErrorService, private $rootScope) {
		this.minDate = new Date(
      this.maxDate.getFullYear()-100,
      this.maxDate.getMonth()+1,
      this.maxDate.getDay()
		);
	}
	private closeDialog() {
		this.$mdDialog.hide();
	}

	private submit(updateProfileForm) {
		if (updateProfileForm.$valid) {
			console.log(this.updateProfileRequest);
		} else {
			this.touchFormFields(updateProfileForm);
		}
	}

	private showErrorMsg(msg) {
		this.hasError = true;
		this.errorMsg = msg;

		this.startTimer = this.$timeout(() => {
			this.errorMsg = " ";
			this.hasError = false;
		}, 5000);
	}

	private touchFormFields(signUpForm) {
		var fields = this.getFormFields(signUpForm);

		_.each(fields, function(field) {
			if (field.$setTouched) {
				field.$setTouched(true);
			}
		});
	}

	private getFormFields(signUpForm) {
		var fields = [];
		_.each(signUpForm, function(value, key) {
			var firstLetter = key.slice(0, 1);
			if (firstLetter !== '$') {
				fields.push(value);
			}
		});
		return fields;
	}
}