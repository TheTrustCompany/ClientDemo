import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, Send, X, AlertCircle } from 'lucide-react';

interface EvidenceSubmissionFormProps {
  onSubmit: (title: string, description: string, files: File[]) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const EvidenceSubmissionForm: React.FC<EvidenceSubmissionFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.startsWith('text/')
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.startsWith('text/')
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSubmit(title.trim(), description.trim(), files);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="file-icon" />;
    }
    return <FileText className="file-icon" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="evidence-submission-form">
      <div className="form-header">
        <div className="form-title">
          <FileText className="form-icon" />
          <h3>Submit Evidence</h3>
        </div>
        <p className="form-description">
          Please provide additional evidence to support your case. Include a clear title, 
          detailed description, and any relevant documents or images.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="evidence-form">
        <div className="form-group">
          <label htmlFor="evidence-title" className="form-label">
            Evidence Title <span className="required">*</span>
          </label>
          <input
            id="evidence-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief title describing your evidence"
            className="form-input"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="evidence-description" className="form-label">
            Detailed Description <span className="required">*</span>
          </label>
          <textarea
            id="evidence-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a detailed description of your evidence and how it supports your case..."
            className="form-textarea"
            rows={4}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Supporting Documents & Images
          </label>
          <div 
            className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="upload-icon" />
            <div className="upload-text">
              <p className="upload-primary">Click to upload or drag and drop</p>
              <p className="upload-secondary">PNG, JPG, PDF, TXT files (Max 10MB each)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*,.pdf,.txt,.doc,.docx"
              multiple
              className="file-input-hidden"
              disabled={isLoading}
            />
          </div>

          {files.length > 0 && (
            <div className="uploaded-files">
              {files.map((file, index) => (
                <div key={index} className="uploaded-file">
                  <div className="file-info">
                    {getFileIcon(file)}
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="remove-file-btn"
                    disabled={isLoading}
                  >
                    <X className="remove-icon" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-notice">
          <AlertCircle className="notice-icon" />
          <p>
            All submitted evidence will be reviewed and fact-checked by our AI arbitration system. 
            False or misleading evidence may negatively impact your case.
          </p>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!title.trim() || !description.trim() || isLoading}
            className="submit-btn"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="submit-icon" />
                <span>Submit Evidence</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvidenceSubmissionForm;
