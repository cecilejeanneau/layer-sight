import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import { DataPoint3D } from '../../types';

interface Cloud3DProps {
  data: DataPoint3D[];
}

export const Cloud3D: React.FC<Cloud3DProps> = ({ data }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);
  const isMountedRef = useRef(true);
  const pointsGroupRef = useRef<THREE.Group | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);
  const mouseRef = useRef({
    isMouseDown: false,
    mouseX: 0,
    mouseY: 0,
    targetRotationX: 0,
    targetRotationY: 0
  });

  console.log('🎯 Cloud3D rendu avec', data.length, 'points');

  // Fonction de nettoyage des ressources THREE.js
  const cleanup = useCallback(() => {
    console.log('Nettoyage des ressources 3D...');
    
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    // Nettoyer les objets de la scène
    if (sceneRef.current) {
      sceneRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material?.dispose();
          }
        }
      });
      sceneRef.current.clear();
    }

    // Nettoyer le renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current.forceContextLoss();
      
      if (mountRef.current && rendererRef.current.domElement && 
          mountRef.current.contains(rendererRef.current.domElement)) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          console.warn('Erreur lors de la suppression du canvas:', e);
        }
      }
      rendererRef.current = null;
    }

    sceneRef.current = null;
    cameraRef.current = null;
    pointsGroupRef.current = null;
    isInitializedRef.current = false;
  }, []);

  // Gestionnaires d'événements souris
  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (!isMountedRef.current) return;
    mouseRef.current.isMouseDown = true;
    mouseRef.current.mouseX = event.clientX;
    mouseRef.current.mouseY = event.clientY;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isMountedRef.current) return;
    mouseRef.current.isMouseDown = false;
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isMountedRef.current || !mouseRef.current.isMouseDown) return;

    const deltaX = event.clientX - mouseRef.current.mouseX;
    const deltaY = event.clientY - mouseRef.current.mouseY;

    mouseRef.current.targetRotationX -= deltaY * 0.01;
    mouseRef.current.targetRotationY -= deltaX * 0.01;

    mouseRef.current.mouseX = event.clientX;
    mouseRef.current.mouseY = event.clientY;
  }, []);

  // Initialisation de la scène 3D
  useEffect(() => {
    if (!mountRef.current || isInitializedRef.current || !isMountedRef.current) return;
    
    console.log('Initialisation de la visualisation 3D...');
    
    try {
      isInitializedRef.current = true;

      // Vérification de la prise en charge de WebGL
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        const errorMsg = 'WebGL n\'est pas pris en charge par ce navigateur';
        console.error('❌', errorMsg);
        setInitError(errorMsg);
        setIsWebGLSupported(false);
        throw new Error(errorMsg);
      }
      
      console.log('✅ WebGL supporté');

      const container = mountRef.current;
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 600;

      // Configuration de la scène
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8fafc);
      sceneRef.current = scene;

      // Configuration de la caméra
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(15, 15, 15);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Configuration du renderer avec options optimisées
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Éclairage optimisé
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(50, 50, 50);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.setScalar(512); // Réduire la résolution des ombres
      scene.add(directionalLight);

      // Grille de référence
      const gridHelper = new THREE.GridHelper(20, 20, 0xcccccc);
      scene.add(gridHelper);

      // Axes de référence
      const axesHelper = new THREE.AxesHelper(10);
      scene.add(axesHelper);

      // Groupe pour les points de données
      const pointsGroup = new THREE.Group();
      pointsGroup.userData.isDataPointsGroup = true;
      scene.add(pointsGroup);
      pointsGroupRef.current = pointsGroup;

      // Événements de la souris
      renderer.domElement.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);

      // Boucle d'animation
      const animate = () => {
        if (!isMountedRef.current || !rendererRef.current || !cameraRef.current || !sceneRef.current) {
          return;
        }
        
        try {
          const mouse = mouseRef.current;
          camera.position.x = Math.cos(mouse.targetRotationY) * 20;
          camera.position.y = Math.sin(mouse.targetRotationX) * 20;
          camera.position.z = Math.sin(mouse.targetRotationY) * 20;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
          frameRef.current = requestAnimationFrame(animate);
        } catch (error) {
          console.error('Erreur dans la boucle d\'animation:', error);
        }
      };

      animate();

      console.log('Visualisation 3D initialisée avec succès');

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la visualisation 3D:', error);
      setInitError(error instanceof Error ? error.message : 'Erreur d\'initialisation 3D');
      setIsWebGLSupported(false);
      cleanup();
    }
  }, [cleanup, handleMouseDown, handleMouseUp, handleMouseMove]);

  // Mise à jour des données
  useEffect(() => {
    if (!pointsGroupRef.current || !data.length || !isMountedRef.current) return;

    try {
      console.log('Mise à jour des points 3D:', data.length, 'points');
      
      const pointsGroup = pointsGroupRef.current;
      
      // Nettoyer les anciens points
      while (pointsGroup.children.length > 0) {
        const child = pointsGroup.children[0];
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material?.dispose();
          }
        }
        pointsGroup.remove(child);
      }

      // Géométrie et matériel réutilisables pour optimiser les performances
      const geometry = new THREE.SphereGeometry(0.1, 8, 8); // Réduire les segments
      const materials = new Map<string, THREE.MeshLambertMaterial>();

      // Ajouter les nouveaux points
      data.forEach((point, index) => {
        if (!isMountedRef.current) return;
        
        const color = point.color || '#3b82f6';
        
        // Réutiliser les matériaux pour les couleurs identiques
        let material = materials.get(color);
        if (!material) {
          material = new THREE.MeshLambertMaterial({ color });
          materials.set(color, material);
        }
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(point.x, point.y, point.z);
        sphere.castShadow = false; // Désactiver les ombres pour les performances
        sphere.userData.isDataPoint = true;
        sphere.userData.label = point.label;
        sphere.userData.value = point.value;
        sphere.userData.index = index;
        
        pointsGroup.add(sphere);
      });

      console.log('Points 3D mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données 3D:', error);
    }
  }, [data]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      console.log('Démontage du composant Cloud3D');
      isMountedRef.current = false;
      
      // Supprimer les événements
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      
      // Nettoyer les ressources THREE.js
      cleanup();
    };
  }, [cleanup, handleMouseUp, handleMouseMove]);

  // Affichage conditionnel selon l'état
  if (!isWebGLSupported || initError) {
    return (
      <div className="w-full h-96 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Problème de rendu 3D
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {initError || 'WebGL n\'est pas supporté par votre navigateur'}
          </p>
          <div className="text-xs text-gray-500">
            <p>Solutions possibles :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Activez l'accélération matérielle dans votre navigateur</li>
              <li>Mettez à jour votre navigateur</li>
              <li>Essayez avec Chrome ou Firefox</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-gray-50 rounded-lg overflow-hidden relative">
      <div ref={mountRef} className="w-full h-full" />
      {!data.length && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-white bg-opacity-75">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>Aucune donnée à afficher</p>
          </div>
        </div>
      )}
      {data.length > 0 && !isInitializedRef.current && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-white bg-opacity-75">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2 mx-auto"></div>
            <p>Initialisation de la visualisation 3D...</p>
          </div>
        </div>
      )}
    </div>
  );
};