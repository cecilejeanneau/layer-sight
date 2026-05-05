import React from 'react';
import { Shield, User, Eye } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const RoleSwitch: React.FC = () => {
  const { user, switchRole } = useAuthStore();

  const roles = [
    { 
      id: 'admin' as const, 
      label: 'Administrateur', 
      icon: Shield, 
      description: 'Accès complet à toutes les fonctionnalités',
      color: 'text-red-600 bg-red-50 border-red-200'
    },
    { 
      id: 'user' as const, 
      label: 'Utilisateur', 
      icon: User, 
      description: 'Accès aux visualisations et à la configuration',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    { 
      id: 'viewer' as const, 
      label: 'Visiteur', 
      icon: Eye, 
      description: 'Accès en lecture seule aux visualisations',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Gestion des Rôles</h3>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <img 
              src={user?.avatar} 
              alt={user?.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h4 className="font-medium text-blue-900">{user?.name}</h4>
              <p className="text-sm text-blue-700">{user?.email}</p>
              <p className="text-xs text-blue-600 capitalize font-medium">
                Rôle actuel: {user?.role}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 mb-3">Changer de rôle:</h4>
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = user?.role === role.id;
            
            return (
              <button
                key={role.id}
                onClick={() => switchRole(role.id)}
                className={`w-full p-4 rounded-lg border transition-all ${
                  isActive
                    ? `${role.color} border-2`
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start">
                  <Icon className={`w-6 h-6 mr-3 ${
                    isActive ? role.color.split(' ')[0] : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className="flex items-center">
                      <h5 className={`font-medium ${
                        isActive ? role.color.split(' ')[0] : 'text-gray-900'
                      }`}>
                        {role.label}
                      </h5>
                      {isActive && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Actuel
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      isActive ? role.color.split(' ')[0] : 'text-gray-600'
                    }`}>
                      {role.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Permissions par rôle</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li><strong>Administrateur:</strong> Toutes les fonctionnalités + gestion des utilisateurs</li>
            <li><strong>Utilisateur:</strong> Visualisations, tableaux, export PDF, paramètres</li>
            <li><strong>Visiteur:</strong> Visualisations et tableaux en lecture seule</li>
          </ul>
        </div>
      </div>
    </div>
  );
};