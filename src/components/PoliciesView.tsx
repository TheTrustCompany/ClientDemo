import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, ChevronDown, ChevronUp, Scale, Shield } from 'lucide-react';
import { usePolicies } from '../hooks/usePolicies';
import type { Policy } from '../types';

const PoliciesView: React.FC = () => {
  const { policies, isLoading, error } = usePolicies();
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);

  const togglePolicy = (policyId: string) => {
    setExpandedPolicy(expandedPolicy === policyId ? null : policyId);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatPolicyContent = (content: string) => {
    // Split content by double newlines to get sections
    const sections = content.trim().split('\n\n');
    
    return sections.map((section, index) => {
      const lines = section.split('\n');
      const processedLines: React.ReactElement[] = [];
      
      lines.forEach((line, lineIndex) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          // Bold headers
          processedLines.push(
            <h4 key={`${index}-${lineIndex}`} className="policy-section-header">
              {line.replace(/\*\*/g, '')}
            </h4>
          );
        } else if (line.startsWith('• ')) {
          // Bullet points
          processedLines.push(
            <li key={`${index}-${lineIndex}`} className="policy-bullet">
              {line.substring(2)}
            </li>
          );
        } else if (line.trim()) {
          // Regular text
          processedLines.push(
            <p key={`${index}-${lineIndex}`} className="policy-paragraph">
              {line}
            </p>
          );
        }
      });
      
      return (
        <div key={index} className="policy-section">
          {processedLines}
        </div>
      );
    });
  };

  const getPolicyIcon = (title: string) => {
    if (title.toLowerCase().includes('refund') || title.toLowerCase().includes('eligibility')) {
      return <CheckCircle className="policy-icon eligibility" />;
    }
    if (title.toLowerCase().includes('non-refundable') || title.toLowerCase().includes('abuse')) {
      return <Shield className="policy-icon restriction" />;
    }
    if (title.toLowerCase().includes('technical') || title.toLowerCase().includes('support')) {
      return <FileText className="policy-icon technical" />;
    }
    if (title.toLowerCase().includes('legal') || title.toLowerCase().includes('compliance')) {
      return <Scale className="policy-icon legal" />;
    }
    return <FileText className="policy-icon default" />;
  };

  if (isLoading) {
    return (
      <div className="policies-loading">
        <Clock className="loading-icon" />
        <p>Loading refund and service policies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="policies-error">
        <FileText className="error-icon" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="policies-view">
      <div className="policies-header">
        <Scale className="header-icon" />
        <div className="header-content">
          <h2>Refund & Service Policies</h2>
          <p>Comprehensive policies covering refund eligibility, technical support, and legal compliance for all our services.</p>
        </div>
      </div>

      <div className="policies-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <CheckCircle className="stat-icon positive" />
            <div className="stat-content">
              <span className="stat-number">14 Days</span>
              <span className="stat-label">Standard Refund Window</span>
            </div>
          </div>
          <div className="stat-item">
            <Clock className="stat-icon neutral" />
            <div className="stat-content">
              <span className="stat-number">5-10 Days</span>
              <span className="stat-label">Processing Time</span>
            </div>
          </div>
          <div className="stat-item">
            <Scale className="stat-icon legal" />
            <div className="stat-content">
              <span className="stat-number">6 Regions</span>
              <span className="stat-label">Legal Compliance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="policies-list">
        {policies.map((policy: Policy) => (
          <div key={policy.id} className="policy-card">
            <div 
              className="policy-header"
              onClick={() => togglePolicy(policy.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  togglePolicy(policy.id);
                }
              }}
            >
              <div className="policy-title-section">
                <div className="policy-title-with-icon">
                  {getPolicyIcon(policy.title)}
                  <h3 className="policy-title">{policy.title}</h3>
                </div>
                <div className="policy-meta">
                  <span className="policy-version">v{policy.version}</span>
                  <span className="policy-date">
                    Updated {formatDate(policy.agreedAt)}
                  </span>
                </div>
              </div>
              <div className="policy-expand">
                {expandedPolicy === policy.id ? (
                  <ChevronUp className="expand-icon" />
                ) : (
                  <ChevronDown className="expand-icon" />
                )}
              </div>
            </div>

            {expandedPolicy === policy.id && (
              <div className="policy-content">
                <div className="policy-text">
                  {formatPolicyContent(policy.content)}
                </div>
                <div className="policy-footer">
                  <div className="agreement-status">
                    <CheckCircle className="status-icon agreed" />
                    <span>Policy acknowledged and agreed</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="policies-footer">
        <div className="footer-note">
          <Scale className="note-icon" />
          <div className="footer-content">
            <h4>Important Notice</h4>
            <p>
              These policies are designed to ensure fair and transparent service delivery. 
              Local consumer protection laws may provide additional rights beyond those outlined here. 
              For specific questions about your rights in your region, please contact our support team.
            </p>
          </div>
        </div>
        
        <div className="contact-info">
          <h4>Need Help?</h4>
          <p>Contact our support team for assistance with refunds or policy questions.</p>
          <div className="contact-methods">
            <span>📧 support@platform.com</span>
            <span>🌐 support.platform.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliciesView;
