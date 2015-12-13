export class User {
  public userName: string;
  public password: string;
  public password1: string;
  public password2: string;
  public firstName: string;
  public userId: number;
  public personalData: string;
  public verified: string;
  public token: string;
  public dob: string;
  public gender: string;
  public height_in: number;
  public height_ft: number;
  public weight: number;
  public mealPlanEnteredForTomorrow: string;
  public personType: string;

  constructor() {
    this.userName = "";
    this.password = "";
    this.password1 = "";
    this.password2 = "";
    this.firstName = "";
    this.personalData = "";
    this.verified = "";
    this.token = "";
    this.gender = "M";
    this.mealPlanEnteredForTomorrow = "";
    this.personType = "";
  }
}
