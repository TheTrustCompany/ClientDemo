import { useState, useCallback } from 'react';
import type { Message, ChatState } from '../types';

// API configuration
const API_BASE_URL = 'http://localhost:8000';
const ARBITRATE_STREAM_ENDPOINT = `${API_BASE_URL}/arbitrate/stream`;

// Helper function to create sample policy data
const createSamplePolicyData = () => ({
  id: crypto.randomUUID(),
  creator_id: crypto.randomUUID(),
  name: "Data Security and Access Control Policy",
  description: "Policy agreed upon by both IT management and security team: All employee access to sensitive customer data must be logged and monitored. Any access to customer payment information requires explicit written approval from the Data Protection Officer (DPO) before access is granted. All access logs must be reviewed weekly by the security team. No exceptions are permitted without formal risk assessment documentation.",
  created_at: new Date().toISOString()
});

// Helper function to create sample evidence data
const createSampleEvidenceData = (policyId: string, submitterId: string, content: string) => ({
  id: crypto.randomUUID(),
  policy_id: policyId,
  submitter_id: submitterId,
  content,
  created_at: new Date().toISOString()
});

// Helper function to create arbitration request
const createArbitrationRequest = (userQuery: string) => {
  const policy = createSamplePolicyData();
  const opposerId = crypto.randomUUID();
  const defenderId = policy.creator_id;

  const opposerEvidences = [
    createSampleEvidenceData(
      policy.id,
      opposerId,
      "Security audit logs show that 15 employees accessed customer payment data without DPO approval."
    ),
    createSampleEvidenceData(
      policy.id,
      opposerId,
      "Weekly security log reviews have not been conducted for 6 weeks."
    ),
  ];

  const defenderEvidences = [
    createSampleEvidenceData(
      policy.id,
      defenderId,
      "We have implemented a new automated logging system that captures all data access attempts."
    ),
    createSampleEvidenceData(
      policy.id,
      defenderId,
      "Operational needs sometimes require flexible interpretation of policies."
    ),
  ];

  return {
    policy,
    opposer_evidences: opposerEvidences,
    defender_evidences: defenderEvidences,
    user_query: userQuery
  };
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

      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'information',
        content,
        timestamp: new Date(),
        sender: 'user',
        evidenceRequired: false,
      };

      // Add user message immediately
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));

      // Create arbitration request
      const requestData = createArbitrationRequest(content);

      // Create system message for streaming response
      const systemMessageId = (Date.now() + 1).toString();
      let systemMessage: Message = {
        id: systemMessageId,
        type: 'information',
        content: 'Processing your request...',
        timestamp: new Date(),
        sender: 'system',
      };

      // Add initial system message
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, systemMessage],
      }));

      // Start streaming
      const response = await fetch(ARBITRATE_STREAM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body available for streaming');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Track accumulated content for different sections
      let accumulatedContent = {
        message: '',
        decision: '',
        reasoning: '',
        confidence_score: null as number | null,
        decision_type: '',
        decision_id: ''
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.trim() && line.startsWith('data: ')) {
              const dataStr = line.slice(6); // Remove 'data: ' prefix
              try {
                const data = JSON.parse(dataStr);

                // Check for completion signal
                if (data.type === 'complete') {
                  setChatState(prev => ({ ...prev, isLoading: false }));
                  return userMessage;
                }

                // Check for error
                if (data.type === 'error') {
                  throw new Error(data.message || 'Stream error');
                }

                // Handle arbitration result chunks
                if (data.arbitration_result) {
                  const result = data.arbitration_result;
                  
                  // Update accumulated content with new data
                  if (result.message) {
                    accumulatedContent.message = result.message;
                  }
                  if (result.decision) {
                    accumulatedContent.decision = result.decision;
                  }
                  if (result.reasoning) {
                    accumulatedContent.reasoning = result.reasoning;
                  }
                  if (result.confidence_score !== undefined) {
                    accumulatedContent.confidence_score = result.confidence_score;
                  }
                  if (result.decision_type) {
                    accumulatedContent.decision_type = result.decision_type;
                  }
                  if (result.decision_id) {
                    accumulatedContent.decision_id = result.decision_id;
                  }

                  // Build the complete content from accumulated data
                  let streamedContent = '';

                  if (accumulatedContent.decision) {
                    streamedContent += `**Decision**\n${accumulatedContent.decision}\n\n`;
                  }

                  if (accumulatedContent.reasoning) {
                    streamedContent += `**Detailed Reasoning**\n${accumulatedContent.reasoning}\n\n`;
                  }

                  if (accumulatedContent.message) {
                    streamedContent += `**AI Arbitration Response**\n${accumulatedContent.message}`;
                  }

                  // Update the system message with the complete accumulated content
                  setChatState(prev => ({
                    ...prev,
                    messages: prev.messages.map(msg => 
                      msg.id === systemMessageId 
                        ? { 
                            ...msg, 
                            content: streamedContent.trim() || 'Processing your arbitration request...',
                            decisionType: accumulatedContent.decision_type,
                            decisionId: accumulatedContent.decision_id,
                            confidenceScore: accumulatedContent.confidence_score ?? undefined
                          }
                        : msg
                    ),
                  }));
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', parseError, 'Raw data:', dataStr);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // If we reach here, the stream ended without a completion signal
      setChatState(prev => ({ ...prev, isLoading: false }));
      return userMessage;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setChatState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage,
        messages: prev.messages.map(msg => 
          msg.sender === 'system' && msg.content === 'Processing your request...'
            ? { ...msg, content: `Error: ${errorMessage}` }
            : msg
        )
      }));
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
