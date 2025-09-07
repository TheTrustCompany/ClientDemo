import React, { useState } from 'react';
import { FileText, Shield, User, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { useEvidence } from '../hooks/useEvidence';
import type { Evidence } from '../types';

const EvidenceView: React.FC = () => {
  const { 
    isLoading, 
    error, 
    opposerEvidence, 
    defenderEvidence, 
    addEvidence 
  } = useEvidence();
  
  const [activeTab, setActiveTab] = useState<'opposer' | 'defender'>('opposer');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvidence, setNewEvidence] = useState({
    title: '',
    description: '',
    submittedBy: 'opposer' as 'opposer' | 'defender',
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidence.title.trim() || !newEvidence.description.trim()) return;

    try {
      await addEvidence(newEvidence);
      setNewEvidence({ title: '', description: '', submittedBy: 'opposer' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add evidence:', err);
    }
  };

  const renderEvidenceList = (evidenceList: Evidence[], title: string, icon: React.ReactNode) => (
    <div className="evidence-section">
      <div className="section-header">
        {icon}
        <h3>{title}</h3>
        <span className="evidence-count">({evidenceList.length})</span>
      </div>
      
      {evidenceList.length === 0 ? (
        <div className="empty-evidence">
          <FileText className="empty-icon" />
          <p>No evidence submitted yet</p>
        </div>
      ) : (
        <div className="evidence-list">
          {evidenceList.map((evidence: Evidence) => (
            <div key={evidence.id} className="evidence-card">
              <div className="evidence-header">
                <div className="evidence-title-section">
                  <h4 className="evidence-title">{evidence.title}</h4>
                  <div className="evidence-status">
                    {evidence.isFactChecked ? (
                      <>
                        <CheckCircle className="status-icon verified" />
                        <span className="status-text verified">Fact-checked</span>
                      </>
                    ) : (
                      <>
                        <Clock className="status-icon pending" />
                        <span className="status-text pending">Under review</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="evidence-meta">
                  <span className="evidence-date">
                    {formatDate(evidence.submittedAt)}
                  </span>
                </div>
              </div>
              
              <div className="evidence-content">
                <p className="evidence-description">{evidence.description}</p>
                
                {evidence.attachments && evidence.attachments.length > 0 && (
                  <div className="evidence-attachments">
                    <strong>Attachments:</strong>
                    <ul>
                      {evidence.attachments.map((attachment, index) => (
                        <li key={index} className="attachment-item">
                          <FileText className="attachment-icon" />
                          <span>{attachment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="evidence-loading">
        <Clock className="loading-icon" />
        <p>Loading evidence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evidence-error">
        <AlertCircle className="error-icon" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="evidence-view">
      <div className="evidence-header">
        <FileText className="header-icon" />
        <div className="header-content">
          <h2>Evidence Management</h2>
          <p>Review and manage evidence submitted by both parties in this dispute.</p>
        </div>
        <button 
          className="add-evidence-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="button-icon" />
          Add Evidence
        </button>
      </div>

      {showAddForm && (
        <div className="add-evidence-form">
          <form onSubmit={handleAddEvidence}>
            <div className="form-header">
              <h3>Submit New Evidence</h3>
            </div>
            
            <div className="form-group">
              <label>Submitted By:</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="opposer"
                    checked={newEvidence.submittedBy === 'opposer'}
                    onChange={(e) => setNewEvidence(prev => ({ 
                      ...prev, 
                      submittedBy: e.target.value as 'opposer' 
                    }))}
                  />
                  <User className="radio-icon" />
                  <span>Opposer</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="defender"
                    checked={newEvidence.submittedBy === 'defender'}
                    onChange={(e) => setNewEvidence(prev => ({ 
                      ...prev, 
                      submittedBy: e.target.value as 'defender' 
                    }))}
                  />
                  <Shield className="radio-icon" />
                  <span>Defender</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="evidence-title">Evidence Title:</label>
              <input
                id="evidence-title"
                type="text"
                value={newEvidence.title}
                onChange={(e) => setNewEvidence(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter a descriptive title for your evidence"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="evidence-description">Description:</label>
              <textarea
                id="evidence-description"
                value={newEvidence.description}
                onChange={(e) => setNewEvidence(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide a detailed description of your evidence"
                rows={4}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowAddForm(false)} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="submit-button">
                <FileText className="button-icon" />
                Submit Evidence
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="evidence-tabs">
        <button
          className={`tab-button ${activeTab === 'opposer' ? 'active' : ''}`}
          onClick={() => setActiveTab('opposer')}
        >
          <User className="tab-icon" />
          Opposer Evidence
        </button>
        <button
          className={`tab-button ${activeTab === 'defender' ? 'active' : ''}`}
          onClick={() => setActiveTab('defender')}
        >
          <Shield className="tab-icon" />
          Defender Evidence
        </button>
      </div>

      <div className="evidence-content">
        {activeTab === 'opposer' && renderEvidenceList(
          opposerEvidence, 
          'Opposer Evidence', 
          <User className="section-icon" />
        )}
        {activeTab === 'defender' && renderEvidenceList(
          defenderEvidence, 
          'Defender Evidence', 
          <Shield className="section-icon" />
        )}
      </div>
    </div>
  );
};

export default EvidenceView;
