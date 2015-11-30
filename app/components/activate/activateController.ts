export class ActivateController {

	static $inject = ['$stateParams', '$http', '$state', 'progressIndicatorService', '$q'];
	public userId;
	public token;
	public message;
	public searchRequestCanceler: any;

	constructor(private $stateParams, private $http, private $state, private progressIndicatorService, private $q) {
		this.userId = this.$stateParams.userId;
		this.token = this.$stateParams.token;
		this.verifyUser();
	}

	private goToHome() {
		this.$state.go('home');
	}

	private verifyUser() {
		var payload = {
			'UserId': this.userId,
			'Token': this.token
		};

		this.progressIndicatorService.showDialog();
		this.searchRequestCanceler = this.$q.defer();
		this.$http.post('http://localhost/finalservice/Service.svc/verifyUser', payload, { timeout: this.searchRequestCanceler.promise }).then((res) => {
			if (res.data.status == "success") {
				this.progressIndicatorService.hideDialog();
				this.message = res.data.message;
			} else {
				this.progressIndicatorService.hideDialog();
				this.message = res.data.message;
			}
		});

	}
}