import controller from './updateProfileController';

export let UpdateProfile = (): ng.IDirective => {
  return {
    controller,
    controllerAs: 'vm',
    restrict: 'E',
    templateUrl: 'components/updateProfile/updateProfile.html',
    scope : {
    	userName : '='
    },
    bindToController:true
  };
}
