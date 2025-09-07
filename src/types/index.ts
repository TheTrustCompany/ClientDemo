export interface User {
  address: string;
  isConnected: boolean;
  role: 'claimant' | 'defendant';
}

export interface Policy {
  id: string;
  title: string;
  content: string;
  agreedAt: Date;
  version: string;
}

export interface Evidence {
  id: string;
  title: string;
  description: string;
  submittedBy: 'claimant' | 'defendant';
  submittedAt: Date;
  isFactChecked: boolean;
  attachments?: string[];
  images?: File[];
}

export interface Message {
  id: string;
  type: 'information' | 'evidence';
  content: string;
  timestamp: Date;
  sender: string;
  evidenceRequired?: boolean;
  relatedEvidenceId?: string;
  decisionType?: string;
  decisionId?: string;
  confidenceScore?: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error?: string;
}
