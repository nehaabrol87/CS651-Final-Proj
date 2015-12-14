import { User } from "models/User";
import * as _ from 'lodash';

export class LoginController {
  public loginRequest: User = new User();
  public hasError = false;
  public errorMsg = " ";
  private requestOut: boolean = false;
  public startTimer;
  public isLoggedIn = false;
  public userDetails: User = new User();

  static $inject = ['$mdDialog', '$timeout', 'localStorageService' , '$state','userService'];
  constructor(private $mdDialog, private $timeout, private localStorageService , private $state ,private userService) {
    
  }

  private closeDialog() {
    this.$mdDialog.hide();
  }

  private login(signUpForm) {
    if (signUpForm.$valid) {
      var payload = {
        'UserName': this.loginRequest.userName,
        'Password': this.loginRequest.password,
        'Date': this.getServerFormattedDate(this.getDate(1))
      };
      this.requestOut = true;
      this.userService.login(payload)
      .then(this.onLoginSuccess.bind(this), this.onLoginFailure.bind(this))
     } else {
      this.touchFormFields(signUpForm);
    }
  }

  private getServerFormattedDate(date) {
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  }

  private getDate(daysAgo) {
    var date = new Date();
    date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );
    return date;
  }

  private onLoginSuccess(successCb){
    if(successCb.data.status === "success") {
      this.requestOut = false;
      this.isLoggedIn = true;
      this.userDetails.firstName = successCb.data.firstName[0].toUpperCase() + successCb.data.firstName.slice(1);
      this.userDetails.userName = this.loginRequest.userName;
      this.userDetails.personalData = successCb.data.personalData;
      this.userDetails.mealPlanEnteredForTomorrow = successCb.data.mealPlanEnteredForTomorrow;
      this.userDetails.dob = successCb.data.dob;
      this.userDetails.gender = successCb.data.gender;
      this.userDetails.height_ft = successCb.data.height_ft;
      this.userDetails.height_in = successCb.data.height_in;
      this.userDetails.weight = successCb.data.weight;
      this.userDetails.personType = successCb.data.personType;
      this.userDetails.activityPlanEnteredForTomorrow = successCb.data.activityPlanEnteredForTomorrow;
      this.localStorageService.set('userDetails', this.userDetails);
      this.localStorageService.set('isLoggedIn', this.isLoggedIn);
      this.$state.go('profile');
    } else {
      this.requestOut = false;
      this.$timeout.cancel(this.startTimer);
      this.showErrorMsg(successCb.data.message);
    }    
  }

  private onLoginFailure(failureCb) {
    this.requestOut = false;
    this.$timeout.cancel(this.startTimer);
    this.showErrorMsg(failureCb.data.message);
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