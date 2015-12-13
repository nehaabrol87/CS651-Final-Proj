export class UserService {

  static $inject = ['$http'];

  constructor(private $http) {
  }

  public login(user) {
    return this.$http.post('http://localhost/finalservice/Service.svc/login', user);
  }

  public signUp(user) {
    return this.$http.post('http://localhost/finalservice/Service.svc/signup',user);
  }

  public updateProfile(user) {
    return this.$http.post('http://localhost/finalservice/Service.svc/updateProfile', user);
  }
}
