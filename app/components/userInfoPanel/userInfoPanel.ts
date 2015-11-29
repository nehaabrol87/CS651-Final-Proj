import controller from './userInfoPanelController';

export let UserInfoPanel = (): ng.IDirective => {
  return {
    controller,
    controllerAs: 'vm',
    restrict: 'E',
    templateUrl: 'components/userInfoPanel/userInfoPanel.html',
    scope : {},
    bindToController:true
  };
}
