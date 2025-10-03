export interface WheelSlice {
  label: string;
  weight: number;
}

export interface SpinResult {
  name: string;
  phone: string;
  prize: string;
  timestamp: string;
}

export interface AdminConfig {
  slices: WheelSlice[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: 'ALREADY_EXISTS' | 'RECORDED' | 'ERROR' | 'SUCCESS';
}

export interface SpinCheckResponse {
  canSpin: boolean;
  reason?: string;
}

export interface AdminAuthResponse {
  authenticated: boolean;
  token?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

