import React from 'react';
import { Webhook, Info } from 'lucide-react';

const WebhookInfo: React.FC = () => {
  // Get the APP_DOMAIN from import.meta.env instead of process.env
  const appDomain = import.meta.env.VITE_APP_DOMAIN || 'http://localhost:3000';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Webhook className="mr-2 text-purple-500" size={20} />
        Webhook Configuration
      </h2>
      
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <div className="flex items-start mb-2">
          <Info size={16} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            To receive SMS and call events, configure your Telnyx Messaging Profile and Call Control Application 
            to use the following webhook URL:
          </p>
        </div>
        <div className="bg-gray-100 p-3 rounded border border-gray-300 font-mono text-sm break-all">
          {appDomain}/webhook
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium text-gray-800">Supported Webhook Events:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
          <li>message.received - Incoming SMS messages</li>
          <li>call.initiated - New calls (incoming or outgoing)</li>
          <li>call.answered - When calls are answered</li>
          <li>call.hangup - When calls are ended</li>
          <li>call.recording.saved - When call recordings are saved</li>
        </ul>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-800">
        <p className="font-medium">Important:</p>
        <p>For production use, ensure your webhook endpoint is publicly accessible and properly secured.</p>
      </div>
    </div>
  );
};

export default WebhookInfo;