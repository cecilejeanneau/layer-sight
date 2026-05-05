import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Gestion globale des erreurs non capturées
window.addEventListener('error', (event) => {
  console.error('Erreur globale capturée:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesse rejetée non gérée:', event.reason);
  event.preventDefault(); // Empêcher l'affichage dans la console du navigateur
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
