import React, { useState } from 'react';
import { MessageSquare, FileText, Scale, User } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import WalletConnect from './components/WalletConnect';
import ChatInterface from './components/ChatInterface';
import PoliciesView from './components/PoliciesView';
import EvidenceView from './components/EvidenceView';
import './App.css';

type Tab = 'chat' | 'policies' | 'evidence';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  if (!user?.isConnected) {
    return <WalletConnect />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'policies':
        return <PoliciesView />;
      case 'evidence':
        return <EvidenceView />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <Scale className="app-logo" />
            <div className="app-title">
              <h1>Dispute Resolution Platform</h1>
              <p>Blockchain-powered evidence and policy management</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <User className="user-icon" />
              <span className="user-address">
                {user.address.slice(0, 6)}...{user.address.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <nav className="app-navigation">
        <button
          className={`nav-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare className="nav-icon" />
          <span>Chat</span>
        </button>
        <button
          className={`nav-button ${activeTab === 'policies' ? 'active' : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          <FileText className="nav-icon" />
          <span>Policies</span>
        </button>
        <button
          className={`nav-button ${activeTab === 'evidence' ? 'active' : ''}`}
          onClick={() => setActiveTab('evidence')}
        >
          <Scale className="nav-icon" />
          <span>Evidence</span>
        </button>
      </nav>

      <main className="app-main">
        {renderTabContent()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
