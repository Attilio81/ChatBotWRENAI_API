export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  chartSpec?: any;
  reasoning?: string;  // Stores WREN AI reasoning process
  sql?: string;        // Stores generated SQL query
  data?: any[];        // Stores query result data for table display
}

export interface ChatResponse {
  response?: string;
  message?: string;
  type?: string;
  debug?: string;
  timestamp?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  testWebhook: string;
  prodWebhook: string;
  type?: 'n8n' | 'wren';
}