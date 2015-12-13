export class ProgressIndicatorService {
  static $inject = ['$mdDialog'];

  constructor(private $mdDialog:any){
  }

  public showDialog() {
  this.$mdDialog.show({
      templateUrl: 'components/progressIndicator/progressIndicator.html',
      bindToController: true,
      escapeToClose: false,
      hasBackdrop: true
    });
  }

  public hideDialog(){
    this.$mdDialog.hide();
  }
}
