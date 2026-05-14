import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export const SimpleCloud3D: React.FC<{ data: Array<{ x: number; y: number; z: number; color?: string }> }> = ({ data }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>('Initialisation...');

  useEffect(() => {
    if (!mountRef.current || !data.length) {
      setStatus('Pas de données ou pas de conteneur');
      return;
    }

    console.log('🎯 SimpleCloud3D: Début initialisation');
    setStatus('Création de la scène...');

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrame: number;

    const currentMount = mountRef.current;

    try {
      // Scène
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      setStatus('Scène créée');

      // Caméra
      camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);
      setStatus('Caméra créée');

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(800, 600);
      setStatus('Renderer créé');

      // Ajouter au DOM
      currentMount.appendChild(renderer.domElement);
      setStatus('Renderer ajouté au DOM');

      // Éclairage
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(1, 1, 1);
      scene.add(light);
      setStatus('Éclairage ajouté');

      // Points
      data.forEach((point, index) => {
        const geometry = new THREE.SphereGeometry(0.05);
        const material = new THREE.MeshBasicMaterial({ 
          color: point.color || `hsl(${index * 50}, 70%, 50%)` 
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(point.x, point.y, point.z);
        scene.add(sphere);
      });
      setStatus(`${data.length} points ajoutés`);

      // Animation
      const animate = () => {
        animationFrame = requestAnimationFrame(animate);
        
        // Rotation automatique
        scene.rotation.y += 0.005;
        
        renderer.render(scene, camera);
      };

      animate();
      setStatus('🎉 Rendu 3D actif !');

    } catch (error) {
      console.error('❌ Erreur SimpleCloud3D:', error);
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Inconnue'}`);
    }

    // Nettoyage
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (renderer && currentMount?.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [data]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Test Three.js Simple</h4>
      <div className="mb-2 text-xs text-gray-600">
        Status: {status}
      </div>
      <div 
        ref={mountRef} 
        className="w-full h-44 min-h-36 bg-gray-100 rounded"
      />
    </div>
  );
};