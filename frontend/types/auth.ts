// types/auth.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export interface TokenPayload {
  exp: number;
  // Other claims as needed
}

