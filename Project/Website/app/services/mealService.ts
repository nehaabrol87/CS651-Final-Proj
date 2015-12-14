export class MealService {

  static $inject = ['$http'];

  constructor(private $http) {
  }

  public submitMealPlan(meal){
   return this.$http.post('http://localhost/finalservice/Service.svc/submitMealPlan', meal)
  }

  public getMealPlanForDate(meal) {
    return this.$http.post('http://localhost/finalservice/Service.svc/getMealPlanForDate', meal);
  }

  public sendMealPlanByMail(meal) {
    return this.$http.post('http://localhost/finalservice/Service.svc/sendMealPlanByMail', meal);
  }

  public getMealProgressFor8Days(meal){
    return this.$http.post('http://localhost/finalservice/Service.svc/getMealProgressFor8Days', meal);
  }

  public submitDietCompletion(meal) {
    return this.$http.post('http://localhost/finalservice/Service.svc/submitDietCompletion', meal);
  }

}
