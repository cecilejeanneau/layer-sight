import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sessionTimeout: NodeJS.Timeout | null;
  lastActivity: number;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: User['role']) => void;
  updateActivity: () => void;
  checkSession: () => boolean;
  startSessionCheck: () => void;
}

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // 1 minute
let sessionCheckInterval: NodeJS.Timeout | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  sessionTimeout: null,
  lastActivity: Date.now(),
  
  login: async (email: string, _password: string) => {
    try {
      // Simulation d'authentification avec timeout de connexion
      const loginPromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('Timeout de connexion - Vérifiez votre connexion internet'));
        }, 10000);
        
        setTimeout(() => {
          clearTimeout(timer);
          resolve(true);
        }, 1000);
      });
      
      await loginPromise;
      
      const mockUser: User = {
        id: '1',
        name: 'Jean Dupont',
        email,
        role: 'admin',
        avatar: `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`
      };
      
      const now = Date.now();
      const sessionExpiry = setTimeout(() => {
        console.log('Session expirée automatiquement');
        get().logout();
      }, SESSION_DURATION);
      
      set({ 
        user: mockUser, 
        isAuthenticated: true,
        lastActivity: now,
        sessionTimeout: sessionExpiry
      });
      
      // Démarrer la vérification de session
      get().startSessionCheck();
      
      console.log('Connexion réussie, session valide pour 30 minutes');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      set({ isAuthenticated: false, user: null });
      throw new Error('Échec de la connexion. Veuillez réessayer.');
    }
  },
  
  logout: () => {
    const state = get();
    
    // Nettoyer les timeouts et intervalles
    if (state.sessionTimeout) {
      clearTimeout(state.sessionTimeout);
    }
    
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
      sessionCheckInterval = null;
    }
    
    set({ 
      user: null, 
      isAuthenticated: false,
      sessionTimeout: null,
      lastActivity: Date.now()
    });
    
    console.log('Déconnexion effectuée');
  },
  
  switchRole: (role: User['role']) => {
    set((state: AuthState) => ({
      user: state.user ? { ...state.user, role } : null,
      lastActivity: Date.now()
    }));
    
    get().updateActivity();
  },
  
  updateActivity: () => {
    const now = Date.now();
    const state = get();
    
    if (state.isAuthenticated) {
      // Réinitialiser le timeout de session
      if (state.sessionTimeout) {
        clearTimeout(state.sessionTimeout);
      }
      
      const newSessionTimeout = setTimeout(() => {
        console.log('Session expirée par inactivité');
        get().logout();
      }, SESSION_DURATION);
      
      set({
        lastActivity: now,
        sessionTimeout: newSessionTimeout
      });
    }
  },
  
  checkSession: () => {
    const state = get();
    
    if (!state.isAuthenticated) {
      return false;
    }
    
    const now = Date.now();
    const timeSinceActivity = now - state.lastActivity;
    
    // Vérifier si la session est toujours valide
    if (timeSinceActivity > SESSION_DURATION) {
      console.log('Session expirée: inactivité trop longue');
      get().logout();
      return false;
    }
    
    return true;
  },
  
  startSessionCheck: () => {
    // Nettoyer l'ancien intervalle s'il existe
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
    }
    
    sessionCheckInterval = setInterval(() => {
      const isValid = get().checkSession();
      if (!isValid && sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
        sessionCheckInterval = null;
      }
    }, ACTIVITY_CHECK_INTERVAL);
  }
}));