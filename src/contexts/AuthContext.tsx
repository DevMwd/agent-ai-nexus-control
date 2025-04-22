
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'owner';
  name?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  isOwner: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call
      // For demo, we'll simulate a successful login with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a default user
      const mockUser: User = {
        id: '1',
        username: 'demo_user',
        email: email,
        role: 'owner', // Use 'admin' for admin privileges, 'owner' for highest level
        name: 'Demo User',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => !!user;
  
  const isAdmin = () => isAuthenticated() && (user?.role === 'admin' || user?.role === 'owner');

  const isOwner = () => isAuthenticated() && user?.role === 'owner';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      isAdmin,
      isOwner,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
