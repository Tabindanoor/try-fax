
import { AIAnalysis } from './types';

// Mock AI analysis function (in a real app, this would call an OpenAI or similar API)
export const analyzeDocument = async (file: File): Promise<AIAnalysis> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, we would send the file to an API 
  // and get back an analysis. For now, we'll return mock data
  // based on the file name to simulate different analyses
  
  const fileName = file.name.toLowerCase();
  
  if (fileName.includes('contract')) {
    return {
      summaryText: 'This appears to be a contract document with legal terms and conditions. It contains sections on payment terms, liability, and termination clauses.',
      suggestedRecipients: ['Legal Department', 'Finance'],
      contentWarnings: ['Contains unsigned signature fields', 'Missing date on page 2'],
      sentiment: 'neutral',
      topicClassification: ['Legal', 'Contract', 'Business'],
      confidentialityLevel: 'confidential'
    };
  } else if (fileName.includes('invoice')) {
    return {
      summaryText: 'This is an invoice document with payment details. Total amount due appears to be $1,250.00 with payment terms of Net 30.',
      suggestedRecipients: ['Accounts Payable', 'Finance Department'],
      contentWarnings: [],
      sentiment: 'neutral',
      topicClassification: ['Finance', 'Accounting', 'Invoice'],
      confidentialityLevel: 'private'
    };
  } else if (fileName.includes('report')) {
    return {
      summaryText: 'This document contains a detailed report with statistical data and analysis. Contains quarterly performance metrics and recommendations.',
      suggestedRecipients: ['Management Team', 'Board Members'],
      contentWarnings: ['Contains confidential information'],
      sentiment: 'neutral',
      topicClassification: ['Report', 'Analysis', 'Business Intelligence'],
      confidentialityLevel: 'highly confidential'
    };
  } else if (fileName.includes('complaint') || fileName.includes('issue')) {
    return {
      summaryText: 'This document appears to be a formal complaint or issue report. It details problems with a service or product and requests resolution.',
      suggestedRecipients: ['Customer Support', 'Management'],
      contentWarnings: ['Contains negative feedback'],
      sentiment: 'negative',
      topicClassification: ['Complaint', 'Customer Service', 'Issue Resolution'],
      confidentialityLevel: 'private'
    };
  } else if (fileName.includes('proposal') || fileName.includes('offer')) {
    return {
      summaryText: 'This is a business proposal document outlining a new opportunity or partnership. It includes pricing details and service offerings.',
      suggestedRecipients: ['Business Development', 'Sales Team'],
      contentWarnings: [],
      sentiment: 'positive',
      topicClassification: ['Sales', 'Proposal', 'Business Development'],
      confidentialityLevel: 'confidential'
    };
  } else {
    // Default analysis for unknown document types
    return {
      summaryText: 'This document contains text and possibly images. Consider reviewing before sending.',
      suggestedRecipients: [],
      contentWarnings: [],
      sentiment: 'neutral',
      topicClassification: ['General', 'Document'],
      confidentialityLevel: 'private'
    };
  }
};

// Function to generate a cover page with AI
export const generateCoverPage = async (
  recipientName: string,
  senderName: string,
  subject: string,
  notes: string = ''
): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would generate a PDF using AI
  // For now, return a placeholder URL
  
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
};

// Function to provide suggestions for optimizing the document
export const getSendingSuggestions = async (file: File, country: string): Promise<string[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock suggestions
  const suggestions = [
    'Consider sending during business hours in the recipient\'s timezone for faster processing',
    'PDF format typically has the best compatibility with most fax systems',
    'Black and white documents usually transmit more reliably than color',
  ];
  
  // Add country-specific suggestions
  if (country === 'JP') {
    suggestions.push('Japanese fax systems may require specific header formats');
  } else if (country === 'DE') {
    suggestions.push('German regulations may require a business identifier on the cover page');
  } else if (country === 'GB') {
    suggestions.push('UK fax regulations require consent for marketing materials');
  } else if (country === 'US') {
    suggestions.push('US fax regulations (TCPA) have specific requirements for unsolicited faxes');
  }
  
  // Add file-specific suggestions
  const fileName = file.name.toLowerCase();
  if (fileName.includes('contract') || fileName.includes('legal')) {
    suggestions.push('Legal documents should include page numbers and document IDs on each page');
  } else if (fileName.includes('medical') || fileName.includes('health')) {
    suggestions.push('Medical information requires secure transmission and may need additional privacy disclosures');
  }
  
  return suggestions;
};

// Function to extract text from an image using OCR
export const extractTextFromImage = async (file: File): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // In a real app, this would use OCR to extract text from the image
  // For now, we'll just return mock data
  
  const fileName = file.name.toLowerCase();
  if (fileName.includes('invoice')) {
    return "INVOICE\nDate: 2023-04-14\nInvoice #: INV-12345\nBill To: Company Name\nAmount Due: $1,250.00\nDue Date: 2023-05-14";
  } else if (fileName.includes('receipt')) {
    return "RECEIPT\nStore: Example Store\nDate: 2023-04-14\nItems:\n- Product 1: $25.99\n- Product 2: $14.50\nTotal: $40.49\nThank you for your business!";
  } else {
    return "Extracted text would appear here. This is a placeholder for OCR functionality.";
  }
};

// Function to analyze sentiment in a document
export const analyzeSentiment = async (text: string): Promise<'positive' | 'neutral' | 'negative'> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would use NLP to analyze sentiment
  // For now, we'll just check for positive/negative words
  
  const positiveWords = ['happy', 'great', 'excellent', 'good', 'pleased', 'satisfied', 'approve', 'positive'];
  const negativeWords = ['bad', 'poor', 'unhappy', 'disappointed', 'issue', 'problem', 'complaint', 'negative'];
  
  const lowerText = text.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
};

// Function to enhance document quality for faxing
export const enhanceDocumentForFaxing = async (file: File): Promise<Blob> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  // In a real app, this would enhance the document quality
  // For now, we'll just return the original file
  
  return file;
};

// Function to detect and warn about inappropriate content
export const detectInappropriateContent = async (text: string): Promise<string[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real app, this would use AI to detect inappropriate content
  // For now, we'll just check for certain keywords
  
  const warnings: string[] = [];
  const lowerText = text.toLowerCase();
  
  if (/\b(confidential|secret|private)\b/.test(lowerText)) {
    warnings.push('Document contains confidentiality indicators');
  }
  
  if (/\b(ssn|social security|passport|license number)\b/.test(lowerText)) {
    warnings.push('Document may contain personal identification information');
  }
  
  if (/\b(credit card|visa|mastercard|amex|american express)\b/.test(lowerText)) {
    warnings.push('Document may contain payment information');
  }
  
  return warnings;
};
