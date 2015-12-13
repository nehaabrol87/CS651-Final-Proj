export class MealService {

  static $inject = ['$http'];

  constructor(private $http) {
  }

  public submitMealPlan(meal){
   return this.$http.post('http://localhost/finalservice/Service.svc/submitMealPlan', meal)
  }

  public getMealPlan(meal) {
    return this.$http.post('http://localhost/finalservice/Service.svc/getMealPlan', meal);
  }

  public getMealPlanForToday(meal) {
    return this.$http.post('http://localhost/finalservice/Service.svc/getMealPlanForToday', meal);
  }

  public sendMealPlanByMail(meal) {
    return this.$http.post('http://localhost/finalservice/Service.svc/sendMealPlanByMail', meal);
  }

  public getProgressFor7Days(meal){
    return this.$http.post('http://localhost/finalservice/Service.svc/getProgressFor7Days', meal);
  }

}
