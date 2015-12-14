import { Activity } from "models/Activity";
import * as _ from 'lodash';

export class ActivityDetailsController {
	public activityStatus: any;
	public activityDate: any;
	public userDetails: any;
	public requestOut = false;
	public isSubmitActivityPlanButtonDisabled = false;
	public isSuccessFul = false;
	public hasError = false;
	public successMsg = " ";
	public errorMsg = " ";
	public startErrorTimer;
	public startSuccessTimer;
	public activitiesProgress: any;

	static $inject = ['$mdDialog', 'activityService', '$timeout'];

	constructor(private $mdDialog, private activityService, private $timeout) {
	}

	private closeDialog() {
		this.$mdDialog.hide();
	}

	private submitActivityCompletion() {
		var payload = {
			'Email': this.userDetails.userName,
			'Date': this.activityDate
		}
		this.requestOut = true;
		this.isSubmitActivityPlanButtonDisabled = true;
		this.activityService.submitActivityCompletion(payload)
			.then(this.onActivityCompletionSubmissionSuccess.bind(this), this.onActivityCompletionSubmissionFailure.bind(this));
	}

	private onActivityCompletionSubmissionSuccess(successCb) {
		this.requestOut = false;
		if (successCb.data.status == "success") {
			this.activityStatus.CompletedActivity = 'Y';
			this.activitiesProgress.activitiesCompleted = this.activitiesProgress.activitiesCompleted + 1;
			this.activitiesProgress.activitiesIncomplete = this.activitiesProgress.activitiesIncomplete - 1;
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showSuccessMsg(successCb.data.message);
		} else {
			this.$timeout.cancel(this.startSuccessTimer);
			this.$timeout.cancel(this.startErrorTimer);
			this.showErrorMsg(successCb.data.message);
		}
	}

	private onActivityCompletionSubmissionFailure(failureCb) {
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