// Development configuration
// This file provides default values for development mode

export const DEV_CONFIG = {
  // Default wheel slices for development
  wheelSlices: [
    { label: "Free Coffee", weight: 1 },
    { label: "50% Discount", weight: 1 },
    { label: "Free Dessert", weight: 1 },
    { label: "Try Again", weight: 2 },
    { label: "Free Appetizer", weight: 1 },
    { label: "25% Discount", weight: 1 },
    { label: "Free Drink", weight: 1 },
    { label: "Lucky Draw", weight: 1 },
  ],
  
  // Development mode flags
  isDevelopment: true,
  
  // Mock API responses for development
  mockApi: {
    checkSpin: (phone: string) => ({
      canSpin: true,
      reason: undefined,
    }),
    
    recordSpin: (result: any) => ({
      success: true,
      message: 'Mock: Result recorded in development mode',
    }),
    
    adminLogin: (password: string) => ({
      authenticated: true,
      token: 'mock-admin-token',
    }),
    
    getConfig: () => ({
      slices: DEV_CONFIG.wheelSlices,
    }),
    
    saveConfig: (config: any) => ({
      success: true,
      message: 'Mock: Configuration saved in development mode',
    }),
  },
};
