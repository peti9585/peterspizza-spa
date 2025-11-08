// Requests
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

export interface IOrderPizzaRequest {
  pizzaId: number;
  quantity: number;
}

export interface IOrderPizzasRequest {
  userId: number;
  orderPizzaRequests: IOrderPizzaRequest[]
}

// Responses
export interface ITokenResponse {
  jwtToken: string;
  refreshToken: string;
}

export interface IGetAllPizzasResponse {
  getAllPizzasResponses: IGetPizzaResponse[];
}

export interface IGetPizzaResponse {
  pizzaId: number;
  pizzaName: string;
  description: string;
  pizzaImageBytes: string;
}

export interface IGetPizzasByIdsResponse {
  getPizzaResponses: IGetPizzaByIdResponse[];
}

export interface IGetPizzaByIdResponse {
  pizzaId: number,
  pizzaName: string,
  pizzaPrice: number
}
