import React from 'react';
import { BarChart3, Database, TrendingUp, Users } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { useAuthStore } from '../../stores/authStore';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { data3D, data2D, tableData, isLoading } = useData();
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Chargement des données...</span>
      </div>
    );
  }

  const stats = [
    {
      title: 'Points 3D',
      value: data3D.length,
      icon: BarChart3,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Points 2D',
      value: data2D.length,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Résultats',
      value: tableData.length,
      icon: Database,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Utilisateurs actifs',
      value: 1,
      icon: Users,
      color: 'bg-orange-500',
      change: 'En ligne'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Bienvenue, {user?.name} !
        </h2>
        <p className="text-blue-100">
          Votre tableau de bord de visualisation de données multicouches
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">ce mois</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate?.('3d')}
              className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              📊 Nouvelle visualisation 3D
            </button>
            <button 
              onClick={() => onNavigate?.('2d')}
              className="w-full text-left px-4 py-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              📈 Analyser les données 2D
            </button>
            <button 
              onClick={() => onNavigate?.('export')}
              className="w-full text-left px-4 py-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
            >
              📋 Générer un rapport
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Résultats récents</h3>
          <div className="space-y-3">
            {tableData.slice(0, 3).map((result, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{result.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {result.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">État du système</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Connexion API</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                ✅ Opérationnel
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Base de données</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                ✅ Connecté
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Performances</span>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                ⚡ Optimales
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};