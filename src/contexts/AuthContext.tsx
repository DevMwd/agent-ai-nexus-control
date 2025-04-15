
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'base' | 'admin' | 'owner';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isOwner: () => boolean;
  isBaseUser: () => boolean;
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
      profileImage: email.includes('owner') ? '/lovable-uploads/695db59c-0b86-4a3f-afbe-6cf313ac93e5.png' : undefined,
      organizationId: email.includes('owner') ? undefined : '1',
      organizationName: email.includes('owner') ? undefined : 'MWD'
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

  const isBaseUser = () => {
    return user?.role === 'base';
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
        isBaseUser,
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
