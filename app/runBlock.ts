var runBlock = function($mdDialog, $rootScope) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
	  $mdDialog.cancel();
	});
	$rootScope.SuccessError = " ";
};

runBlock.$inject = ['$mdDialog', '$rootScope'];

export default runBlock;