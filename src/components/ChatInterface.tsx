import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, AlertTriangle, Clock, CheckCircle, Bot, User } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import type { Message } from '../types';

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    try {
      await sendMessage(inputValue.trim());
      setInputValue('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageIcon = (message: Message) => {
    if (message.sender === 'system') {
      return <Bot className="message-type-icon system" />;
    }
    if (message.type === 'evidence') {
      return <FileText className="message-type-icon evidence" />;
    }
    return <User className="message-type-icon user" />;
  };

  const getMessageStatus = (message: Message) => {
    if (message.sender === 'system') {
      return <CheckCircle className="message-status system" />;
    }
    if (message.type === 'evidence') {
      return <Clock className="message-status pending" />;
    }
    return <CheckCircle className="message-status sent" />;
  };

  const formatMessageContent = (content: string) => {
    // Handle markdown-style formatting with improved layout
    const lines = content.split('\n');
    const sections: { header?: string; content: string[] }[] = [];
    let currentSection: { header?: string; content: string[] } = { content: [] };

    lines.forEach(line => {
      if (line.startsWith('**') && line.endsWith('**')) {
        // Save current section if it has content
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        // Start new section
        const header = line.slice(2, -2);
        currentSection = { header, content: [] };
      } else if (line.trim() !== '') {
        currentSection.content.push(line);
      } else if (currentSection.content.length > 0) {
        currentSection.content.push(''); // Preserve empty lines within sections
      }
    });

    // Add the last section
    if (currentSection.content.length > 0 || currentSection.header) {
      sections.push(currentSection);
    }

    const getHeaderType = (header: string) => {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader.includes('ai arbitration decision')) return 'decision';
      if (lowerHeader.includes('decision') || lowerHeader.includes('verdict')) return 'verdict';
      if (lowerHeader.includes('reasoning')) return 'reasoning';
      if (lowerHeader.includes('confidence')) return 'confidence';
      if (lowerHeader.includes('status')) return 'status';
      if (lowerHeader.includes('case id')) return 'case-id';
      return undefined;
    };

    return sections.map((section, sectionIndex) => (
      <div key={sectionIndex} className="message-section">
        {section.header && (
          <div 
            className="message-section-header"
            data-type={getHeaderType(section.header)}
          >
            {section.header}
          </div>
        )}
        {section.content.length > 0 && (
          <div className="message-section-content">
            {section.content.map((line, lineIndex) => (
              line === '' ? (
                <br key={lineIndex} />
              ) : (
                <div key={lineIndex} className="message-line">
                  {line}
                </div>
              )
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>AI Arbitration Chat</h2>
        <p>Submit your disputes and complaints for AI-powered arbitration analysis</p>
      </div>

      {error && (
        <div className="chat-error">
          <AlertTriangle className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <FileText className="empty-icon" />
            <h3>Start an arbitration case</h3>
            <p>Submit your complaint to begin AI-powered dispute resolution and receive expert arbitration analysis.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'system' ? 'system' : 'user'}`}
              >
                <div className="message-content">
                  <div className="message-header">
                    {getMessageIcon(message)}
                    <span className="message-sender">
                      {message.sender === 'system' ? 'System' : 'You'}
                    </span>
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="message-text">
                    {message.sender === 'system' ? (
                      <div className="system-message-content">
                        {formatMessageContent(message.content)}
                        {isLoading && message.content === 'Processing your request...' && (
                          <div className="streaming-indicator">
                            <Clock className="streaming-icon" />
                            <span>AI Arbiter is analyzing your case...</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                  {message.type === 'evidence' && (
                    <div className="evidence-notice">
                      <FileText className="evidence-icon" />
                      <span>Evidence submitted for fact-checking</span>
                    </div>
                  )}
                </div>
                <div className="message-status-container">
                  {getMessageStatus(message)}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your dispute or complaint for AI arbitration analysis..."
            className="message-input"
            rows={3}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? (
              <Clock className="button-icon loading" />
            ) : (
              <Send className="button-icon" />
            )}
          </button>
        </div>

        <div className="message-help">
          <FileText className="help-icon" />
          <p>
            Describe your dispute or complaint. Our AI Arbiter will analyze your case 
            using established policies and provide a detailed arbitration decision with reasoning.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
