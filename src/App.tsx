import React, { useState } from 'react';
import SMSForm from './components/SMSForm';
import SMSList from './components/SMSList';
import CallForm from './components/CallForm';
import CallLogs from './components/CallLogs';
import WebhookInfo from './components/WebhookInfo';
import { MessageSquare, PhoneCall, Webhook, Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'sms' | 'voice' | 'webhooks'>('sms');
  const [refreshSMSTrigger, setRefreshSMSTrigger] = useState(0);
  const [refreshCallTrigger, setRefreshCallTrigger] = useState(0);

  const handleMessageSent = () => {
    // Trigger refresh of SMS list after sending a message
    setRefreshSMSTrigger(prev => prev + 1);
  };

  const handleCallInitiated = () => {
    // Trigger refresh of call logs after initiating a call
    setRefreshCallTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Telnyx Integration</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 flex items-center ${
              activeTab === 'sms'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('sms')}
          >
            <MessageSquare className="mr-2" size={18} />
            SMS Messaging
          </button>
          <button
            className={`py-3 px-6 flex items-center ${
              activeTab === 'voice'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('voice')}
          >
            <PhoneCall className="mr-2" size={18} />
            Voice Calls
          </button>
          <button
            className={`py-3 px-6 flex items-center ${
              activeTab === 'webhooks'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('webhooks')}
          >
            <Webhook className="mr-2" size={18} />
            Webhooks
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'sms' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SMSForm onMessageSent={handleMessageSent} />
            <SMSList refreshTrigger={refreshSMSTrigger} />
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CallForm onCallInitiated={handleCallInitiated} />
            <CallLogs refreshTrigger={refreshCallTrigger} />
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div className="max-w-2xl mx-auto">
            <WebhookInfo />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Telnyx API Integration - {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;