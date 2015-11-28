export class SuccessErrorService {
  static $inject = ['$mdDialog'];

  constructor(private $mdDialog: any) {
  }

  public showDialog() {
    this.$mdDialog.show({
      templateUrl: 'components/successError/successError.html',
      controller: 'SuccessErrorController',
      controllerAs: 'vm',
      bindToController: true
    });
  }

  public hideDialog() {
    this.$mdDialog.hide();
  }
}