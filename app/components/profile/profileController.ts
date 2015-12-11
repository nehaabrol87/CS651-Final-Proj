import * as _ from 'lodash';

export class ProfileController {
	public isLoggedIn = false;
	public isSideNavVisible = false;
	public hideShow = "HIDE";
	private userDetails : any;
	private userName;
	public mealsDown = true;
	public default = true;
	public fruitsDown = true;
	public veggiesDown = true;
	public dairyDown = true;
	public grainsDown = true;
	public proteinsDown = true;
	public meal = false;
	public personalData;
	public personType = "children";
	public fruitType;
	public veggiesType;
	public dairyType;
	public proteinsType;
	public grainsType;
	public fruitValue = "";
	public veggiesValue = "";
	public dairyValue = "";
	public proteinsValue = "";
	public grainsValue ="";
	public fruitIntake = " ";
	public veggiesIntake = " ";
	public grainsIntake = " ";
	public proteinsIntake = " ";
	public dairyIntake = " ";
	public minDate :Date;
	public mealDate: Date ;
	public isProfileUpdated = false;
	public startTimer;
	public hasError = false;
	public isSuccessFul = false;
	public successMsg = " ";
	public errorMsg = " ";
	public startErrorTimer;
	public startSuccessTimer;
	public requestCanceler: any;

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
	  '$q'];

	constructor(private $http, 
		private $rootScope, 
		private localStorageService, 
		private $state,
	  private $scope, 
	  private $timeout, 
	  private $mdDialog,
	  private progressIndicatorService,
	  private $q) {
		this.isLoggedIn = this.localStorageService.get('isLoggedIn') || false;
		this.userDetails = this.localStorageService.get('userDetails');
		if (!this.isLoggedIn) {
			$state.go('home');
		} else {	
			if (this.localStorageService.get('personalData') == 'Y') {
				this.isProfileUpdated = true;
			} else {
				this.isProfileUpdated = false;
			}
			this.displayIntakeData();
			this.minDate = new Date();
			this.userName = this.userDetails.userName;
		} 
	}

	private displayIntakeData() {
		switch (this.personType) {
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

	private goToMeals() {
		this.default = false;
		this.meal = true;
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

	private submit() {
		var payload;
		if(this.mealDate == undefined) {
			this.$timeout.cancel(this.startTimer);
			this.showErrorMsg("You need to enter a Date"); 
		} else 
			if (this.fruitValue.length == 0 || this.grainsValue.length == 0 || this.veggiesValue.length == 0
				|| this.proteinsValue.length == 0 || this.dairyValue.length == 0)
			{
			this.$timeout.cancel(this.startTimer);
			this.showErrorMsg("You need to select at least one food item from each group");
		} else {
      payload = {
		  'Date': this.getServerFormattedDate(this.mealDate),
        'Fruits' : this.fruitValue,
        'Veggies' : this.veggiesValue,
        'Grains' : this.grainsValue,
        'Dairy' : this.dairyValue,
        'Proteins' : this.proteinsValue,
        'CompletedDiet' : 'N',
        'Email': this.userName
      };
	this.requestCanceler = this.$q.defer();
	this.progressIndicatorService.showDialog();
	this.$http.post('http://localhost/finalservice/Service.svc/submitMealPlan', payload, 
		   { timeout: this.requestCanceler.promise }).then((res) => {
		  if (res.data.status == "success") {
			  this.$timeout.cancel(this.startSuccessTimer);
			  this.$timeout.cancel(this.startErrorTimer);
			  this.showSuccessMsg(res.data.message);
			  this.progressIndicatorService.hideDialog();
		  } else {
			  this.$timeout.cancel(this.startSuccessTimer);
			  this.$timeout.cancel(this.startErrorTimer);
			  this.showErrorMsg(res.data.message);
			  this.progressIndicatorService.hideDialog();
		  }
	  });
		}
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