import { ApiResponse, SpinCheckResponse, AdminAuthResponse, AdminConfig, SpinResult } from '../types';
import { DEV_CONFIG } from '../config/dev';
import { getSettings, updateSlices } from './settings';

const API_BASE = '/api';
const IS_DEVELOPMENT = import.meta.env.DEV;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Admin authentication
  async loginAdmin(password: string): Promise<AdminAuthResponse> {
    if (IS_DEVELOPMENT) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return DEV_CONFIG.mockApi.adminLogin(password);
    }
    
    const response = await apiRequest<AdminAuthResponse>('/admin-login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    return response.data!;
  },

  // Configuration management (now uses localStorage)
  async getConfig(): Promise<AdminConfig> {
    if (IS_DEVELOPMENT) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return DEV_CONFIG.mockApi.getConfig();
    }
    
    // Get settings from localStorage
    const settings = getSettings();
    return { slices: settings.slices };
  },

  async saveConfig(config: AdminConfig): Promise<void> {
    if (IS_DEVELOPMENT) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // In development, also save to localStorage
      updateSlices(config.slices);
      return DEV_CONFIG.mockApi.saveConfig(config);
    }
    
    // Save to localStorage
    updateSlices(config.slices);
  },

  // Spin operations
  async checkSpin(phone: string): Promise<SpinCheckResponse> {
    if (IS_DEVELOPMENT) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 400));
      return DEV_CONFIG.mockApi.checkSpin(phone);
    }
    
    const response = await apiRequest<{ exists: boolean }>('/google-sheets?action=checkPhone&phone=' + encodeURIComponent(phone));
    return {
      canSpin: !response.data!.exists,
      reason: response.data!.exists ? 'This phone number has already been used' : undefined,
    };
  },

  async recordSpin(result: SpinResult): Promise<void> {
    if (IS_DEVELOPMENT) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log('🎯 Development Mode: Spin result would be recorded:', result);
      return DEV_CONFIG.mockApi.recordSpin(result);
    }
    
    await apiRequest('/google-sheets', {
      method: 'POST',
      body: JSON.stringify({
        action: 'recordSpin',
        data: result,
      }),
    });
  },
};

