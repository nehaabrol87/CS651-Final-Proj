class UserInfoPanelController  {

  static $inject = ['$state', 'localStorageService'];

  constructor(private $state, private localStorageService) { }

  public logout () {
    this.localStorageService.clearAll();
    this.$state.go('home');
  }
 }

 export default UserInfoPanelController;
