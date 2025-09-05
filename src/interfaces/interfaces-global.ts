export interface IRegistrationData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface ILoginData {
  userName: string;
  password: string;
}

export interface ILoginResponse {
  name: string;
  jwtToken: string;
}
