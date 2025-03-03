export interface SMSMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  text: string;
  timestamp: string;
}

export interface CallLog {
  id: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  status: string;
  timestamp: string;
  updated_at?: string;
}