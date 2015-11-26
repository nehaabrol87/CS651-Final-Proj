/// <reference path="./../typings/tsd.d.ts" />

var applicationConfig = function($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, $mdThemingProvider, localStorageServiceProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'components/login/login.html',
      controller: 'LoginController as login'
    })
    
  $urlRouterProvider.otherwise('/login');

  setButtonsTheme($mdThemingProvider);

};

applicationConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$mdThemingProvider','localStorageServiceProvider'];

function setButtonsTheme($mdThemingProvider) {
  var dalGreenHex = '45ba8e';
  var dalGreenMap = $mdThemingProvider.extendPalette('green',{
    '50': dalGreenHex,
    '100': dalGreenHex,
    '200': dalGreenHex,
    '300': dalGreenHex,
    '400': dalGreenHex,
    '500': dalGreenHex,
    '600': dalGreenHex,
    '700': dalGreenHex,
    '800': dalGreenHex,
    '900': dalGreenHex,
    'A100': dalGreenHex,
    'A200': dalGreenHex,
    'A400': dalGreenHex,
    'A700': dalGreenHex
  });
  $mdThemingProvider.definePalette('dalGreen', dalGreenMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('dalGreen');
}


export default applicationConfig;