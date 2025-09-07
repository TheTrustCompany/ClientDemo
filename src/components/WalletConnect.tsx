import React from 'react';
import { Wallet, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const WalletConnect: React.FC = () => {
  const { user, isLoading, error, connectWallet, disconnectWallet } = useAuth();

  if (user?.isConnected) {
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <Wallet className="wallet-icon" />
          <div className="wallet-details">
            <span className="wallet-status">Connected</span>
            <span className="wallet-address">
              {user.address.slice(0, 6)}...{user.address.slice(-4)}
            </span>
          </div>
        </div>
        <button 
          onClick={disconnectWallet}
          className="disconnect-button"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <div className="connect-card">
        <div className="connect-header">
          <Wallet className="connect-icon" />
          <h2>Connect Your Wallet</h2>
          <p>Connect with MetaMask to access the dispute resolution platform</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="connect-button"
        >
          {isLoading ? (
            <>
              <Loader2 className="loading-icon" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="button-icon" />
              Connect MetaMask
            </>
          )}
        </button>

        <div className="connect-footer">
          <p>
            Don't have MetaMask?{' '}
            <a 
              href="https://metamask.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="install-link"
            >
              Install it here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
