import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
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
      // Send as information message by default - API will determine actual type
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
    if (message.type === 'evidence') {
      return <FileText className="message-type-icon evidence" />;
    }
    return null;
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

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Dispute Resolution Chat</h2>
        <p>Submit your complaints and evidence for review</p>
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
            <h3>Start the conversation</h3>
            <p>Submit your complaint or evidence to begin the dispute resolution process.</p>
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
                    {message.content}
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
            placeholder="Type your message or complaint..."
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
            Send your complaint or message. Our system will automatically determine if 
            evidence is required and guide you through the submission process.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
