import React, { useRef, useEffect } from 'react';
import { DataPoint3D } from '../../types';

interface Chart25DProps {
  data: DataPoint3D[];
}

export const Chart25D: React.FC<Chart25DProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Configuration du canvas
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const width = rect.width;
      const height = rect.height;

      // Effacer le canvas
      ctx.clearRect(0, 0, width, height);

      // Trouver les limites des données
      const xMin = Math.min(...data.map(p => p.x));
      const xMax = Math.max(...data.map(p => p.x));
      const yMin = Math.min(...data.map(p => p.y));
      const yMax = Math.max(...data.map(p => p.y));
      const zMin = Math.min(...data.map(p => p.z));
      const zMax = Math.max(...data.map(p => p.z));

      // Fonction de mapping des couleurs basée sur la valeur Z
      const getColor = (z: number) => {
        const normalized = (zMax - zMin) === 0 ? 0 : (z - zMin) / (zMax - zMin);
        const hue = (1 - normalized) * 240; // Du bleu (240) au rouge (0)
        return `hsl(${hue}, 70%, 50%)`;
      };

      // Dessiner une grille de fond
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= 10; i++) {
        const x = (i / 10) * width;
        const y = (i / 10) * height;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Dessiner les points avec couleur basée sur Z
      data.forEach(point => {
        const x = (xMax - xMin) === 0 ? width / 2 : ((point.x - xMin) / (xMax - xMin)) * (width - 40) + 20;
        const y = (yMax - yMin) === 0 ? height / 2 : height - ((point.y - yMin) / (yMax - yMin)) * (height - 40) - 20;
        
        // Taille du point basée sur la valeur Z
        const size = (zMax - zMin) === 0 ? 5 : 3 + ((point.z - zMin) / (zMax - zMin)) * 8;
        
        ctx.fillStyle = getColor(point.z);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Ombre pour donner un effet 3D
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(x + 1, y + 1, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Légende des couleurs
      const legendWidth = 20;
      const legendHeight = height - 100;
      const legendX = width - 40;
      const legendY = 50;

      // Gradient de légende
      const gradient = ctx.createLinearGradient(0, legendY, 0, legendY + legendHeight);
      for (let i = 0; i <= 10; i++) {
        const position = i / 10;
        const z = zMin + (zMax - zMin) * (1 - position);
        gradient.addColorStop(position, getColor(z));
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(legendX, legendY, legendWidth, legendHeight);

      // Bordure de la légende
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);

      // Étiquettes de la légende
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      
      ctx.fillText(zMax.toFixed(2), legendX + legendWidth + 5, legendY + 5);
      ctx.fillText(((zMax + zMin) / 2).toFixed(2), legendX + legendWidth + 5, legendY + legendHeight / 2);
      ctx.fillText(zMin.toFixed(2), legendX + legendWidth + 5, legendY + legendHeight - 5);

    } catch (error) {
      console.error('Erreur lors du rendu 2.5D:', error);
    }
  }, [data]);

  return (
    <div className="w-full h-96 bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Visualisation 2.5D - Couleur = Dimension Z
      </h3>
      <canvas
        ref={canvasRef}
        className="w-full h-80 border border-gray-200 rounded"
      />
    </div>
  );
};