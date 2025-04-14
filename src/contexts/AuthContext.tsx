
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'base' | 'admin' | 'owner';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isOwner: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we're setting a mock user
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email: email,
      role: email.includes('admin') ? 'admin' : email.includes('owner') ? 'owner' : 'base',
    };
    
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'owner';
  };

  const isOwner = () => {
    return user?.role === 'owner';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isAdmin,
        isOwner,
      }}
    >
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
