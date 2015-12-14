import { User } from "../../models/User";
import * as _ from 'lodash';

class UpdateProfileController {

	public updateProfileRequest: User = new User();
	public hasError = false;
	public userEnteredDob: Date;
	public isSuccessFul = false;
	public successMsg = " "; 
	public errorMsg = " ";
	public startErrorTimer;
	public startSuccessTimer;
	public maxDate = new Date();
	public minDate: Date;
	public requestOut = false;
	public disableButton = false;
	public dob: string;
	public userDetails : User = new User();

	static $inject = ['$mdDialog', '$timeout', '$http', '$state', 'localStorageService','userService'];

	constructor(private $mdDialog, private $timeout, private $http, private $state, private localStorageService ,private userService) {
		this.minDate = new Date(
			this.maxDate.getFullYear() - 100,
			this.maxDate.getMonth() + 1,
			this.maxDate.getDay()
		);
		this.userDetails = this.localStorageService.get('userDetails');
	}
	private closeDialog() {
		this.$mdDialog.hide();
	}

	private goToHome() {
		this.$state.go('home');
	}

	private updateProfile(updateProfileForm) {
		if (updateProfileForm.$valid) {
			this.dob = this.getServerFormattedDate(this.userEnteredDob);
			var payload = {
				'Dob': this.dob,
				'Gender': this.updateProfileRequest.gender,
				'Height_ft': this.updateProfileRequest.height_ft,
				'Height_in': this.updateProfileRequest.height_in,
				'Weight': this.updateProfileRequest.weight,
				'UserName' : this.userDetails.userName,
				'PersonType': this.updateProfileRequest.personType
			};
			this.requestOut = true;
			this.disableButton = true;
			this.userService.updateProfile(payload)
				.then(this.onUpdateProfileSuccess.bind(this), this.onUpdateProfileFailure.bind(this));
		} else {
			this.touchFormFields(updateProfileForm);
		}
	}

	private onUpdateProfileSuccess(successCb){
		if (successCb.data.status == "success") {
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showSuccessMsg(successCb.data.message);
			this.userDetails = this.localStorageService.get('userDetails');
			this.userDetails.personalData = 'Y';
			this.userDetails.dob = this.dob;
			this.userDetails.gender = this.updateProfileRequest.gender;
			this.userDetails.height_in = this.updateProfileRequest.height_in;
			this.userDetails.height_ft = this.updateProfileRequest.height_ft;
			this.userDetails.weight = this.updateProfileRequest.weight;
			this.userDetails.personType = this.updateProfileRequest.personType;
			this.localStorageService.set('userDetails',this.userDetails);
			this.$state.go('profile');
			this.requestOut = false;
		} else {
			this.requestOut = false;
			this.disableButton = false;
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showErrorMsg(successCb.data.message);
		}
	}

	private onUpdateProfileFailure(failureCb){
		this.requestOut = false;
		this.disableButton = false;
		this.$timeout.cancel(this.startSuccessTimer);
		this.$timeout.cancel(this.startErrorTimer);
		this.showErrorMsg(failureCb.data.message);
	}

	private getServerFormattedDate(date) {
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