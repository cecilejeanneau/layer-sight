import React from 'react';
import { Menu, Bell, Globe } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

interface HeaderProps {
  onMenuToggle: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, title }) => {
  const { appSettings, updateAppSettings } = useSettingsStore();

  const toggleLanguage = () => {
    updateAppSettings({
      language: appSettings.language === 'fr' ? 'en' : 'fr'
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            title="Toggle menu"
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-3"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleLanguage}
            title="Toggle language"
            type="button"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Globe className="w-4 h-4 mr-2" />
            {appSettings.language.toUpperCase()}
          </button>
          
          <button
            title="Notifications"
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};