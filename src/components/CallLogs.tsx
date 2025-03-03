import React, { useEffect, useState } from 'react';
import { getCallLogs } from '../api';
import { CallLog } from '../types';
import { PhoneCall, RefreshCw, PhoneIncoming, PhoneOutgoing } from 'lucide-react';

interface CallLogsProps {
  refreshTrigger: number;
}

const CallLogs: React.FC<CallLogsProps> = ({ refreshTrigger }) => {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalls = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCallLogs();
      // Make sure we're not passing any non-serializable data
      const serializedCalls = data.map(call => ({
        ...call,
        // Ensure all properties are serializable
        id: String(call.id),
        direction: call.direction,
        from: String(call.from),
        to: String(call.to),
        status: String(call.status),
        timestamp: String(call.timestamp),
        updated_at: call.updated_at ? String(call.updated_at) : undefined
      }));
      setCalls(serializedCalls);
    } catch (err) {
      setError('Failed to load call logs. Please try again.');
      console.error('Error fetching call logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, [refreshTrigger]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initiated':
        return 'text-yellow-500';
      case 'answered':
        return 'text-green-500';
      case 'hangup':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <PhoneCall className="mr-2 text-green-500" size={20} />
          Call Logs
        </h2>
        <button 
          onClick={fetchCalls}
          className="text-green-500 hover:text-green-700 flex items-center"
        >
          <RefreshCw size={16} className="mr-1" />
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      ) : calls.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No call logs yet
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {calls.map((call) => (
            <div 
              key={call.id}
              className={`p-4 rounded-lg ${
                call.direction === 'inbound' 
                  ? 'bg-green-50 border-l-4 border-green-500' 
                  : 'bg-gray-50 border-l-4 border-gray-500'
              }`}
            >
              <div className="flex items-center mb-2">
                {call.direction === 'inbound' ? (
                  <PhoneIncoming className="text-green-500 mr-2" size={16} />
                ) : (
                  <PhoneOutgoing className="text-gray-500 mr-2" size={16} />
                )}
                <span className="text-sm font-medium">
                  {call.direction === 'inbound' ? 'Incoming from' : 'Outgoing to'}: {call.direction === 'inbound' ? call.from : call.to}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`font-medium ${getStatusColor(call.status)}`}>
                  Status: {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(call.timestamp)}
                </span>
              </div>
              {call.updated_at && (
                <div className="mt-2 text-xs text-gray-500">
                  Last updated: {formatTimestamp(call.updated_at)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CallLogs;