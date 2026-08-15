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
  id: number;
  name: string;
  jwtToken: string;
  refreshToken: string;
}

export interface IOrderPizzaRequest {
  pizzaId: number;
  quantity: number;
}

export interface IOrderPizzasRequest {
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

export interface IGetUserDetailsByIdResponse {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface IUpdateUserRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface IGetAllOrderResponse {
  orderId: string;
  orderState: number;
  orderDate: string;
}

export interface IGetAllOrdersResponse {
  getAllOrderResponses: IGetAllOrderResponse[];
}

export interface IOrderStatusChanged {
  orderId: string;
  newOrderState: number;
}

export interface IJwtTokenInformationRequest {
  jwtToken: string;
}

export interface IJwtTokenInformationResponse {
  isAdmin: boolean;
}

export namespace Admin {
  export interface IOrderItem {
    orderId: number;
    pizzaName: string;
    quantity: number;
    price: number;
  }

  export interface IGetAllOrderResponse {
    orderId: string;
    userName: string;
    orderState: OrderState;
    orderDate: string;
    orderItems: IOrderItem[];
  }
  export interface IGetAllOrdersResponse {
    getAllOrderResponses: IGetAllOrderResponse[];
  }

  export interface IChangeOrderStateRequest {
    orderId: string;
    newOrderState: OrderState;
  }
}

// Enums
export enum LoginType {
  User,
  Admin
}

export enum OrderState {
  Undefined,
  WaitingToAccept,
  Preparing,
  ReadyToPickUp,
  Done
}
