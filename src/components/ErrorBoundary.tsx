import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('ErrorBoundary a capturé une erreur:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Détails de l\'erreur capturée:', error, errorInfo);
    
    // Ici vous pourriez envoyer l'erreur à un service de logging
    // comme Sentry, LogRocket, etc.
  }

  handleReload = () => {
    // Réinitialiser l'état d'erreur
    this.setState({ hasError: false, error: undefined });
    
    // Forcer le rechargement si nécessaire
    setTimeout(() => {
      if (this.state.hasError) {
        window.location.reload();
      }
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💥</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oups ! Une erreur s'est produite
            </h1>
            
            <p className="text-gray-600 mb-4">
              L'application a rencontré un problème inattendu. 
              Ne vous inquiétez pas, vos données sont en sécurité.
            </p>
            
            {this.state.error && (
              <details className="mb-4 p-3 bg-gray-50 rounded-lg text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  Détails techniques
                </summary>
                <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap overflow-auto">
                  {this.state.error.name}: {this.state.error.message}
                  {this.state.error.stack && '\n\n' + this.state.error.stack}
                </pre>
              </details>
            )}
            
            <div className="space-y-2">
              <button
                onClick={this.handleReload}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔄 Réessayer
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                🔃 Recharger la page
              </button>
            </div>
            
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 <strong>Conseil:</strong> Si le problème persiste, essayez de vider le cache de votre navigateur 
                ou contactez le support technique.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}