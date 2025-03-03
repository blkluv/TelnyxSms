import React, { useState } from 'react';
import { sendSMS } from '../api';
import { Phone } from 'lucide-react';

interface SMSFormProps {
  onMessageSent: () => void;
}

const SMSForm: React.FC<SMSFormProps> = ({ onMessageSent }) => {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSending(true);

    try {
      const result = await sendSMS(to, message);
      setSuccess(`Message sent successfully! ID: ${result.messageId}`);
      setTo('');
      setMessage('');
      onMessageSent();
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending SMS:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Phone className="mr-2 text-blue-500" size={20} />
        Send SMS
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Phone Number
          </label>
          <input
            type="tel"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="+1234567890"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          disabled={sending}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:bg-blue-300"
        >
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default SMSForm;