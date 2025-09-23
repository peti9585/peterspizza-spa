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

export interface IRefreshJwtTokenRequest {
  refreshToken: string;
}

export interface ILoginResponse {
  name: string;
  jwtToken: string;
  refreshToken: string;
}

export interface ITokenResponse {
  jwtToken: string;
  refreshToken: string;
}

export interface IGetAllPizzasResponse {
  getAllPizzasResponses: IGetPizzaResponse[];
}

export interface IGetPizzaResponse {
  pizzaName: string;
  description: string;
  pizzaImageBytes: string;
}
