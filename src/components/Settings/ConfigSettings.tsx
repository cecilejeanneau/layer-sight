import React, { useState } from 'react';
import { Database, RefreshCw, Layers, Palette, Grid2x2 as Grid, Save } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

export const ConfigSettings: React.FC = () => {
  const { configSettings, updateConfigSettings } = useSettingsStore();
  const [formData, setFormData] = useState(configSettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfigSettings(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Configuration Avancée</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source de données */}
          <div>
            <div className="flex items-center mb-2">
              <Database className="w-5 h-5 text-gray-400 mr-2" />
              <label className="block text-sm font-medium text-gray-700">
                Source de données
              </label>
            </div>
            <input
              type="text"
              id="dataSource"
              name="dataSource"
              value={formData.dataSource}
              onChange={(e) => handleInputChange('dataSource', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="api/v1/data"
            />
            <p className="mt-1 text-xs text-gray-500">
              URL de l'API ou chemin vers les données
            </p>
          </div>

          {/* Intervalle de rafraîchissement */}
          <div>
            <div className="flex items-center mb-2">
              <RefreshCw className="w-5 h-5 text-gray-400 mr-2" />
              <label className="block text-sm font-medium text-gray-700">
                Intervalle de rafraîchissement (ms)
              </label>
            </div>
            <input
              type="number"
              id="refreshInterval"
              name="refreshInterval"
              min="1000"
              max="300000"
              step="1000"
              value={formData.refreshInterval}
              onChange={(e) => handleInputChange('refreshInterval', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Intervalle de rafraîchissement"
            />
            <p className="mt-1 text-xs text-gray-500">
              Fréquence de mise à jour des données (minimum: 1 seconde)
            </p>
          </div>

          {/* Nombre maximum de points */}
          <div>
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-gray-400 mr-2" />
              <label className="block text-sm font-medium text-gray-700">
                Nombre maximum de points de données
              </label>
            </div>
            <input
              type="number"
              min="100"
              max="10000"
              step="100"
              value={formData.maxDataPoints}
              onChange={(e) => handleInputChange('maxDataPoints', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              id="maxDataPoints"
              name="maxDataPoints"
              title="Nombre maximum de points de données"
            />
            <p className="mt-1 text-xs text-gray-500">
              Limite pour optimiser les performances
            </p>
          </div>

          {/* Visualisation par défaut */}
          <div>
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-gray-400 mr-2" />
              <label className="block text-sm font-medium text-gray-700">
                Type de visualisation par défaut
              </label>
            </div>
            <select
              id="defaultVisualization"
              name="defaultVisualization"
              value={formData.defaultVisualization}
              onChange={(e) => handleInputChange('defaultVisualization', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Type de visualisation par défaut"
            >
              <option value="2d">Graphiques 2D</option>
              <option value="3d">Visualisation 3D</option>
              <option value="2.5d">Vue 2.5D</option>
            </select>
          </div>

          {/* Schéma de couleurs */}
          <div>
            <div className="flex items-center mb-2">
              <Palette className="w-5 h-5 text-gray-400 mr-2" />
              <label className="block text-sm font-medium text-gray-700">
                Schéma de couleurs
              </label>
            </div>
            <select
              id="colorScheme"
              name="colorScheme"
              value={formData.colorScheme}
              onChange={(e) => handleInputChange('colorScheme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Schéma de couleurs"
            >
              <option value="viridis">Viridis (Vert-Bleu-Violet)</option>
              <option value="plasma">Plasma (Rose-Violet-Jaune)</option>
              <option value="inferno">Inferno (Noir-Rouge-Jaune)</option>
              <option value="rainbow">Arc-en-ciel</option>
              <option value="grayscale">Niveaux de gris</option>
            </select>
          </div>

          {/* Taille de la grille */}
          <div>
            <div className="flex items-center mb-2">
              <Grid className="w-5 h-5 text-gray-400 mr-2" />
              <label className="block text-sm font-medium text-gray-700">
                Taille de la grille
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={formData.gridSize}
                onChange={(e) => handleInputChange('gridSize', parseInt(e.target.value))}
                className="flex-1"
                id="gridSize"
                name="gridSize"
                title="Taille de la grille"
              />
              <span className="text-sm font-mono text-gray-600 w-12">
                {formData.gridSize}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Résolution de la grille pour les visualisations
            </p>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder la configuration
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ Attention</h4>
          <p className="text-sm text-yellow-700">
            Certains paramètres nécessitent un rechargement de la page pour prendre effet.
            Les modifications de performance peuvent affecter la fluidité de l'application.
          </p>
        </div>
      </div>
    </div>
  );
};