import React, { useState } from 'react';
import { FileText, Shield, User, Clock, CheckCircle, AlertCircle, Plus, Upload, X } from 'lucide-react';
import { useEvidence } from '../hooks/useEvidence';
import { useAuth } from '../contexts/AuthContext';
import type { Evidence } from '../types';

const EvidenceView: React.FC = () => {
  const { user } = useAuth();
  const { 
    isLoading, 
    error, 
    claimantEvidence, 
    defendantEvidence, 
    addEvidence 
  } = useEvidence();
  
  const [activeTab, setActiveTab] = useState<'claimant' | 'defendant'>('claimant');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [newEvidence, setNewEvidence] = useState({
    title: '',
    description: '',
    submittedBy: user?.role || 'claimant' as 'claimant' | 'defendant',
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidence.title.trim() || !newEvidence.description.trim()) return;

    try {
      const evidenceWithImages = {
        ...newEvidence,
        images: selectedImages
      };
      await addEvidence(evidenceWithImages);
      setNewEvidence({ title: '', description: '', submittedBy: user?.role || 'claimant' });
      setSelectedImages([]);
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

                {evidence.images && evidence.images.length > 0 && (
                  <div className="evidence-images">
                    <strong>Images:</strong>
                    <div className="evidence-image-grid">
                      {evidence.images.map((image, index) => (
                        <div key={index} className="evidence-image-item">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Evidence image ${index + 1}`}
                            className="evidence-image"
                          />
                          <span className="evidence-image-name">{image.name}</span>
                        </div>
                      ))}
                    </div>
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
              <div className="user-role-display">
                <User className="role-icon" />
                <span className="role-text">
                  {user?.role === 'claimant' ? 'Claimant' : 'Defendant'} (You)
                </span>
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

            <div className="form-group">
              <label htmlFor="evidence-images">Upload Images (Optional):</label>
              <div className="image-upload-section">
                <input
                  id="evidence-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="image-input"
                />
                <label htmlFor="evidence-images" className="upload-button">
                  <Upload className="upload-icon" />
                  <span>Choose Images</span>
                </label>
                
                {selectedImages.length > 0 && (
                  <div className="selected-images">
                    <p className="images-label">{selectedImages.length} image(s) selected:</p>
                    <div className="image-preview-list">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="image-preview-item">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="image-preview"
                          />
                          <div className="image-info">
                            <span className="image-name">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="remove-image-button"
                            >
                              <X className="remove-icon" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
          className={`tab-button ${activeTab === 'claimant' ? 'active' : ''}`}
          onClick={() => setActiveTab('claimant')}
        >
          <User className="tab-icon" />
          Claimant Evidence
        </button>
        <button
          className={`tab-button ${activeTab === 'defendant' ? 'active' : ''}`}
          onClick={() => setActiveTab('defendant')}
        >
          <Shield className="tab-icon" />
          Defendant Evidence
        </button>
      </div>

      <div className="evidence-content">
        {activeTab === 'claimant' && renderEvidenceList(
          claimantEvidence, 
          'Claimant Evidence', 
          <User className="section-icon" />
        )}
        {activeTab === 'defendant' && renderEvidenceList(
          defendantEvidence, 
          'Defendant Evidence', 
          <Shield className="section-icon" />
        )}
      </div>
    </div>
  );
};

export default EvidenceView;
