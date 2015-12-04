import * as _ from 'lodash';

class UpdateProfileController {

	public hasError = false;
	public isSuccessFul = false;
	public successMsg = " "; 
	public errorMsg = " ";
	public startErrorTimer;
	public startSuccessTimer;
	public maxDate = new Date();
	public minDate: Date;
	public requestOut = false;
	public userName;
	public dob: Date;

	public updateProfileRequest = {
		'weight' : "",
		'height_in' : "",
		'height_ft' : "",
		'gender' : "M",
		'dob' : ""
	}

	static $inject = ['$mdDialog', '$timeout', '$http', 'successErrorService', '$state', 'localStorageService'];

	constructor(private $mdDialog, private $timeout, private $http, private successErrorService, private $state, private localStorageService) {
		this.minDate = new Date(
      this.maxDate.getFullYear()-100,
      this.maxDate.getMonth()+1,
      this.maxDate.getDay()
		);
	}
	private closeDialog() {
		this.$mdDialog.hide();
	}

	private goToHome() {
		this.$state.go('home');
	}

	private submit(updateProfileForm) {
		if (updateProfileForm.$valid) {
			this.dob = this.updateProfileRequest.dob;
			var payload = {
				'Dob': this.getServerFormattedDate(this.dob),
				'Gender': this.updateProfileRequest.gender,
				'Height_ft': this.updateProfileRequest.height_ft,
				'Height_in': this.updateProfileRequest.height_in,
				'Weight': this.updateProfileRequest.weight,
				'UserName' : this.userName
			};
			this.requestOut = true;
			this.$http.post('http://localhost/finalservice/Service.svc/updateProfile', payload).then((res) => {
				if (res.data.status == "success") {
					this.requestOut = false;
					this.$timeout.cancel(this.startSuccessTimer);
					this.$timeout.cancel(this.startErrorTimer);
					this.showSuccessMsg(res.data.message);
					this.localStorageService.set('personalData', 'Y');
				} else {
					this.requestOut = false;
					this.$timeout.cancel(this.startSuccessTimer);
					this.$timeout.cancel(this.startErrorTimer);
					this.showErrorMsg(res.data.message);
				}
			});
		} else {
			this.touchFormFields(updateProfileForm);
		}
	}

	private getServerFormattedDate(date: Date) {
		return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
	}

	private showSuccessMsg(msg) {
		this.isSuccessFul = true;
		this.successMsg = msg;

		this.startSuccessTimer = this.$timeout(() => {
			this.successMsg = " ";
			this.isSuccessFul = false;
			this.$state.transitionTo(this.$state.current, this.$state.$current.params, { reload: true, inherit: true, notify: true });
		}, 5000);
	}

	private showErrorMsg(msg) {
		this.hasError = true;
		this.errorMsg = msg;

		this.startErrorTimer = this.$timeout(() => {
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

	public logout() {
		this.localStorageService.clearAll();
		this.$state.go('home');
	}
}

export default UpdateProfileController;