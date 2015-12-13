/// <reference path="./../typings/tsd.d.ts" />

var applicationConfig = function($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider, $mdThemingProvider, localStorageServiceProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'components/homepage/homepage.html',
      controller: 'HomepageController as homepage'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'components/profile/profile.html',
      controller: 'ProfileController as profile'
    })

    .state('activate', {
     url: '/activate?userId&token',
     templateUrl: 'components/activate/activate.html',
     controller: 'ActivateController as activate'
    })

  $urlRouterProvider.otherwise('/home');

  setButtonsTheme($mdThemingProvider);
  setStorageType(localStorageServiceProvider);

};

applicationConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$mdThemingProvider','localStorageServiceProvider'];

function setButtonsTheme($mdThemingProvider) {
  var dalGreenHex = 'rgb(0, 141, 255';
  var dalGreenMap = $mdThemingProvider.extendPalette('blue',{
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

function setStorageType(localStorageServiceProvider) {
  localStorageServiceProvider.setStorageType('sessionStorage');
}

export default applicationConfig;