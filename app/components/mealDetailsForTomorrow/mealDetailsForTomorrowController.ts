import { Meal } from "models/Meal";
import * as _ from 'lodash';

export class MealDetailsForTomorrowController {
	public mealStatus: any;
	public mealDate: any;
	public userDetails: any;
	public requestOut = false;
	public isSubmitMealPlanButtonDisabled = false;
	public isSuccessFul = false;
	public hasError = false;
	public successMsg = " ";
	public errorMsg = " ";
	public startErrorTimer;
	public startSuccessTimer;

	static $inject = ['$mdDialog', 'mealService', '$timeout'];

	constructor(private $mdDialog, private mealService, private $timeout) {
	}

	private closeDialog() {
		this.$mdDialog.hide();
	}

	private emailMealPlan() {
		var payload = {
			'Email': this.userDetails.userName,
			'Fruits': this.mealStatus.fruit,
			'Veggies': this.mealStatus.veggies,
			'Proteins': this.mealStatus.proteins,
			'Grains': this.mealStatus.grains,
			'Dairy': this.mealStatus.dairy,
			'Date': this.mealDate
		};
		this.requestOut = true;
		this.mealService.sendMealPlanByMail(payload)
			.then(this.onSendEmailSuccess.bind(this), this.onSendEmailFailure.bind(this));
	}

	private onSendEmailSuccess(successCb) {
		this.requestOut = false;
		if (successCb.data.status == "success") {
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showSuccessMsg(successCb.data.message);
		} else {
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showErrorMsg(successCb.data.message);
		}
	}

	private onSendEmailFailure(failureCb) {
		this.requestOut = false;
		this.$timeout.cancel(this.startSuccessTimer);
		this.$timeout.cancel(this.startErrorTimer);
		this.showErrorMsg(failureCb.data.message);
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

}