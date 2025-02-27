export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface TherapySession {
  id: string;
  type: 'video' | 'audio';
  language?: 'english' | 'hindi' | 'tamil';
  scheduled: Date;
  duration: number; // in minutes
  therapistId?: string;
}