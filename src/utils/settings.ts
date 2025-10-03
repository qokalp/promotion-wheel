import { WheelSlice } from '../types';

const SETTINGS_KEY = 'promotion-wheel-settings';

export interface AppSettings {
  slices: WheelSlice[];
  lastUpdated: string;
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  slices: [
    { label: "Ücretsiz Kahve", weight: 1 },
    { label: "%50 İndirim", weight: 1 },
    { label: "Ücretsiz Tatlı", weight: 1 },
    { label: "Tekrar Dene", weight: 2 },
    { label: "Ücretsiz Meze", weight: 1 },
    { label: "%25 İndirim", weight: 1 },
    { label: "Ücretsiz İçecek", weight: 1 },
    { label: "Şanslı Çekiliş", weight: 1 },
  ],
  lastUpdated: new Date().toISOString(),
};

export function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the structure
      if (parsed.slices && Array.isArray(parsed.slices)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  
  // Return default settings if nothing is stored or parsing failed
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    const settingsToSave = {
      ...settings,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsToSave));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
    throw new Error('Failed to save settings');
  }
}

export function updateSlices(slices: WheelSlice[]): void {
  const currentSettings = getSettings();
  const updatedSettings: AppSettings = {
    ...currentSettings,
    slices,
  };
  saveSettings(updatedSettings);
}

export function clearSettings(): void {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Failed to clear settings:', error);
  }
}
