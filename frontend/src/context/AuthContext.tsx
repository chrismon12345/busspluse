import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'authority' | 'operator';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  avatarBg: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile;
  login: (role: UserRole, email?: string, name?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const defaultAuthorityUser: UserProfile = {
  name: 'Director Rajesh Kumar',
  email: 'official@busplus.gov.in',
  role: 'authority',
  roleTitle: 'Municipal Infrastructure Director',
  department: 'Public Works & Roads Dept',
  avatarBg: 'bg-blue-600',
};

const defaultOperatorUser: UserProfile = {
  name: 'Anil Varma',
  email: 'operator@busplus.transit',
  role: 'operator',
  roleTitle: 'KSRTC Fleet Supervisor',
  department: 'Transit Operations Div',
  avatarBg: 'bg-amber-600',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(defaultAuthorityUser);

  const login = (role: UserRole, email?: string, name?: string) => {
    setIsAuthenticated(true);
    if (role === 'authority') {
      setUser({
        ...defaultAuthorityUser,
        email: email || defaultAuthorityUser.email,
        name: name || defaultAuthorityUser.name,
      });
    } else {
      setUser({
        ...defaultOperatorUser,
        email: email || defaultOperatorUser.email,
        name: name || defaultOperatorUser.name,
      });
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (role: UserRole) => {
    if (role === 'authority') {
      setUser(defaultAuthorityUser);
    } else {
      setUser(defaultOperatorUser);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
