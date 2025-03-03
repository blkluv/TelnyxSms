import React, { useState } from 'react';
import { initiateCall } from '../api';
import { PhoneCall } from 'lucide-react';

interface CallFormProps {
  onCallInitiated: () => void;
}

const CallForm: React.FC<CallFormProps> = ({ onCallInitiated }) => {
  const [to, setTo] = useState('');
  const [calling, setCalling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setCalling(true);

    try {
      const result = await initiateCall(to);
      setSuccess(`Call initiated successfully! ID: ${result.callId}`);
      setTo('');
      onCallInitiated();
    } catch (err) {
      setError('Failed to initiate call. Please try again.');
      console.error('Error initiating call:', err);
    } finally {
      setCalling(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <PhoneCall className="mr-2 text-green-500" size={20} />
        Initiate Call
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="callTo" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Phone Number
          </label>
          <input
            type="tel"
            id="callTo"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="+1234567890"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        <button
          type="submit"
          disabled={calling}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:bg-green-300"
        >
          {calling ? 'Initiating Call...' : 'Call Now'}
        </button>
      </form>
    </div>
  );
};

export default CallForm;