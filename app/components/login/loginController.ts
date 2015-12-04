import { LoginRequest } from "models/LoginRequest";
import * as _ from 'lodash';

export class LoginController {
  public loginRequest: LoginRequest = new LoginRequest();
  public hasError = false;
  public errorMsg = " ";
  private requestOut: boolean = false;
  public startTimer;
  public isLoggedIn = false;
  public userDetails= {
    'firstName' : " ",
    'userName'  : " "
  }

  static $inject = ['$window', '$mdDialog', '$timeout', '$http', '$rootScope', 'localStorageService' , '$state'];
  constructor(private $window, private $mdDialog, private $timeout, private $http, private $rootScope, private localStorageService , private $state) {
    
  }

  private closeDialog() {
    this.$mdDialog.hide();
  }

  private submit(signUpForm) {
    if (signUpForm.$valid) {
      var payload = {
        'UserName': this.loginRequest.userName,
        'Password': this.loginRequest.password
      };

      this.requestOut = true;
      this.$http.post('http://localhost/finalservice/Service.svc/login', payload).then((res) => {
        if (res.data.status == "success") {
          this.requestOut = false;
          this.isLoggedIn = true;
          this.userDetails.firstName = res.data.message[0].toUpperCase() + res.data.message.slice(1); 
          this.userDetails.userName = this.loginRequest.userName;
          this.localStorageService.set('userDetails', this.userDetails);
          this.localStorageService.set('isLoggedIn', this.isLoggedIn);
          this.localStorageService.set('personalData', res.data.personalData);
          this.$state.go('profile');
          } else {
          this.requestOut = false;
          this.$timeout.cancel(this.startTimer);
          this.showErrorMsg(res.data.message);
          }
        });
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