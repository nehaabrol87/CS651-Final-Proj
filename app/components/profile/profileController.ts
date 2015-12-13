import * as _ from 'lodash';
import { User } from "../../models/User";
import { Meal } from "../../models/Meal";

export class ProfileController {
	public isLoggedIn = false;
	public isSideNavVisible = false;
	public hideShow = "HIDE";
	public userDetails: User = new User();
	public mealDetails: Meal = new Meal();
	public mealDetailsForToday: Meal = new Meal();
	public mealsDown;
	public fruitsDown;
	public veggiesDown;
	public dairyDown;
	public grainsDown;
	public proteinsDown;
	public default = true;
	public meal = false;
	public personalData;
	public personType;
	public fruitType;
	public veggiesType;
	public dairyType;
	public proteinsType;
	public grainsType;
	public fruitValue;
	public veggiesValue;
	public dairyValue;
	public proteinsValue;
	public grainsValue;
	public fruitIntake;
	public veggiesIntake;
	public grainsIntake;
	public proteinsIntake;
	public dairyIntake;
	public mealDate: Date ;
	public isProfileUpdated = false;
	public isMealPlanSubmittedForTomorrow = false;
	public isMealPlanSubmittedForToday = false;
	public startTimer;
	public hasError = false;
	public isSuccessFul = false;
	public successMsg = " ";
	public errorMsg = " ";
	public startErrorTimer;
	public startSuccessTimer;
	public requestCanceler: any;
	public planForSelf = false;

  private girlsIntake = {
    'fruit' : '1.5 cups' ,
    'veggies' : '2 cups',
    'proteins' : '5 ounces',
    'dairy' :  '3 cups',
	  'grains' : '3 ounces'
  }

  private boysIntake = {
	  'fruit': '2 cups',
	  'veggies': '3 cups',
	  'proteins': '6.5 ounces',
	  'dairy': '3 cups',
	  'grains' : '4 ounces'
  }

  private childsIntake = {
	  'fruit': '1 cup',
	  'veggies': '2 cups',
	  'proteins': '2 ounces',
	  'dairy':  '2 cups',
	  'grains' : '1.5 ounces'
  }

  private mensIntake = {
	  'fruit': '2 cups',
	  'veggies': '3 cups',
	  'proteins': '6.5 ounces',
	  'dairy':   '3 cups',
	  'grains' :  '4 ounces'
  }

  private womensIntake = {
	  'fruit': '1.5 cups',
	  'veggies': '2.5 cups',
	  'proteins': '5.5 ounces',
	  'dairy': '3 cups',
	  'grains' : '3 ounces'
  }

	private fruitCupContains = {
		"apple": '2.5" in diameter',
		"grape": '32 seeds',
		"orange": '3" in diameter',
		"peach": '5" in diameter',
		"banana": '8" in diameter'
	};

	private veggieCupContains = {
		"carrot": '1 large',
		"tomato": '3" in diameter',
		"potato": '1 large'
	};

	private dairyCupContains = {
		"milk": '1 cup',
		"yoghurt": '1 cup',
		"natural cheese": '1.5 ounces',
		"processed cheese" : '2 ounces'
	};

	private grainCupContains = {
		"bagel": '1 inch mini bagel',
		"biscuit": '2 inch in diameter',
		"bread": '1 slice'
	};

	private proteinCupContains = {
		"meat": '1 ounce',
		"cooked beans": '.25 cup',
		"egg": '1 ',
		"peanut butter" :'1 tbsp'
	};


	static $inject = ['$http', 
	  '$rootScope',
	  'localStorageService', 
	  '$state', 
	  '$scope', 
	  '$timeout',
	  '$mdDialog',
	  'progressIndicatorService',
	  'mealService',
	  '$q'
	  ];

	constructor(private $http, 
		private $rootScope, 
		private localStorageService, 
		private $state,
	  private $scope, 
	  private $timeout, 
	  private $mdDialog,
	  private progressIndicatorService,
	  private mealService,
	  private $q
	  ) {

		this.isLoggedIn = this.localStorageService.get('isLoggedIn') || false;
		this.userDetails = this.localStorageService.get('userDetails');

		if (!this.isLoggedIn) {
			$state.go('home');
		} else {	
			if (this.userDetails.personalData === 'Y') {
				this.isProfileUpdated = true;
			} else {
				this.isProfileUpdated = false;
			}
			this.restoreDefaults();
		} 
	}

	private displayIntakeData(personType) {
		switch (personType) {
			case 'girls': this.fruitIntake = " --- " + this.girlsIntake['fruit'];
				this.proteinsIntake = " --- " + this.girlsIntake['proteins'];
				this.dairyIntake = " --- " + this.girlsIntake['dairy'];
				this.grainsIntake = " --- " + this.girlsIntake['grains'];
				this.veggiesIntake = " --- " + this.girlsIntake['veggies'];
				break;
			case 'boys': this.fruitIntake = " --- " + this.boysIntake['fruit'];
				this.proteinsIntake = " --- " + this.boysIntake['proteins'];
				this.dairyIntake = " --- " + this.boysIntake['dairy'];
				this.grainsIntake = " --- " + this.boysIntake['grains'];
				this.veggiesIntake = " --- " + this.boysIntake['veggies'];
				break;
			case 'men': this.fruitIntake = " --- " + this.mensIntake['fruit'];
				this.proteinsIntake = " --- " + this.mensIntake['proteins'];
				this.dairyIntake = " --- " + this.mensIntake['dairy'];
				this.grainsIntake = " --- " + this.mensIntake['grains'];
				this.veggiesIntake = " --- " + this.mensIntake['veggies'];
				break;
			case 'women': this.fruitIntake = " --- " + this.womensIntake['fruit'];
				this.proteinsIntake = " --- " + this.womensIntake['proteins'];
				this.dairyIntake = " --- " + this.womensIntake['dairy'];
				this.grainsIntake = " --- " + this.womensIntake['grains'];
				this.veggiesIntake = " --- " + this.womensIntake['veggies'];
				break;
			case 'children': this.fruitIntake = " --- " + this.childsIntake['fruit'];
				this.proteinsIntake = " --- " + this.childsIntake['proteins'];
				this.dairyIntake = " --- " + this.childsIntake['dairy'];
				this.grainsIntake = " --- " + this.childsIntake['grains'];
				this.veggiesIntake = " --- " + this.childsIntake['veggies'];
				break;
		}
	}

	private doFruitCalculations() {
		if (this.fruitType != undefined) {
			this.fruitValue = this.fruitType[0].toUpperCase() + this.fruitType.slice(1) + " " + this.fruitCupContains[this.fruitType] + " in 1 cup";
		}
	}

	private doVeggiesCalculations() { 
		if (this.veggiesType != undefined) {
			this.veggiesValue= this.veggiesType[0].toUpperCase() + this.veggiesType.slice(1) + " " + this.veggieCupContains[this.veggiesType] + " in 1 cup";
		}
	}

	private doDairyCalculations() {
		if (this.dairyType != undefined) {
			this.dairyValue = this.dairyType[0].toUpperCase() + this.dairyType.slice(1) + " " + this.dairyCupContains[this.dairyType] ;
		}
	}

	private doGrainsCalculations() {
		if (this.grainsType != undefined) {
			this.grainsValue = this.grainsType[0].toUpperCase() + this.grainsType.slice(1) + " " + this.grainCupContains[this.grainsType] + " makes an ounce";
		}
	}

	private doProteinsCalculations() {
		if (this.proteinsType != undefined) {
			this.proteinsValue = this.proteinsType[0].toUpperCase() + this.proteinsType.slice(1) + " " + this.proteinCupContains[this.proteinsType] ;
		}
	}

	private goToHome() {
		this.$state.go('home');
	}

	private goToDefault() {
		this.default = true;
		this.meal = false;
	}

	private goToMealsForFamily() {
		this.restoreDefaults();
		this.personType = "children";
		this.displayIntakeData(this.personType);
		this.planForSelf = false;
		this.default = false;
		this.meal = true;
	}

	private goToMealsForSelf() {
		var payload1;
		var payload2;
		this.restoreDefaults();
		this.displayIntakeData(this.userDetails.personType);
		this.mealDate = this.getDate(1);
		this.userDetails = this.localStorageService.get('userDetails');
		this.planForSelf = true;
		this.default = false;
		this.meal = true;
		this.getProgressFor7Days();

		payload1 = {
			'Email': this.userDetails.userName,
			'Date': this.getServerFormattedDate(new Date())
		}
		this.mealService.getMealPlanForToday(payload1)
			.then(this.onMealPlanForTodayRetrieveSuccess.bind(this), this.onMealPlanForTodayRetrieveFailure.bind(this));

		if(this.userDetails.mealPlanEnteredForTomorrow == 'Y') {
			payload2 = {
        'Email' : this.userDetails.userName,
        'Date': this.getServerFormattedDate(this.getDate(1))
			};
			this.progressIndicatorService.showDialog();
			this.mealService.getMealPlan(payload2)
				.then(this.onMealPlanRetrieveSuccess.bind(this), this.onMealPlanRetrieveFailure.bind(this));
		}
	}

	private onMealPlanRetrieveSuccess(successCb){
	  if(successCb.data.status == "success"){
		  this.progressIndicatorService.hideDialog();
		  this.mealDetails.fruit = successCb.data.fruit;
		  this.mealDetails.veggies = successCb.data.veggies;
		  this.mealDetails.grains = successCb.data.grain;
		  this.mealDetails.proteins = successCb.data.proteins;
		  this.mealDetails.dairy = successCb.data.dairy;
	  } else {
		  this.$timeout.cancel(this.startSuccessTimer);
		  this.$timeout.cancel(this.startErrorTimer);
		  this.progressIndicatorService.hideDialog();
		  this.showErrorMsg(successCb.data.message);
	  }
	}

	private onMealPlanRetrieveFailure(failureCb) {
		this.$timeout.cancel(this.startSuccessTimer);
		this.$timeout.cancel(this.startErrorTimer);
		this.progressIndicatorService.hideDialog();
		this.showErrorMsg(failureCb.data.message);
	}

	private onMealPlanForTodayRetrieveSuccess(successCb){
		if (successCb.data.status == "success") {
			this.isMealPlanSubmittedForToday = true;
			this.mealDetailsForToday.fruit = successCb.data.fruit;
			this.mealDetailsForToday.veggies = successCb.data.veggies;
			this.mealDetailsForToday.grains = successCb.data.grain;
			this.mealDetailsForToday.proteins = successCb.data.proteins;
			this.mealDetailsForToday.dairy = successCb.data.dairy;
		} else {
			this.isMealPlanSubmittedForToday = false
		}
	}

	private onMealPlanForTodayRetrieveFailure(failureCb){
		this.isMealPlanSubmittedForToday = false;
	}

	private emailMealPlan() {
		var payload = {
			'Email': this.userDetails.userName,
			'Fruits' : this.mealDetails.fruit,
			'Veggies' : this.mealDetails.veggies,
			'Proteins' : this.mealDetails.proteins,
			'Grains' : this.mealDetails.grains,
			'Dairy' :this.mealDetails.dairy,
			'Date': this.getServerFormattedDate(this.getDate(1))
		};
		this.progressIndicatorService.showDialog();
		this.mealService.sendMealPlanByMail(payload)
			.then(this.onSendEmailSuccess.bind(this), this.onSendEmailFailure.bind(this));
	}

	private onSendEmailSuccess(successCb) {
		this.progressIndicatorService.hideDialog();
		if(successCb.data.status == "success"){
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.progressIndicatorService.hideDialog();
			this.showSuccessMsg(successCb.data.message);
		} else {
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.progressIndicatorService.hideDialog();
			this.showErrorMsg(successCb.data.message);
		}
	}

	private onSendEmailFailure(failureCb) {
		this.progressIndicatorService.hideDialog();
		this.$timeout.cancel(this.startSuccessTimer);
		this.$timeout.cancel(this.startErrorTimer);
		this.progressIndicatorService.hideDialog();
		this.showErrorMsg(failureCb.data.message);
	}

	private getProgressFor7Days() {
		var payload = {
			'Email' : this.userDetails.userName,
			'StartDate' :this.getServerFormattedDate(this.getDate(-7)),
			'EndDate' : this.getServerFormattedDate(this.getDate(-1))
		}
		this.mealService.getProgressFor7Days(payload)
			.then(this.onProgressRetrieveSuccess.bind(this), this.onProgressRetrieveFailure.bind(this));
	}

	private onProgressRetrieveSuccess(successCb){

	}
 

	private onProgressRetrieveFailure(failureCb){

	}
	private restoreDefaults(){
		this.fruitValue = "";
		this.proteinsValue = "";
		this.grainsValue = "";
		this.fruitValue = "";
		this.dairyValue = "";
		this.veggiesValue = "";
		this.veggiesType = "";
		this.fruitType = "";
		this.dairyType ="";
		this.grainsType = "";
		this.proteinsType = "";
		this.dairyIntake = "";
		this.grainsIntake = "";
		this.proteinsIntake = "";
		this.fruitIntake = "";
		this.veggiesIntake = "";
		this.mealsDown = true;
	  this.fruitsDown = true;
	  this.veggiesDown = true;
	  this.dairyDown = true;
	  this.grainsDown = true;
	  this.proteinsDown = true;
	}

	private toggleMeals() {
		this.mealsDown = !this.mealsDown;
		if(this.mealsDown) {
			this.fruitsDown = true;
			this.veggiesDown = true;
			this.dairyDown = true;
			this.grainsDown = true;
			this.proteinsDown = true;
		} else {
			this.fruitsDown = false;
			this.veggiesDown = false;
			this.dairyDown = false;
			this.grainsDown = false;
			this.proteinsDown = false;
		}
	}

	private submitMealPlan() {
		var payload;
		if (this.fruitValue.length == 0 || this.grainsValue.length == 0 || this.veggiesValue.length == 0
			|| this.proteinsValue.length == 0 || this.dairyValue.length == 0) {
			this.$timeout.cancel(this.startTimer);
			this.showErrorMsg("You need to select at least one food item from each group");
		} else {
			payload = {
				'Date': this.getServerFormattedDate(this.mealDate),
				'Fruits': this.fruitValue + ' ,Daily requirement is ' + this.fruitIntake,
				'Veggies': this.veggiesValue + ' ,Daily requirement is ' + this.veggiesIntake,
				'Grains': this.grainsValue + ' ,Daily requirement is ' + this.grainsIntake,
				'Dairy': this.dairyValue + ' ,Daily requirement is' + this.dairyIntake,
				'Proteins': this.proteinsValue + ',Daily requirement is' + this.proteinsIntake,
				'CompletedDiet': 'N',
				'Email': this.userDetails.userName
			};
			this.progressIndicatorService.showDialog();
			this.mealService.submitMealPlan(payload)
				.then(this.onMealPlanSubmitSuccess.bind(this), this.onMealPlanSubmitFailure.bind(this));
		}
	}

	private onMealPlanSubmitSuccess(successCb){
		if(successCb.data.status == "success"){
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.userDetails = this.localStorageService.get('userDetails');
			this.userDetails.mealPlanEnteredForTomorrow = 'Y';
			this.localStorageService.set('userDetails', this.userDetails);
			this.progressIndicatorService.hideDialog();
			this.showSuccessMsg(successCb.data.message);
			this.isMealPlanSubmittedForTomorrow = true;
			this.restoreDefaults();
			this.displayIntakeData(this.userDetails.personType);
			this.$state.go('profile');
			this.goToMealsForSelf();
		} else {
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.progressIndicatorService.hideDialog();
			this.showErrorMsg(successCb.data.message);

		}
	}

	private onMealPlanSubmitFailure(failureCb){
		this.$timeout.cancel(this.startSuccessTimer);
		this.$timeout.cancel(this.startErrorTimer);
		this.progressIndicatorService.hideDialog();
		this.showErrorMsg(failureCb.data.message);
	}

	private getDate(days){
		var date = new Date();
		date = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate() + days 
		);
		return date;
	}

	private getServerFormattedDate(date: Date) {
		return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
	}

	private showSuccessMsg(msg) {
		this.isSuccessFul = true;
		this.successMsg = msg;

		this.startSuccessTimer = this.$timeout(() => {
			this.successMsg = " ";
			this.isSuccessFul = false;
			this.$mdDialog.hide();
		}, 5000);
	}


	private showErrorMsg(msg) {
		this.hasError = true;
		this.errorMsg = msg;

		this.startErrorTimer = this.$timeout(() => {
			this.errorMsg = " ";
			this.hasError = false;
		}, 5000);
	}

	private toggleProteins() {
		this.proteinsDown = !this.proteinsDown;
		this.fruitsDown = true;
		this.veggiesDown = true;
		this.grainsDown = true;
		this.dairyDown = true;
	}
	private toggleGrains() {
		this.fruitsDown = true;
		this.veggiesDown = true;
		this.proteinsDown = true;
		this.dairyDown = true;
		this.grainsDown = !this.grainsDown;
	}
	private toggleDairy() {
		this.fruitsDown = true;
		this.veggiesDown = true;
		this.proteinsDown = true;
		this.grainsDown = true;
		this.dairyDown = !this.dairyDown;
	}

	private toggleVeggies() {
		this.fruitsDown = true;
		this.dairyDown = true;
		this.proteinsDown = true;
		this.grainsDown = true;
		this.veggiesDown = !this.veggiesDown;
	}

	private toggleFruits() {
		this.veggiesDown = true;
		this.dairyDown = true;
		this.proteinsDown = true;
		this.grainsDown = true;
		this.fruitsDown = !this.fruitsDown;
	}

	private toggleSideNav() {
		this.isSideNavVisible = !this.isSideNavVisible;
		if(!this.isSideNavVisible) {
			this.hideShow = "HIDE";
		} else {
			this.hideShow = "SHOW";
		}
	}
}  