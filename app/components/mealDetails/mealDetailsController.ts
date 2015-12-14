import { Meal } from "models/Meal";
import * as _ from 'lodash';

export class MealDetailsController {
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
public mealsProgress: any;

static $inject = ['$mdDialog','mealService','$timeout'];

	constructor(private $mdDialog, private mealService ,private $timeout) {
	}

	private closeDialog(){
		this.$mdDialog.hide();
	}

	private submitDietCompletion(){
		var payload = {
			'Email' : this.userDetails.userName,
			'Date' : this.mealDate
		}
		this.requestOut = true;
		this.isSubmitMealPlanButtonDisabled = true;
		this.mealService.submitDietCompletion(payload)
			.then(this.onDietCompletionSubmissionSuccess.bind(this), this.onDietCompletionSubmissionFailure.bind(this));
	}

	private onDietCompletionSubmissionSuccess(successCb) {
		this.requestOut = false;
		if(successCb.data.status == "success") {	
			this.mealStatus.CompletedDiet = 'Y';
			this.mealsProgress.mealsCompleted = this.mealsProgress.mealsCompleted + 1;
			this.mealsProgress.mealsIncomplete = this.mealsProgress.mealsIncomplete - 1;
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showSuccessMsg(successCb.data.message);
		} else
		{
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showErrorMsg(successCb.data.message);
		}	
	}

	private onDietCompletionSubmissionFailure(failureCb){
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