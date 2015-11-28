export class ProgressIndicatorService {
  static $inject = ['$mdDialog'];

  constructor(private $mdDialog:any){
  }

  public showDialog(parentEl) {
    var alert = this.$mdDialog.alert({
      parent: parentEl,
      targetEvent: parentEl,
      templateUrl: 'components/progressIndicator/progressIndicator.html',
      bindToController: true,
      escapeToClose: false,
      hasBackdrop: true
    });

    this.$mdDialog
      .show( alert )
      .finally(function() {
        alert = undefined;
      });
  }

  public hideDialog(){
    this.$mdDialog.hide();
  }
}
