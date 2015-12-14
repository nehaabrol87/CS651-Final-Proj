import { User } from "models/User";
import * as _ from 'lodash';

export class BmiController {

  public isLoggedIn = false;
  public userDetails = new User();
  public bmiChartValue;
  public actualBmi: string = "";
  public bmiRequest = {
    'height_ft': "",
    'height_in': "",
    "weight": ""
  };

  public bmiChart = {
    '18.5 or less' : 'Underweight',
    '18.5 to 24.99' : 'Normal Weight',
    '25 to 29.99' : 'Overweight',
    '30 to 34.99' : 'Obesity(Class 1)',
    '35 to 39.99' : 'Obesity(Class 2)',
    '40 or greater' : 'Morbid Obesity'
  };

  public bmiOfUser :number;

  static $inject = ['$timeout', 'localStorageService', '$state', 'userService'];
  constructor(private $timeout, private localStorageService, private $state, private userService) {
    this.isLoggedIn = this.localStorageService.get('isLoggedIn') || false;
    this.userDetails = this.localStorageService.get('userDetails');
    
    if (!this.isLoggedIn) {
      $state.go('home');
    } 
  }

  private goToHome() {
    this.$state.go('home');
  }

  private goToProfile() {
    this.$state.go('profile');
  }

  private goToInfo() {
    this.$state.go('info');
  }

  private calcBmi(bmiForm) {
    if (bmiForm.$valid) {
    this.doActualCalculation();
    } else {
    this.touchFormFields(bmiForm);
    }
  }

  private doActualCalculation(){
    var height_ft  = parseInt(this.bmiRequest.height_ft);
    var height_in = (height_ft * 12) + this.bmiRequest.height_in;
    var weight = parseInt(this.bmiRequest.weight);
   
    var heightSqInInches = 0;

    heightSqInInches = Math.pow(parseInt(height_in), 2);

    //Formula 
    /*
     = (weight in lb * 703)/((height in inch))^2

    */

    this.bmiOfUser = (weight * 703) / heightSqInInches;
    this.bmiOfUser = Math.round(this.bmiOfUser);

    if(this.bmiOfUser <18.5){
      this.bmiChartValue = "18.5 or less";
    }

    if (this.bmiOfUser >= 18.5 && this.bmiOfUser <= 24.99) {
    this.bmiChartValue = "18.5 to 24.99";
    }

    if (this.bmiOfUser >= 25 && this.bmiOfUser  <= 29.99) {
      this.bmiChartValue = "25 to 29.99";
    }

    if (this.bmiOfUser >= 30 && this.bmiOfUser <= 34.99) {
    this.bmiChartValue = "30 to 34.99";
    }

    if (this.bmiOfUser >= 35 && this.bmiOfUser <= 39.99) {
    this.bmiChartValue = "35 to 39.99";
    }

    if (this.bmiOfUser >= 40) {
    this.bmiChartValue = "40 or greater";
    }

    this.actualBmi = this.bmiOfUser + " which is " + this.bmiChart[this.bmiChartValue];

  }

  private touchFormFields(bmiForm) {
    var fields = this.getFormFields(bmiForm);

    _.each(fields, function(field) {
      if (field.$setTouched) {
        field.$setTouched(true);
      }
    });
  }

  private getFormFields(bmiForm) {
    var fields = [];
    _.each(bmiForm, function(value, key) {
      var firstLetter = key.slice(0, 1);
      if (firstLetter !== '$') {
        fields.push(value);
      }
    });
    return fields;
  }
 
}