import React from 'react';
import { Globe, Palette, Bell, Save } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

export const AppSettings: React.FC = () => {
  const { appSettings, updateAppSettings } = useSettingsStore();

  const handleLanguageChange = (language: 'fr' | 'en') => {
    updateAppSettings({ language });
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateAppSettings({ theme });
  };

  const handleNotificationsChange = (notifications: boolean) => {
    updateAppSettings({ notifications });
  };

  const handleAutoSaveChange = (autoSave: boolean) => {
    updateAppSettings({ autoSave });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Paramètres de l'Application</h3>
        
        {/* Langue */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Globe className="w-5 h-5 text-gray-400 mr-2" />
            <label className="block text-sm font-medium text-gray-700">
              Langue de l'interface
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLanguageChange('fr')}
              className={`p-3 rounded-lg border transition-colors ${
                appSettings.language === 'fr'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🇫🇷 Français
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`p-3 rounded-lg border transition-colors ${
                appSettings.language === 'en'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Thème */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Palette className="w-5 h-5 text-gray-400 mr-2" />
            <label className="block text-sm font-medium text-gray-700">
              Thème de l'interface
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-3 rounded-lg border transition-colors ${
                appSettings.theme === 'light'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              ☀️ Clair
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-3 rounded-lg border transition-colors ${
                appSettings.theme === 'dark'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🌙 Sombre
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notifications
                </label>
                <p className="text-xs text-gray-500">
                  Recevoir des notifications pour les mises à jour
                </p>
              </div>
            </div>
            <label htmlFor="notifications" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={appSettings.notifications}
                onChange={(e) => handleNotificationsChange(e.target.checked)}
                className="sr-only peer"
                title="Notification input"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Sauvegarde automatique */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Save className="w-5 h-5 text-gray-400 mr-2" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sauvegarde automatique
                </label>
                <p className="text-xs text-gray-500">
                  Sauvegarder automatiquement les modifications
                </p>
              </div>
            </div>
            <label htmlFor="autoSave" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="autoSave"
                name="autoSave"
                checked={appSettings.autoSave}
                onChange={(e) => handleAutoSaveChange(e.target.checked)}
                className="sr-only peer"
                title="Sauvegarde automatique"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Les paramètres sont sauvegardés automatiquement dans votre navigateur.
          </p>
        </div>
      </div>
    </div>
  );
};