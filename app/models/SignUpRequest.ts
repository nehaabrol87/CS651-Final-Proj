export class SignUpRequest {
  public userName: string;
  public password1: string;
  public password2: string;
 

  constructor() {
    this.userName = "";
    this.password1 = "";
    this.password2 = "";
  }
}
