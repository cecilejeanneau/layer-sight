import { create } from 'zustand';
import { AppSettings, ConfigSettings } from '../types';

interface SettingsState {
  appSettings: AppSettings;
  configSettings: ConfigSettings;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  updateConfigSettings: (settings: Partial<ConfigSettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  appSettings: {
    language: 'fr',
    theme: 'light',
    notifications: true,
    autoSave: true
  },
  
  configSettings: {
    dataSource: 'api/v1/data',
    refreshInterval: 30000,
    maxDataPoints: 1000,
    defaultVisualization: '3d',
    colorScheme: 'viridis',
    gridSize: 50
  },
  
  updateAppSettings: (settings) => {
    set((state) => ({
      appSettings: { ...state.appSettings, ...settings }
    }));
  },
  
  updateConfigSettings: (settings) => {
    set((state) => ({
      configSettings: { ...state.configSettings, ...settings }
    }));
  }
}));