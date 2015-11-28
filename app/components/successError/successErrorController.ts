export class SuccessErrorController {

	public msg = " ";
	static $inject = ['$mdDialog','$rootScope','successErrorService'];

	constructor(private $mdDialog, private $rootScope, private successErrorService) {
		this.msg = $rootScope.SuccessError
	}

	private closeDialog() {
		this.successErrorService.hideDialog();
	}
}