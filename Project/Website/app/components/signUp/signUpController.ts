import { User } from "models/User";
import * as _ from 'lodash';

export class SignUpController {
	public signUpRequest: User = new User();
	public hasError = false;
	public isSuccessFul = false;
	public successMsg = " ";
	public errorMsg = " ";
	public startErrorTimer;
	public startSuccessTimer;
	private requestOut: boolean = false;
	public isEmailIdValid = false;
	public EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

	static $inject = ['$mdDialog', '$timeout', 'userService'];
	constructor(private $mdDialog, private $timeout, private userService) {
  }

  private closeDialog() {
    this.$mdDialog.hide();
  }

  private signUp(signUpForm) {
	  if (signUpForm.$valid) {
		  this.onValidFormEntries();
	  } else {
		  this.touchFormFields(signUpForm);
	  }
  }

  private onValidFormEntries(){
	  this.isEmailIdValid = this.EMAIL_REGEXP.test(this.signUpRequest.userName);
	  if (this.signUpRequest.password1 != this.signUpRequest.password2) {
		  this.$timeout.cancel(this.startErrorTimer);
		  this.showErrorMsg("Passwords need to be same.");
	  } else if (!this.isEmailIdValid) {
		  this.$timeout.cancel(this.startErrorTimer);
		  this.showErrorMsg("Email id is not valid.");
	  }
	  else {
		  var payload = {
			  'UserName': this.signUpRequest.userName,
			  'Password': this.signUpRequest.password1,
			  'FirstName': this.signUpRequest.firstName
		  };
		  this.requestOut = true;
		  this.userService.signUp(payload)
			  .then(this.onSignUpSuccess.bind(this), this.onSignUpFailure.bind(this));
	  }
  }

  private onSignUpSuccess(successCb) {
	  if (successCb.data.status === "success") {
		  this.requestOut = false;
		  this.$timeout.cancel(this.startSuccessTimer);
		  this.$timeout.cancel(this.startErrorTimer);
		  this.showSuccessMsg(successCb.data.message);
	  }else {
		  this.requestOut = false;
		  this.$timeout.cancel(this.startSuccessTimer);
		  this.$timeout.cancel(this.startErrorTimer);
		  this.showErrorMsg(successCb.data.message);
	  }
  }

  private onSignUpFailure(failureCb) {
	  this.requestOut = false;
	  this.$timeout.cancel(this.startSuccessTimer);
	  this.$timeout.cancel(this.startErrorTimer);
	  this.showErrorMsg(failureCb.data.message); 
  }

  private showSuccessMsg(msg) {
	  this.isSuccessFul = true;
	  this.successMsg = msg;

	  this.startSuccessTimer = this.$timeout(() => {
		  this.successMsg = " ";
		  this.isSuccessFul = false;
		  this.$mdDialog.hide();
	  },5000);
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
}  