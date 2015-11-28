import { SignUpRequest } from "models/SignUpRequest";
import * as _ from 'lodash';

export class SignUpController {
	public signUpRequest: SignUpRequest = new SignUpRequest();
	public hasError = false;
	public errorMsg = " ";
	private requestOut: boolean = false;
	public startTimer;


	static $inject = ['$window', '$mdDialog', '$timeout', '$http', 'successErrorService','$rootScope'];
	constructor(private $window, private $mdDialog, private $timeout, private $http, private successErrorService ,private $rootScope) {
    }

  private closeDialog() {
    this.$mdDialog.hide();
  }

  private submit(signUpForm) {
	  if (signUpForm.$valid) {
		if (this.signUpRequest.password1 != this.signUpRequest.password2) {
			this.$timeout.cancel(this.startTimer);
			this.showErrorMsg("Passwords need to be same.");  
		} else {
				var payload = {
					'UserName': this.signUpRequest.userName,
					'Password': this.signUpRequest.password1
				};
		
				this.requestOut = true;
				this.$http.post('http://localhost/finalservice/Service.svc/signup', payload).then((res) => {
					if (res.data.status == "success") {
						this.requestOut = false;
						this.$rootScope.SuccessError = res.data.message;
						this.successErrorService.showDialog();
					} else {
						this.requestOut = false;
						this.$timeout.cancel(this.startTimer);
						this.showErrorMsg(res.data.message);  
					}
				});
		  }
	  } else {
		  this.touchFormFields(signUpForm);
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