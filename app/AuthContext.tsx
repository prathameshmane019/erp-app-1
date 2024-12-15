
// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { User } from './types/auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface AuthContextType {
  user: User | null;
  login: (_id: string, password: string, role: 'faculty' | 'student') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const userJson = await SecureStore.getItemAsync('user');
      const token = await SecureStore.getItemAsync('token');
      if (userJson && token) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    }
    setLoading(false);
  };

  const login = async (_id: string, password: string, role: 'faculty' | 'student') => {
    try {
      const response = await fetch(`${API_URL}/api/applogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id, password, role })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      await SecureStore.setItemAsync('token', data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));
      setUser(data.user);
      router.replace('/(faculty)');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
