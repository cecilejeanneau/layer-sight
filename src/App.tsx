import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { LoginForm } from './components/Auth/LoginForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Cloud3D } from './components/Visualizations/Cloud3D';
import { SimpleCloud3D } from './components/Visualizations/SimpleCloud3D';
import { Chart2D } from './components/Visualizations/Chart2D';
import { Chart25D } from './components/Visualizations/Chart25D';
import { ResultsTable } from './components/Tables/ResultsTable';
import { PDFExport } from './components/Export/PDFExport';
import { AppSettings } from './components/Settings/AppSettings';
import { ConfigSettings } from './components/Settings/ConfigSettings';
import { RoleSwitch } from './components/Auth/RoleSwitch';
import { useAuthStore } from './stores/authStore';
import { useData } from './hooks/useData';
import { useNetworkStatus } from './hooks/useNetworkStatus';

function App() {
  const { isAuthenticated, user, updateActivity, checkSession } = useAuthStore();
  const { data3D, data2D, tableData, isLoading, error, reloadData } = useData();
  const networkStatus = useNetworkStatus();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNetworkBanner, setShowNetworkBanner] = useState(false);

  // Surveillance de l'activité utilisateur pour maintenir la session
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleUserActivity = () => {
      updateActivity();
    };

    // Ajouter les écouteurs d'événements
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Vérification périodique de la session
    const sessionInterval = setInterval(() => {
      if (!checkSession()) {
        console.log('Session expirée détectée dans App');
        clearInterval(sessionInterval);
      }
    }, 30000); // Vérifier toutes les 30 secondes

    return () => {
      // Nettoyer les écouteurs d'événements
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      clearInterval(sessionInterval);
    };
  }, [isAuthenticated, updateActivity, checkSession]);

  // Surveillance du réseau
  useEffect(() => {
    if (!networkStatus.isOnline) {
      setShowNetworkBanner(true);
      console.warn('Application hors ligne - fonctionnalités limitées');
    } else if (networkStatus.wasOffline) {
      setShowNetworkBanner(false);
      console.log('Connexion rétablie - tentative de synchronisation');
      // Recharger les données si nécessaire
      if (error && reloadData) {
        reloadData();
      }
    }
  }, [networkStatus.isOnline, networkStatus.wasOffline, error, reloadData]);

  // Gestion des erreurs de rechargement
  const handleRetry = useCallback(() => {
    console.log('Tentative de rechargement des données...');
    if (reloadData) {
      reloadData();
    } else {
      window.location.reload();
    }
  }, [reloadData]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de l'application</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={handleRetry}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Recharger la page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getTabTitle = (tab: string) => {
    const titles: Record<string, string> = {
      dashboard: 'Tableau de bord',
      '3d': 'Visualisation 3D',
      '2d': 'Graphiques 2D',
      '2.5d': 'Vue 2.5D',
      table: 'Tableau des résultats',
      export: 'Export PDF',
      settings: 'Paramètres',
      config: 'Configuration',
      auth: 'Gestion des rôles'
    };
    return titles[tab] || 'LayerSight';
  };

  const renderTabContent = () => {
    // Permissions based on user role
    const canAccess = (feature: string) => {
      if (!user) return false;
      
      switch (user.role) {
        case 'admin':
          return true;
        case 'user':
          return !['config'].includes(feature);
        case 'viewer':
          return ['dashboard', '3d', '2d', '2.5d', 'table'].includes(feature);
        default:
          return false;
      }
    };

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Chargement...</span>
        </div>
      );
    }

    if (!canAccess(activeTab)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-2">Accès restreint</p>
            <p className="text-sm text-gray-500">
              Votre rôle ({user?.role}) ne permet pas d'accéder à cette fonctionnalité.
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div key="dashboard">
            <Dashboard onNavigate={(tab) => setActiveTab(tab)} />
          </div>
        );
      case '3d':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Nuage de points 3D interactif
              </h3>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  🔍 <strong>Debug:</strong> {data3D.length} points chargés
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Cloud3D key="cloud3d" data={data3D} />
                <SimpleCloud3D data={data3D} />
              </div>
            </div>
          </div>
        );
      case '2d':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Chart2D key="chart2d-line" data={data2D} type="line" />
              <Chart2D key="chart2d-bar" data={data2D} type="bar" />
            </div>
          </div>
        );
      case '2.5d':
        return (
          <div className="space-y-6">
            <Chart25D key="chart25d" data={data3D} />
          </div>
        );
      case 'table':
        return <ResultsTable data={tableData} />;
      case 'export':
        return <PDFExport data3D={data3D} data2D={data2D} tableData={tableData} />;
      case 'settings':
        return <AppSettings key="app-settings" />;
      case 'config':
        return <ConfigSettings key="config-settings" />;
      case 'auth':
        return <RoleSwitch key="role-switch" />;
      default:
        return <Dashboard key="default-dashboard" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Bannière de statut réseau */}
      {showNetworkBanner && !networkStatus.isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 text-center text-sm">
          📡 Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.
        </div>
      )}
      
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={getTabTitle(activeTab)}
        />
        
        <main className={`flex-1 overflow-y-auto p-6 ${showNetworkBanner && !networkStatus.isOnline ? 'pt-12' : ''}`}>
          <div key={activeTab}>{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
}

export default App;