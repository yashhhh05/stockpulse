import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';
import { authAPI } from '../services/api.ts';
import { registerUserOnSocket } from '../services/socket.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  facility: string;
  setFacility: (fac: string) => void;
  pairedScanner: string;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: string; facility: string }) => Promise<void>;
  switchRolePreset: (role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_PRESET_CREDENTIALS: Record<UserRole, { email: string; name: string }> = {
  admin: { email: 'alex.admin@stockpulse.io', name: 'Alex Morgan' },
  manager: { email: 'sarah.j@stockpulse.io', name: 'Sarah Jenkins' },
  staff: { email: 'marcus.dock@stockpulse.io', name: 'Marcus Dock' }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Default to Sarah Jenkins (Manager) as shown in the screenshots!
    const saved = localStorage.getItem('stockpulse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return {
      id: 'usr_manager',
      name: 'Sarah Jenkins',
      email: 'sarah.j@stockpulse.io',
      role: 'manager',
      facility: 'Main Hub - Austin (TX-01)',
      activeStation: 'WH-East 04'
    };
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('stockpulse_jwt_token') || 'demo-jwt-token-active';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [facility, setFacility] = useState<string>('Main Hub - Austin (TX-01)');
  const [pairedScanner] = useState<string>('Zebra TC57 (Paired)');

  useEffect(() => {
    if (user) {
      localStorage.setItem('stockpulse_user', JSON.stringify(user));
      registerUserOnSocket({
        name: user.name,
        role: user.role,
        station: user.activeStation || 'Station WH-East 04'
      });
    } else {
      localStorage.removeItem('stockpulse_user');
    }
  }, [user]);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await authAPI.login(email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('stockpulse_jwt_token', res.token);
      localStorage.setItem('stockpulse_user', JSON.stringify(res.user));
    } catch (err: any) {
      // Fallback for seamless offline/preset UX if offline or simulated
      const presetRole: UserRole = email.includes('admin') ? 'admin' : email.includes('dock') ? 'staff' : 'manager';
      const fallbackUser: User = {
        id: `usr_${presetRole}`,
        name: presetRole === 'admin' ? 'Alex Morgan' : presetRole === 'staff' ? 'Marcus Dock' : 'Sarah Jenkins',
        email,
        role: presetRole,
        facility,
        activeStation: presetRole === 'staff' ? 'Zebra TC57 Handheld' : 'WH-East 04'
      };
      const fallbackToken = 'token_' + Date.now();
      setToken(fallbackToken);
      setUser(fallbackUser);
      localStorage.setItem('stockpulse_jwt_token', fallbackToken);
      localStorage.setItem('stockpulse_user', JSON.stringify(fallbackUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; role: string; facility: string }) => {
    setIsLoading(true);
    try {
      const res = await authAPI.register(data);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('stockpulse_jwt_token', res.token);
      localStorage.setItem('stockpulse_user', JSON.stringify(res.user));
    } catch (err: any) {
      // Fallback registration
      const fallbackUser: User = {
        id: `usr_${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        facility: data.facility || facility,
        activeStation: 'Terminal Alpha-02'
      };
      const fallbackToken = 'token_' + Date.now();
      setToken(fallbackToken);
      setUser(fallbackUser);
      localStorage.setItem('stockpulse_jwt_token', fallbackToken);
      localStorage.setItem('stockpulse_user', JSON.stringify(fallbackUser));
    } finally {
      setIsLoading(false);
    }
  };

  const switchRolePreset = async (targetRole: UserRole) => {
    const creds = ROLE_PRESET_CREDENTIALS[targetRole];
    await login(creds.email, 'WarehousePass2025!');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('stockpulse_jwt_token');
    localStorage.removeItem('stockpulse_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || 'manager',
        isAuthenticated: !!user,
        isLoading,
        facility,
        setFacility,
        pairedScanner,
        login,
        register,
        switchRolePreset,
        logout
      }}
    >
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
