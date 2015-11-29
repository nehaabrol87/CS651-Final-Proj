import * as _ from 'lodash';

export class ProfileController {
	public isLoggedIn = false;
	public isSideNavVisible = false;
	public hideShow = "HIDE";
	private userName = " ";
	public mealsDown = true;
	public default = true;
	public fruitsDown = true;
	public meal = false;
	public personType;
	public fruitType;
	public fruitValue = "";
	private fruitPerPerson = {
    "children" : '1',
    "girls" : '1.5',
    "boys": '2' ,
    "women" : '1.75',
    "men" : '2.5'
	};

	private fruitCupContains = {
		"apple": '2.5',
		"grape": '32',
		"orange": '3',
		"peach": '5',
		"banana": '8'
	};

	static $inject = ['$http', '$rootScope', 'localStorageService','$state','$scope'];

	constructor(private $http, private $rootScope, private localStorageService ,private $state ,private $scope) {
		this.isLoggedIn = this.localStorageService.get('isLoggedIn') || false;
		if(!this.isLoggedIn) {
			$state.go('home');
		} else {
			this.userName = this.localStorageService.get('userName');
		} 
	}

	private doCalculations() {
		if (this.fruitType != undefined && this.personType != undefined) {
			var noOfFruitCups = this.fruitPerPerson[this.personType];
			var fruitQuantityPerCup = this.fruitCupContains[this.fruitType];

			var value = noOfFruitCups * fruitQuantityPerCup;
			if(this.fruitType != 'grape') {
				this.fruitValue = this.fruitType[0].toUpperCase() + this.fruitType.slice(1) + " " + value + " inches in diameter";
			}else {
				this.fruitValue = this.fruitType[0].toUpperCase() + this.fruitType.slice(1) + " " + value + " seeds";
			}
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
	}

	private toggleFruits() {
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