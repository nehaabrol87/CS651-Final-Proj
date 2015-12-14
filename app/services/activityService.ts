export class ActivityService {

  static $inject = ['$http'];

  constructor(private $http) {
  }

  public submitActivityPlan(activity) {
    return this.$http.post('http://localhost/finalservice/Service.svc/submitActivityPlan', activity)
  }

  public getActivityPlanForDate(activity) {
    return this.$http.post('http://localhost/finalservice/Service.svc/getActivityPlanForDate', activity);
  }

  public sendActivityPlanByMail(activity) {
    return this.$http.post('http://localhost/finalservice/Service.svc/sendActivityPlanByMail', activity);
  }

  public getActivityProgressFor7Days(activity) {
    return this.$http.post('http://localhost/finalservice/Service.svc/getActivityProgressFor7Days', activity);
  }

  public submitActivityCompletion(activity) {
    return this.$http.post('http://localhost/finalservice/Service.svc/submitActivityCompletion', activity);
  }

}
