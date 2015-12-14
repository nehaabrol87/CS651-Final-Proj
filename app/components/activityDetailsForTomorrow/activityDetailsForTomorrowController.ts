import { Activity } from "models/Activity";
import * as _ from 'lodash';

export class ActivityDetailsForTomorrowController {
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

	static $inject = ['$mdDialog', 'activityService', '$timeout'];

	constructor(private $mdDialog, private activityService, private $timeout) {
	}

	private closeDialog() {
		this.$mdDialog.hide();
	}

	private emailActivityPlan() {
		var payload = {
			'Email': this.userDetails.userName,
			'ActivityDetail': this.activityStatus.activityDetail,
			'Date': this.activityDate
		};
		this.requestOut = true;
		this.activityService.sendActivityPlanByMail(payload)
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