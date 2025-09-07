import { useState, useCallback } from 'react';
import type { Message, ChatState } from '../types';

// Helper function to analyze message content for evidence requirements
// In a real implementation, this would be handled by AI/ML on the backend
const analyzeMessageForEvidence = (content: string): boolean => {
  const evidenceKeywords = [
    'proof', 'evidence', 'document', 'contract', 'receipt', 'payment',
    'violation', 'breach', 'damages', 'loss', 'harm', 'injury',
    'fraud', 'deception', 'misrepresentation', 'negligence',
    'defective', 'faulty', 'broken', 'malfunction',
    'overcharged', 'unauthorized', 'dispute', 'claim',
    'medical', 'invoice', 'bill', 'statement', 'record'
  ];
  
  const lowerContent = content.toLowerCase();
  return evidenceKeywords.some(keyword => lowerContent.includes(keyword));
};

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: undefined,
  });

  const sendMessage = useCallback(async (content: string) => {
    try {
      setChatState(prev => ({ ...prev, isLoading: true, error: undefined }));

      // Create new message (initially as information type)
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'information',
        content,
        timestamp: new Date(),
        sender: 'user',
        evidenceRequired: false,
      };

      // Simulate API call to determine message type and get response
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate API analysis - in real implementation, this would be determined by the backend
      const requiresEvidence = analyzeMessageForEvidence(content);
      
      // Update message type based on API response
      if (requiresEvidence) {
        newMessage.type = 'evidence';
        newMessage.evidenceRequired = true;
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        isLoading: false,
      }));

      // Simulate API responses based on message type
      setTimeout(() => {
        let responseMessage: Message;
        
        if (requiresEvidence) {
          responseMessage = {
            id: (Date.now() + 1).toString(),
            type: 'information',
            content: 'Thank you for your complaint. Based on your message, we\'ve identified that evidence will be required to support your case. Please submit relevant documentation through the Evidence section. Our fact-checking team will review all submissions.',
            timestamp: new Date(),
            sender: 'system',
          };
        } else {
          responseMessage = {
            id: (Date.now() + 1).toString(),
            type: 'information',
            content: 'Thank you for your message. We have received your information and it has been logged in your case file. If additional evidence is needed, we will notify you.',
            timestamp: new Date(),
            sender: 'system',
          };
        }

        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, responseMessage],
        }));
      }, 1000);

      return newMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setChatState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw err;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setChatState({
      messages: [],
      isLoading: false,
      error: undefined,
    });
  }, []);

  return {
    messages: chatState.messages,
    isLoading: chatState.isLoading,
    error: chatState.error,
    sendMessage,
    clearMessages,
  };
};
