import * as _ from 'lodash';

export class HomepageController {

  public carouselImages : Array <any> = new Array <any> ();
  public updatedCarouselImages : Array < any > = new Array <any> ();
  public leftSideOfCarousel :any;
  public rightSideOfCarousel : any;
  public centralImageId : string;
  public centralImageIndex : number;
  public centralImageWidth : number;
  public centralImageElement : any;
  public centralImageWrapperDiv : any;
  public leftPositionOfCentralImage : number;
  public widthOfViewport: number;
  public startCarrousel : any;
  public widthOfLeftSideOfCarousel : number = 0;
  private keyword = "";
  public isLoggedIn = false;
  public userName = " ";
  public userDetails = {};

  static $inject = ['$window',
    '$scope',
    '$interval',
    '$state',
    '$mdDialog',
    'localStorageService'
  ];
  constructor(
    private $window,
    private $scope,
    private $interval,
    private $state,
    private $mdDialog,
    private localStorageService
  ) 
  {   
    this.isLoggedIn = this.localStorageService.get('isLoggedIn') || false;
    this.userDetails = this.localStorageService.get('userDetails') || " ";

    this.carouselImages = ['1.png','2.jpg','3.png','4.jpg','5.png','6.png','7.png','8.png'];
    this.setCarousel();
    $scope.$watch(
    function() { return $window.innerWidth; },
    (newValue, oldValue) => {
      if (newValue !=  oldValue) {
        this.$interval.cancel(this.startCarrousel);
        this.updatedCarouselImages = [];
        this.setCarousel();
      }
    });      
  }

  private setCarousel() {
    this.setImageCarouselDefaults();

      angular.element(document).ready(() => {
      this.centralImageElement = <any>angular.element(document.querySelector('#a' + this.centralImageId + ' > img'));
      this.widthOfViewport = this.$window.innerWidth;

      if (this.centralImageElement[0].width != 0) {
        this.setCSSProperties();
      } else {
        this.centralImageElement.on("load", () => {
          this.setCSSProperties();
        });
      }
      this.startSlideSlow();
      });
      this.$scope.$on('$destroy', () => {
      this.$interval.cancel(this.startCarrousel);
    });
  }

  private startSlideSlow() {
    this.startCarrousel = this.$interval(()=>{
      this.nextSlide()
      },5000
    );
  }

  private setImageCarouselDefaults() {
    if(this.isNoOfImagesInCarouselOdd()) {
      this.centralImageIndex = Math.floor(this.carouselImages.length/2);
    } else {
      this.centralImageIndex = this.carouselImages.length/2 ;
    }
    this.updateImageCarousel();

    this.centralImageId = this.updatedCarouselImages[this.centralImageIndex].split(".")[0];
  }

  private isNoOfImagesInCarouselOdd() {
    if(this.carouselImages.length % 2 === 0) {
      return false;
    }
    return true;
  }

  private updateImageCarousel() {
    if(this.isNoOfImagesInCarouselOdd()) {
      this.leftSideOfCarousel = this.carouselImages.slice(this.centralImageIndex+1,this.carouselImages.length);
      this.rightSideOfCarousel = this.carouselImages.slice(1,this.centralImageIndex+1);
    } else {
      this.leftSideOfCarousel = this.carouselImages.slice(this.centralImageIndex,this.carouselImages.length);
      this.rightSideOfCarousel = this.carouselImages.slice(1,this.centralImageIndex);
    }
    this.updatedCarouselImages = this.leftSideOfCarousel.concat(this.carouselImages[0],this.rightSideOfCarousel);
  }

  public nextSlide() {
    var elementToBePoppedFromLeft;

    this.$interval.cancel(this.startCarrousel);
    elementToBePoppedFromLeft = this.updatedCarouselImages[0];

    this.updatedCarouselImages = this.updatedCarouselImages.slice(1);
    this.updatedCarouselImages = this.updatedCarouselImages.concat(elementToBePoppedFromLeft);
    this.resetPositionOfCarouselImages();
    this.setCSSProperties();
    this.startSlideSlow();
  }

  public previousSlide() {
    var elementToBePoppedFromRight;

    this.$interval.cancel(this.startCarrousel);
    elementToBePoppedFromRight = this.updatedCarouselImages[this.carouselImages.length-1];

    this.updatedCarouselImages.pop();
    this.updatedCarouselImages.unshift(elementToBePoppedFromRight);
    this.resetPositionOfCarouselImages();
    this.setCSSProperties();
    this.startSlideSlow();
  }

  private resetPositionOfCarouselImages() {
    this.centralImageId = this.updatedCarouselImages[this.centralImageIndex].split('.')[0];
    this.leftSideOfCarousel = this.updatedCarouselImages.slice(0,this.centralImageIndex);
    this.rightSideOfCarousel = this.updatedCarouselImages.slice(this.centralImageIndex+1,this.carouselImages.length);
  }

  private setCSSProperties() {
    this.setOpacityOfAllImages();
    this.removeOpacityOfCentralImage();
    this.setLeftPositionOfCentralImage();
    this.getWidthOfLeftSideOfCarousel();
    this.setLeftPositionOfLeftSideOfCarousel();
    this.setLeftPositionOfRightSideOfCarousel();
  }

  private setLeftPositionOfCentralImage() {
    this.centralImageElement = <any>angular.element(document.querySelector('#a'+ this.centralImageId +' > img'));
    this.centralImageWrapperDiv = <any>angular.element(document.querySelector('#a'+this.centralImageId));
    this.centralImageWidth = this.centralImageElement[0].width;
    this.leftPositionOfCentralImage = (this.widthOfViewport - this.centralImageWidth)/2;
    this.centralImageWrapperDiv.css({'left': this.leftPositionOfCentralImage + 'px'});
  }

  private getImageId(image) {
    return image.split('.')[0];
  }


  private getWidthOfLeftSideOfCarousel() {
    this.widthOfLeftSideOfCarousel = 0;
    var imageElement;

    _.each(this.leftSideOfCarousel,(image)=> {
      imageElement=  <any>angular.element(document.querySelector('#a'+ this.getImageId(image) +' > img'));
      this.widthOfLeftSideOfCarousel = this.widthOfLeftSideOfCarousel +  imageElement[0].width;
    });

    if(this.leftPositionOfCentralImage > 0) {
      this.widthOfLeftSideOfCarousel = this.widthOfLeftSideOfCarousel - this.leftPositionOfCentralImage;
    }
  }

  private setLeftPositionOfLeftSideOfCarousel() {
    var left ;
    var imageWrapperDiv;
    var imageElement;
    left = this.widthOfLeftSideOfCarousel;

    _.each(this.leftSideOfCarousel,(image)=> {
     imageWrapperDiv = <any>angular.element(document.querySelector('#a' + this.getImageId(image)));
      imageElement = <any>angular.element(document.querySelector('#a' + this.getImageId(image) + ' > img'));
      imageWrapperDiv.css({'left' : -left + 'px'});
      left = left - imageElement[0].width;
    });
  }

  private setLeftPositionOfRightSideOfCarousel() {
    var left ;
    var imageWrapperDiv;
    var imageElement;
    left = this.leftPositionOfCentralImage + this.centralImageWidth;

    _.each(this.rightSideOfCarousel,(image)=> {
      imageWrapperDiv = <any>angular.element(document.querySelector('#a' + this.getImageId(image)));
      imageElement = <any>angular.element(document.querySelector('#a' + this.getImageId(image) + ' > img'));
      imageWrapperDiv.css({'left': left + 'px'});
      left = left + imageElement[0].width;
    });
  }

  private setOpacityOfAllImages() {
    angular.element(document.querySelectorAll('.homepage__image-tile > img')).css({'opacity':.3});
  }

  private removeOpacityOfCentralImage() {
    angular.element(document.querySelector('#a'+this.centralImageId +' > img')).css({'opacity':1});
  }

  private signUp() {
    this.$mdDialog.show({
      templateUrl: 'components/signUp/signUp.html',
      controller: 'SignUpController',
      controllerAs: 'vm',
      bindToController: true
    });
  }

  private goToProfile() {
    this.$state.go('profile');
  }

  private login() {
    this.$mdDialog.show({
      templateUrl: 'components/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm',
      bindToController: true
    });
  }
}
