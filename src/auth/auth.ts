export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
}

export interface ErrorResponse {
  message: string;
}
