import { User } from "models/User";
import * as _ from 'lodash';

export class InfoController {

  public isLoggedIn = false;
  public userDetails = new User();

  static $inject = ['$timeout', 'localStorageService', '$state', 'userService'];

  constructor(private $timeout, private localStorageService, private $state, private userService) {
    this.isLoggedIn = this.localStorageService.get('isLoggedIn') || false;
    this.userDetails = this.localStorageService.get('userDetails');

  }

  private goToHome() {
    this.$state.go('home');
  }

}