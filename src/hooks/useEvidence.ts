import { useState, useEffect } from 'react';
import type { Evidence } from '../types';

// Mock evidence for demo purposes
const mockEvidence: Evidence[] = [
  {
    id: '1',
    title: 'Service Agreement Contract',
    description: 'Original signed contract outlining service terms and expectations.',
    submittedBy: 'opposer',
    submittedAt: new Date('2024-01-10'),
    isFactChecked: true,
    attachments: ['contract.pdf'],
  },
  {
    id: '2',
    title: 'Payment Receipt',
    description: 'Proof of payment for services rendered on January 5th, 2024.',
    submittedBy: 'opposer',
    submittedAt: new Date('2024-01-12'),
    isFactChecked: true,
    attachments: ['receipt.pdf'],
  },
  {
    id: '3',
    title: 'Service Delivery Confirmation',
    description: 'Email confirmation showing successful completion of requested services.',
    submittedBy: 'defender',
    submittedAt: new Date('2024-01-14'),
    isFactChecked: true,
    attachments: ['confirmation.pdf'],
  },
];

export const useEvidence = () => {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    // Simulate API call
    const loadEvidence = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setEvidence(mockEvidence);
        setError(undefined);
      } catch (err) {
        setError('Failed to load evidence');
        console.error('Error loading evidence:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvidence();
  }, []);

  const addEvidence = async (newEvidence: Omit<Evidence, 'id' | 'submittedAt' | 'isFactChecked'>) => {
    try {
      // Simulate API call
      const evidence: Evidence = {
        ...newEvidence,
        id: Date.now().toString(),
        submittedAt: new Date(),
        isFactChecked: false, // Would be verified by backend
      };

      setEvidence(prev => [...prev, evidence]);
      return evidence;
    } catch (err) {
      setError('Failed to submit evidence');
      console.error('Error adding evidence:', err);
      throw err;
    }
  };

  const getEvidenceByType = (submittedBy: 'opposer' | 'defender') => {
    return evidence.filter(e => e.submittedBy === submittedBy);
  };

  return {
    evidence,
    isLoading,
    error,
    addEvidence,
    getEvidenceByType,
    opposerEvidence: getEvidenceByType('opposer'),
    defenderEvidence: getEvidenceByType('defender'),
  };
};
