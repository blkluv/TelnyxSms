import React, { useEffect, useState } from 'react';
import { getSMSMessages } from '../api';
import { SMSMessage } from '../types';
import { MessageSquare, ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';

interface SMSListProps {
  refreshTrigger: number;
}

const SMSList: React.FC<SMSListProps> = ({ refreshTrigger }) => {
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSMSMessages();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages. Please try again.');
      console.error('Error fetching SMS messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [refreshTrigger]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <MessageSquare className="mr-2 text-blue-500" size={20} />
          SMS Messages
        </h2>
        <button 
          onClick={fetchMessages}
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <RefreshCw size={16} className="mr-1" />
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No messages yet
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`p-4 rounded-lg ${
                message.direction === 'inbound' 
                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                  : 'bg-gray-50 border-l-4 border-gray-500'
              }`}
            >
              <div className="flex items-center mb-2">
                {message.direction === 'inbound' ? (
                  <ArrowDown className="text-blue-500 mr-2" size={16} />
                ) : (
                  <ArrowUp className="text-gray-500 mr-2" size={16} />
                )}
                <span className="text-sm font-medium">
                  {message.direction === 'inbound' ? 'Received from' : 'Sent to'}: {message.direction === 'inbound' ? message.from : message.to}
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{message.text}</p>
              <div className="mt-2 text-xs text-gray-500">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SMSList;