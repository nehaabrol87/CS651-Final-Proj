import * as _ from 'lodash';
import { User } from "../../models/User";
import { Meal } from "../../models/Meal";
import { Activity } from "../../models/Activity";

export class ProfileController {
	public isLoggedIn = false;
	public isSideNavVisible = false;
	public hideShow = "HIDE";
	public userDetails: User = new User();
	public mealDetailsForTomorrow: Meal = new Meal();
	public activityDetailsForTomorrow: Activity = new Activity();
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
	public isActivityPlanSubmittedForTomorrow = false;
	public hasError = false;
	public isSuccessFul = false;
	public successMsg = " ";
	public errorMsg = " ";
	public startErrorTimer;
	public startSuccessTimer;
	public planForSelf = false;
	public physicalActivity = false;
	public mealProgressFor8Days: any;
	public activityProgressFor8Days: any;
	public round: any;
	public activityType;
	public personTypeForActivity;

	public mealsProgress = {
		'mealsMissed' :7,
		'mealsCompleted' :0,
		'mealsIncomplete' :0
	}

	public activitiesProgress = {
		'activitiesMissed': 7,
		'activitiesCompleted': 0,
		'activitiesIncomplete': 0
	}

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

	private adults = {
		'briskWalking': "20 minutes of brisk walking every day",
		'muscleStrenghtening': "30 minutes or more work all major muscle groups (legs, hips, back, abdomen, chest, shoulders, and arms) every day",
		'jogging': "15  minutes of jogging/running every day"
	};

	private children = {
		"briskWalking": "30 or more minutes of physical activity each day",
		"jogging": "30 or more minutes of physical activity each day",
		"boneStrenghtening": "20 minutes of rope jumping"
	}
  
  private olderAdults = {
	  'briskWalking': "10 minutes of brisk walking every day",
	  'muscleStrenghtening': "10 minutes or more work all major muscle groups (legs, hips, back, abdomen, chest, shoulders, and arms) every day",
	  'jogging': "10 minutes of jogging/running every day"
  }

	static $inject = ['$http', 
	  '$rootScope',
	  'localStorageService', 
	  '$state', 
	  '$scope', 
	  '$timeout',
	  '$mdDialog',
	  'progressIndicatorService',
	  'mealService',
	  '$q',
	  '$window',
	  'activityService'
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
	  private $q,
	  private $window,
	  private activityService
	  ) {

		this.isLoggedIn = this.localStorageService.get('isLoggedIn') || false;
		this.userDetails = this.localStorageService.get('userDetails');
		this.round = $window.Math.round;

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
		this.physicalActivity = false;
	}

	private goToPhysicalActivityForSelf() {
		var array = this.userDetails.dob.split("/");

		var month = array[0];
		var day = array[1];
		var year = array[2];
		var age = this.getAge(month, day, year);

		this.restoreActivityDefaults();
    this.personTypeForActivity = this.getPersonTypeFromDob(age);
		this.physicalActivity = true;
		this.default = false;
		this.meal = false;
		this.planForSelf = true;

		if (this.userDetails.activityPlanEnteredForTomorrow == 'Y') {
			this.getActivityProgressFor8Days();
			var payload = {
				'Email': this.userDetails.userName,
				'Date': this.getServerFormattedDate(this.getDate(1))
			};
			this.progressIndicatorService.showDialog();
			this.activityService.getActivityPlanForDate(payload)
				.then(this.onActivityPlanForTomorrowRetrieveSuccess.bind(this),
				this.onActivityPlanForTomorrowRetrieveFailure.bind(this));
		}
	}

	private onActivityPlanForTomorrowRetrieveSuccess(successCb){
		this.progressIndicatorService.hideDialog();
		if (successCb.data.status == "success") {
			this.activityDetailsForTomorrow.activityDetail = successCb.data.activityDetail;
		} else {
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showErrorMsg(successCb.data.message);
		}
	}

	private onActivityPlanForTomorrowRetrieveFailure(failureCb){
		this.progressIndicatorService.hideDialog();
		this.$timeout.cancel(this.startSuccessTimer);
		this.$timeout.cancel(this.startErrorTimer);
		this.showErrorMsg(failureCb.data.message);
	}

	private getAge(month,day,year) {
		var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getUTCMonth() + 1;
    var currentDay = currentDate.getUTCDate();
    // You need to treat the cases where the year, month or day hasn't arrived yet.
    var age = currentYear - year;
      if (currentMonth > month) {
        return age;
      } else {
      if (currentDay >= day) {
        return age;
            } else {
                age--;
                return age;
            }
        }
	}

	private getPersonTypeFromDob(age){
		if(age>=18 && age < 60){
			return "adults";
		} else 
		if(age>=60) {
			return "olderAdults";
		} else {
			return "children";
		}
	}

	private goToActivityorFamily(){
		this.physicalActivity = true;
		this.restoreActivityDefaults();
		this.default = false;
		this.meal = false;
		this.planForSelf = false;
	}

	private goToMealsForFamily() {
		this.restoreDefaults();
		this.personType = "children";
		this.displayIntakeData(this.personType);
		this.planForSelf = false;
		this.physicalActivity = false;
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
		this.physicalActivity = false;
		this.default = false;
		this.meal = true;

		if(this.userDetails.mealPlanEnteredForTomorrow == 'Y') {
			this.getMealProgressFor8Days();
			payload2 = {
        'Email' : this.userDetails.userName,
        'Date': this.getServerFormattedDate(this.getDate(1))
			};
			this.progressIndicatorService.showDialog();
			this.mealService.getMealPlanForDate(payload2)
				.then(this.onMealPlanForTomorrowRetrieveSuccess.bind(this),
				      this.onMealPlanForTomorrowRetrieveFailure.bind(this));
		}
	}

	private onMealPlanForTomorrowRetrieveSuccess(successCb) {
	  if(successCb.data.status == "success"){
		  this.progressIndicatorService.hideDialog();
		  this.mealDetailsForTomorrow.fruit = successCb.data.fruit;
		  this.mealDetailsForTomorrow.veggies = successCb.data.veggies;
		  this.mealDetailsForTomorrow.grains = successCb.data.grain;
		  this.mealDetailsForTomorrow.proteins = successCb.data.proteins;
		  this.mealDetailsForTomorrow.dairy = successCb.data.dairy;
	  } else {
		  this.$timeout.cancel(this.startSuccessTimer);
		  this.$timeout.cancel(this.startErrorTimer);
		  this.progressIndicatorService.hideDialog();
		  this.showErrorMsg(successCb.data.message);
	  }
	}

	private onMealPlanForTomorrowRetrieveFailure(failureCb) {
		this.$timeout.cancel(this.startSuccessTimer);
		this.$timeout.cancel(this.startErrorTimer);
		this.progressIndicatorService.hideDialog();
		this.showErrorMsg(failureCb.data.message);
	}

	private getMealProgressFor8Days() {
		var payload = {
			'Email' : this.userDetails.userName,
			'StartDate' :this.getServerFormattedDate(this.getDate(-7)),
			'EndDate' : this.getServerFormattedDate(this.getDate(0))
		}
		this.mealService.getMealProgressFor8Days(payload)
			.then(this.onProgressRetrieveSuccess.bind(this), this.onProgressRetrieveFailure.bind(this));
	}

	private onProgressRetrieveSuccess(successCb){
		if(successCb.data.status == "success"){
			this.mealProgressFor8Days = successCb.data.mealProgress;
			this.updateOverAllMealProgress();
		} else {
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showErrorMsg(successCb.data.message);
		}
	}

	private onProgressRetrieveFailure(failureCb) {
		this.$timeout.cancel(this.startSuccessTimer);
		this.$timeout.cancel(this.startErrorTimer);
		this.showErrorMsg(failureCb.data.message);
	}

	private getActivityProgressFor8Days() {
		var payload = {
			'Email': this.userDetails.userName,
			'StartDate': this.getServerFormattedDate(this.getDate(-7)),
			'EndDate': this.getServerFormattedDate(this.getDate(0))
		}
		this.activityService.getActivityProgressFor8Days(payload)
			.then(this.onActivityProgressRetrieveSuccess.bind(this), this.onActivityProgressRetrieveFailure.bind(this));
	}

	private onActivityProgressRetrieveSuccess(successCb) {
		if (successCb.data.status == "success") {
			this.activityProgressFor8Days = successCb.data.activityProgress;
			this.updateOverAllActivityProgress();
		} else {
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showErrorMsg(successCb.data.message);
		}
	}

	private onActivityProgressRetrieveFailure(failureCb) {
		this.$timeout.cancel(this.startSuccessTimer);
		this.$timeout.cancel(this.startErrorTimer);
		this.showErrorMsg(failureCb.data.message);
	}

	private getPercentCompletion(count){
		return Math.round((count / 7) * 100);
	}

	private updateOverAllMealProgress(){
		this.mealsProgress.mealsCompleted = this.getMealsCompleted();
		this.mealsProgress.mealsIncomplete = this.getMealsIncomplete();
		this.mealsProgress.mealsMissed = 7 -(this.mealsProgress.mealsCompleted + this.mealsProgress.mealsIncomplete);
	}

	private updateOverAllActivityProgress(){
		this.activitiesProgress.activitiesCompleted = this.getActivitiesCompleted();
		this.activitiesProgress.activitiesIncomplete = this.getActivitiesIncomplete();
		this.activitiesProgress.activitiesMissed = 7 - (this.activitiesProgress.activitiesCompleted + this.activitiesProgress.activitiesIncomplete);
	}

	private getMealsCompleted(){
		var count = 0;
		var todaysDate = this.getServerFormattedDate(new Date());
		todaysDate = todaysDate + " 12:00:00 AM";

		_.each(this.mealProgressFor8Days,(meal)=>{
			if (meal['Date'] != todaysDate && meal['CompletedDiet'] == "Y") {
				count = count+ 1;
			}
		});
		return count;
	}

	private getMealsIncomplete() {
		var count = 0;
		var todaysDate = this.getServerFormattedDate(new Date());
		todaysDate = todaysDate + " 12:00:00 AM";

		_.each(this.mealProgressFor8Days, (meal) => {
			if (meal['Date'] != todaysDate && meal['CompletedDiet'] == "N") {
				count = count + 1;
			}
		});
		return count;
	}

	private wasMealPlanEntered(daysAgo) {
		var mealEntered;
		var mealDate = this.getServerFormattedDate(this.getDate(daysAgo));

		mealDate = mealDate + " 12:00:00 AM";
		mealEntered = <Meal>_.findWhere(this.mealProgressFor8Days, { 'Date': mealDate });

		return mealEntered;
	}

	private wasMealPlanCompleted(daysAgo) {
		var mealStatus ={};
		var mealDate = this.getServerFormattedDate(this.getDate(daysAgo));

		mealDate = mealDate + " 12:00:00 AM";
		mealStatus = <Meal>_.findWhere(this.mealProgressFor8Days, { 'Date': mealDate });

		if (mealStatus != undefined) {
			return mealStatus['CompletedDiet'] == 'Y' ? true : false;
		} else {
			return false;
		}	
	}

	private wasActivityPlanEntered(daysAgo) {
		var activityEntered;
		var activityDate = this.getServerFormattedDate(this.getDate(daysAgo));

		activityDate = activityDate + " 12:00:00 AM";
		activityEntered = <Activity>_.findWhere(this.activityProgressFor8Days, { 'Date': activityDate });

		return activityEntered;
	}

	private wasActivityPlanCompleted(daysAgo) {
		var activityStatus = {};
		var activityDate = this.getServerFormattedDate(this.getDate(daysAgo));

		activityDate = activityDate + " 12:00:00 AM";
		activityStatus = <Activity>_.findWhere(this.activityProgressFor8Days, { 'Date': activityDate });

		if (activityStatus != undefined) {
			return activityStatus['CompletedActivity'] == 'Y' ? true : false;
		} else {
			return false;
		}
	}

	private getActivitiesCompleted() {
		var count = 0;
		var todaysDate = this.getServerFormattedDate(new Date());
		todaysDate = todaysDate + " 12:00:00 AM";

		_.each(this.activityProgressFor8Days, (activity) => {
			if (activity['Date'] != todaysDate && activity['CompletedActivity'] == "Y") {
				count = count + 1;
			}
		});
		return count;
	}

	private getActivitiesIncomplete() {
		var count = 0;
		var todaysDate = this.getServerFormattedDate(new Date());
		todaysDate = todaysDate + " 12:00:00 AM";

		_.each(this.activityProgressFor8Days, (activity) => {
			if (activity['Date'] != todaysDate && activity['CompletedActivity'] == "N") {
				count = count + 1;
			}
		});
		return count;
	}

	private showActivityDetailsPopup(daysAgo) {
		var activityDate = this.getServerFormattedDate(this.getDate(daysAgo));
		var activityStatus = this.getActivityProgressForDate(daysAgo);
		var userDetails = this.userDetails;
		var activitiesProgress = this.activitiesProgress;

		this.$mdDialog.show({
			templateUrl: 'components/activityDetails/activityDetails.html',
			controller: 'ActivityDetailsController',
			clickOutsideToClose: true,
			bindToController: true,
			controllerAs: 'vm',
			locals: {
				activityStatus,
				activityDate,
				userDetails,
				activitiesProgress
			}
		});
	}

	private showMealDetailsPopup(daysAgo) {
		var mealDate = this.getServerFormattedDate(this.getDate(daysAgo));
		var mealStatus= this.getMealProgressForDate(daysAgo);
		var userDetails = this.userDetails;
		var mealsProgress = this.mealsProgress;

		this.$mdDialog.show({
			templateUrl: 'components/mealDetails/mealDetails.html',
			controller: 'MealDetailsController',
			clickOutsideToClose : true,
			bindToController: true,
			controllerAs: 'vm',
			locals: {
				mealStatus,
				mealDate,
				userDetails,
			  mealsProgress
			}
		});
	}

	private showMealDetailsForTomorrowPopup(daysAgo) {
		var mealDate = this.getServerFormattedDate(this.getDate(daysAgo));
		var mealStatus = this.mealDetailsForTomorrow;
		var userDetails = this.userDetails;

		this.$mdDialog.show({
			templateUrl: 'components/mealDetailsForTomorrow/mealDetailsForTomorrow.html',
			controller: 'MealDetailsForTomorrowController',
			clickOutsideToClose: true,
			bindToController: true,
			controllerAs: 'vm',
			locals: {
				mealStatus,
				mealDate,
				userDetails
			}
		});
	}


	private showActivityDetailsForTomorrowPopup(daysAgo) {
		var activityDate = this.getServerFormattedDate(this.getDate(daysAgo));
		var activityStatus = this.activityDetailsForTomorrow;
		var userDetails = this.userDetails;

		this.$mdDialog.show({
			templateUrl: 'components/activityDetailsForTomorrow/activityDetailsForTomorrow.html',
			controller: 'ActivityDetailsForTomorrowController',
			clickOutsideToClose: true,
			bindToController: true,
			controllerAs: 'vm',
			locals: {
				activityStatus,
				activityDate,
				userDetails
			}
		});
	}

	private getMealProgressForDate(daysAgo){
		var mealStatus = {};
		var mealDate = this.getServerFormattedDate(this.getDate(daysAgo));

		mealDate = mealDate + " 12:00:00 AM";

		mealStatus = <Meal>_.findWhere(this.mealProgressFor8Days, { 'Date': mealDate });

		return mealStatus;
	}

	private getActivityProgressForDate(daysAgo) {
		var activityStatus = {};
		var activityDate = this.getServerFormattedDate(this.getDate(daysAgo));

		activityDate = activityDate + " 12:00:00 AM";

		activityStatus = <Activity>_.findWhere(this.activityProgressFor8Days, { 'Date': activityDate });

		return activityStatus;
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
			this.$timeout.cancel(this.startErrorTimer);
			this.$timeout.cancel(this.startSuccessTimer);
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

	private submitActivityPlan() {
		var payload;
		if(this.activityType == undefined) {
			this.$timeout.cancel(this.startErrorTimer);
			this.$timeout.cancel(this.startSuccessTimer);
			this.showErrorMsg("You need to select at least one physical activity");
		} else {
			var activity;
			if(this.personTypeForActivity == 'adults'){
				activity = this.adults[this.activityType];
			} else if (this.personTypeForActivity == 'children') {
				activity = this.children[this.activityType];
			} else if (this.personTypeForActivity == 'olderAdults') {
				activity = this.olderAdults[this.activityType];
			}
			payload = {
				'Date': this.getServerFormattedDate(this.getDate(1)),
				'CompletedActivity': 'N',
				'ActivityDetail': this.activityType + ": " + activity,
				'Email': this.userDetails.userName
			};
			this.progressIndicatorService.showDialog();
			this.activityService.submitActivityPlan(payload)
				.then(this.onActivityPlanSubmitSuccess.bind(this), this.onActivityPlanSubmitFailure.bind(this));
		}
	}

	private onActivityPlanSubmitSuccess(successCb){
		this.progressIndicatorService.hideDialog();
		if(successCb.data.status == "success"){
			this.isActivityPlanSubmittedForTomorrow = true;
			this.userDetails = this.localStorageService.get('userDetails');
			this.userDetails.activityPlanEnteredForTomorrow = 'Y';
			this.localStorageService.set('userDetails', this.userDetails);
			this.showSuccessMsg(successCb.data.message);
			this.restoreActivityDefaults();
			this.$state.go('profile');
			this.goToPhysicalActivityForSelf();
		} else {
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showErrorMsg(successCb.data.message);
		}

	}

	private onActivityPlanSubmitFailure(failureCb){
		this.progressIndicatorService.hideDialog();
		this.$timeout.cancel(this.startSuccessTimer);
		this.$timeout.cancel(this.startErrorTimer);
		this.showErrorMsg(failureCb.data.message);
	}

	private restoreActivityDefaults(){
		this.activityType = "";
		this.personTypeForActivity = "";
	}
}