import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
  downlink?: number;
  effectiveType?: string;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    wasOffline: false,
    downlink: (navigator as any).connection?.downlink,
    effectiveType: (navigator as any).connection?.effectiveType,
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection;
      
      setNetworkStatus(prev => ({
        isOnline: navigator.onLine,
        wasOffline: prev.isOnline && !navigator.onLine,
        downlink: connection?.downlink,
        effectiveType: connection?.effectiveType,
      }));
    };

    const handleOnline = () => {
      console.log('🌐 Connexion internet rétablie');
      updateNetworkStatus();
    };

    const handleOffline = () => {
      console.warn('📡 Connexion internet perdue');
      updateNetworkStatus();
    };

    const handleConnectionChange = () => {
      console.log('📶 Changement de connexion détecté');
      updateNetworkStatus();
    };

    // Écouter les événements de connectivité
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Écouter les changements de connexion (si disponible)
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Vérification périodique de la connectivité
    const checkConnectivity = async () => {
      try {
        // Tenter une requête vers une ressource légère
        const response = await fetch('/favicon.ico', {
          method: 'HEAD',
          cache: 'no-cache',
        });
        
        if (!response.ok && navigator.onLine) {
          console.warn('⚠️ Connexion internet instable détectée');
        }
      } catch (error) {
        if (navigator.onLine) {
          console.warn('⚠️ Problème de connectivité détecté:', error);
        }
      }
    };

    const connectivityInterval = setInterval(checkConnectivity, 30000); // Vérifier toutes les 30 secondes

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
      
      clearInterval(connectivityInterval);
    };
  }, []);

  return networkStatus;
};