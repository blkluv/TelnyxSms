import axios from 'axios';
import { SMSMessage, CallLog } from './types';

const API_URL = 'http://localhost:3000/api';

export const sendSMS = async (to: string, message: string): Promise<{ success: boolean; messageId: string }> => {
  const response = await axios.post(`${API_URL}/send-sms`, { to, message });
  return response.data;
};

export const getSMSMessages = async (): Promise<SMSMessage[]> => {
  const response = await axios.get(`${API_URL}/sms-messages`);
  return response.data;
};

export const initiateCall = async (to: string): Promise<{ success: boolean; callId: string }> => {
  const response = await axios.post(`${API_URL}/initiate-call`, { to });
  return response.data;
};

export const getCallLogs = async (): Promise<CallLog[]> => {
  const response = await axios.get(`${API_URL}/call-logs`);
  return response.data;
};