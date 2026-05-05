import { useState, useEffect, useRef } from 'react';
import { DataPoint3D, DataPoint2D, TableResult } from '../types';

export const useData = () => {
  const [data3D, setData3D] = useState<DataPoint3D[]>([]);
  const [data2D, setData2D] = useState<DataPoint2D[]>([]);
  const [tableData, setTableData] = useState<TableResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  useEffect(() => {
    isMountedRef.current = true;
    
    const generateData = async () => {
      if (!isMountedRef.current) return;
      
      try {
        setError(null);
        
        // Simuler un délai de chargement réaliste
        await new Promise((resolve, reject) => {
          const loadingTimeout = setTimeout(() => {
            if (isMountedRef.current) {
              resolve(true);
            }
          }, Math.min(1000 + (retryCount * 500), 3000));
          
          // Timeout de sécurité pour éviter le chargement infini
          const safetyTimeout = setTimeout(() => {
            clearTimeout(loadingTimeout);
            if (isMountedRef.current) {
              reject(new Error('Timeout de chargement des données'));
            }
          }, 10000);
          
          timeoutRef.current = safetyTimeout;
        });
        
        if (!isMountedRef.current) return;
        
        // Génération de données 3D
        const points3D: DataPoint3D[] = [];
        for (let i = 0; i < 200; i++) {
          if (!isMountedRef.current) return;
          
          const x = (Math.random() - 0.5) * 10;
          const y = (Math.random() - 0.5) * 10;
          const z = (Math.random() - 0.5) * 10;
          const value = Math.sqrt(x * x + y * y + z * z);
          
          points3D.push({
            x,
            y,
            z,
            value,
            label: `Point ${i + 1}`,
            color: `hsl(${Math.floor(value * 30)}, 70%, 50%)`
          });
        }
        
        // Génération de données 2D
        const points2D: DataPoint2D[] = [];
        for (let i = 0; i < 20; i++) {
          if (!isMountedRef.current) return;
          
          points2D.push({
            x: i,
            y: Math.sin(i * 0.5) * 5 + Math.random() * 2,
            label: `Série ${i + 1}`
          });
        }
        
        // Génération de données de tableau
        const results: TableResult[] = [];
        const categories = ['Analyse', 'Traitement', 'Validation', 'Export'];
        const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];
        
        for (let i = 0; i < 50; i++) {
          if (!isMountedRef.current) return;
          
          results.push({
            id: `result-${i + 1}`,
            name: `Résultat ${i + 1}`,
            value: Math.round(Math.random() * 1000),
            category: categories[Math.floor(Math.random() * categories.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
        
        if (isMountedRef.current) {
          setData3D(points3D);
          setData2D(points2D);
          setTableData(results);
          setError(null);
          setIsLoading(false);
          setRetryCount(0);
          
          console.log('Données chargées avec succès:', {
            points3D: points3D.length,
            points2D: points2D.length,
            results: results.length
          });
        }
      } catch (err) {
        console.error('Erreur lors de la génération des données:', err);
        
        if (isMountedRef.current) {
          if (retryCount < MAX_RETRIES) {
            console.log(`Tentative de rechargement ${retryCount + 1}/${MAX_RETRIES}...`);
            setRetryCount(prev => prev + 1);
            setError(`Chargement en cours... (tentative ${retryCount + 1}/${MAX_RETRIES})`);
            
            // Retry après un délai
            setTimeout(() => {
              if (isMountedRef.current) {
                generateData();
              }
            }, RETRY_DELAY);
          } else {
            // Charger des données de fallback minimales
            console.log('🔄 Chargement de données de fallback...');
            const fallbackData3D = [
              { x: 0, y: 0, z: 0, color: '#ff0000', label: 'Test Point 1', value: 1 },
              { x: 1, y: 1, z: 1, color: '#00ff00', label: 'Test Point 2', value: 2 },
              { x: -1, y: -1, z: -1, color: '#0000ff', label: 'Test Point 3', value: 3 }
            ];
            const fallbackData2D = [
              { x: 0, y: 10, label: 'Test 1' },
              { x: 1, y: 20, label: 'Test 2' },
              { x: 2, y: 15, label: 'Test 3' }
            ];
            const fallbackTableData = [
              { id: 'test-1', name: 'Données de test', value: 100, category: 'Test', status: 'active' as const, date: new Date().toISOString() }
            ];
            
            setData3D(fallbackData3D);
            setData2D(fallbackData2D);
            setTableData(fallbackTableData);
            setError('Utilisation de données de démonstration');
            setIsLoading(false);
          }
        }
      }
    };

    generateData();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [retryCount]);

  // Fonction pour forcer le rechargement des données
  const reloadData = () => {
    if (isMountedRef.current) {
      setIsLoading(true);
      setError(null);
      setRetryCount(0);
    }
  };

  return { 
    data3D, 
    data2D, 
    tableData, 
    isLoading, 
    error, 
    reloadData
  };
};