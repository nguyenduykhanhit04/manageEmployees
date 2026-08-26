/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * auth.ts, 25/8/2026 nguyenduykhanh2
 */

/**
 * Cấu trúc dữ liệu yêu cầu đăng nhập.
 */
export interface LoginRequest {
  /** Tên đăng nhập / tài khoản người dùng */
  username: string;
  /** Mật khẩu đăng nhập */
  password: string;
}

/**
 * Cấu trúc dữ liệu phản hồi sau khi đăng nhập thành công.
 */
export interface LoginResponse {
  /** Chuỗi JWT Access Token */
  accessToken: string;
  /** Loại token (mặc định Bearer) */
  tokenType: string;
}

/**
 * Cấu trúc payload giải mã từ JWT Token.
 */
export interface TokenPayload {
  /** Thời gian hết hạn của token (Unix timestamp) */
  exp: number;
}
