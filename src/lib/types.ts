
export interface Fax {
  id: string;
  recipientNumber: string;
  recipientCountry: string;
  date: string;
  pages: number;
  status: 'pending' | 'sent' | 'failed' | string; // Allowing string to be compatible with database
  fileUrl?: string;
  fileName?: string;
  userId?: string;
  isIncoming?: boolean;
  senderNumber?: string;
  senderCountry?: string;
  read?: boolean;
  aiAnalysis?: AIAnalysis;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  notificationPreferences?: NotificationPreferences;
  faxNumber?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  instantNotifications: boolean;
}

export interface AIAnalysis {
  summaryText: string;
  suggestedRecipients?: string[];
  contentWarnings?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  topicClassification?: string[];
  confidentialityLevel?: 'public' | 'private' | 'confidential' | 'highly confidential';
}

export interface FaxNumberAssignment {
  id: string;
  userId: string;
  faxNumber: string;
  countryCode: string;
  assignmentDate: string;
  active: boolean;
}

export interface EmailNotification {
  id: string;
  userId: string;
  faxId: string;
  type: 'sent' | 'received' | 'failed' | string; // Allowing string to be compatible with database
  sentDate: string;
  delivered: boolean;
}

// Added interface for external fax API configuration
export interface FaxAPIConfig {
  apiKey: string;
  provider: 'twilio' | 'phaxio' | 'interfax' | 'other';
  endpointUrl?: string;
}

// Added interface for dynamic fax status updates
export interface FaxStatusUpdate {
  id: string;
  faxId: string;
  status: 'queued' | 'processing' | 'sending' | 'delivered' | 'error';
  timestamp: string;
  errorMessage?: string;
  pagesSent?: number;
  totalPages?: number;
}
