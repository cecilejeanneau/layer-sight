import React from 'react';
import { 
  Home, 
  BarChart3, 
  Table2, 
  Settings, 
  LogOut,
  X,
  Layers3,
  TrendingUp,
  Download
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  activeTab, 
  onTabChange 
}) => {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: '3d', label: 'Visualisation 3D', icon: Layers3 },
    { id: '2d', label: 'Graphiques 2D', icon: TrendingUp },
    { id: '2.5d', label: 'Vue 2.5D', icon: BarChart3 },
    { id: 'table', label: 'Résultats', icon: Table2 },
    { id: 'export', label: 'Export PDF', icon: Download },
    { id: 'settings', label: 'Paramètres', icon: Settings },
    { id: 'config', label: 'Configuration', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">LayerSight</h1>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            title="Fermer le menu"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-4 py-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={clsx(
                    "w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors",
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          {/* User section */}
          {user && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};