import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import type { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(undefined);

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure MetaMask is unlocked.');
      }

      const address = accounts[0];
      setUser({
        address,
        isConnected: true,
      });

      // Store connection state in localStorage for persistence
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_address', address);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setUser(null);
    setError(undefined);
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const wasConnected = localStorage.getItem('wallet_connected');
      const savedAddress = localStorage.getItem('wallet_address');

      if (wasConnected && savedAddress && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0 && accounts[0].address.toLowerCase() === savedAddress.toLowerCase()) {
            setUser({
              address: savedAddress,
              isConnected: true,
            });
          } else {
            // Clear stale data
            localStorage.removeItem('wallet_connected');
            localStorage.removeItem('wallet_address');
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
          localStorage.removeItem('wallet_connected');
          localStorage.removeItem('wallet_address');
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (user && accounts[0].toLowerCase() !== user.address.toLowerCase()) {
          setUser({
            address: accounts[0],
            isConnected: true,
          });
          localStorage.setItem('wallet_address', accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
