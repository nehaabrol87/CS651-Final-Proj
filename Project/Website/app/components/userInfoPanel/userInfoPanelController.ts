import { User } from "../../models/User";
class UserInfoPanelController  {

	public userDetails: User = new User();

  static $inject = ['$state', 'localStorageService','userService'];

  constructor(private $state, private localStorageService ,private userService) {
	  this.userDetails = this.localStorageService.get('userDetails');
  }

  public logout () {
    this.localStorageService.clearAll();
    this.$state.go('home');
  }

  public getFullName() {
	  return this.userDetails.userName;
  }

  public getHeight() {
	  return (this.userDetails.height_ft + '.' + this.userDetails.height_in);
  }

  public getWeight() {
	  return this.userDetails.weight;
  }

  public getDob() {
	  return this.userDetails.dob;
  }

  public getGender(){
	  return this.userDetails.gender;
  }
 }

 export default UserInfoPanelController;
