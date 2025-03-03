import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import telnyx from 'telnyx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Initialize environment variables
dotenv.config();

// Initialize Telnyx client
const telnyxClient = telnyx(process.env.TELNYX_API_KEY);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store SMS messages in memory (in production, use a database)
const smsMessages = [];
const callLogs = [];

// Serve static files from the dist directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, '../dist')));

// API Routes
app.post('/api/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ error: 'To phone number and message are required' });
    }
    
    const result = await telnyxClient.messages.create({
      from: process.env.TELNYX_PHONE_NUMBER,
      to,
      text: message,
    });
    
    smsMessages.push({
      id: result.data.id,
      direction: 'outbound',
      from: process.env.TELNYX_PHONE_NUMBER,
      to,
      text: message,
      timestamp: new Date().toISOString(),
    });
    
    res.json({ success: true, messageId: result.data.id });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
});

app.get('/api/sms-messages', (req, res) => {
  res.json(smsMessages);
});

app.post('/api/initiate-call', async (req, res) => {
  try {
    const { to } = req.body;
    
    if (!to) {
      return res.status(400).json({ error: 'To phone number is required' });
    }
    
    const call = await telnyxClient.calls.create({
      connection_id: 'your_connection_id', // Replace with your Telnyx connection ID
      to,
      from: process.env.TELNYX_PHONE_NUMBER,
      audio_url: 'https://example.com/greeting.wav', // Replace with your audio file URL
    });
    
    callLogs.push({
      id: call.data.call_control_id,
      direction: 'outbound',
      from: process.env.TELNYX_PHONE_NUMBER,
      to,
      status: 'initiated',
      timestamp: new Date().toISOString(),
    });
    
    res.json({ success: true, callId: call.data.call_control_id });
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ error: 'Failed to initiate call', details: error.message });
  }
});

app.get('/api/call-logs', (req, res) => {
  // Ensure all data is serializable
  const serializedLogs = callLogs.map(log => ({
    id: String(log.id),
    direction: String(log.direction),
    from: String(log.from),
    to: String(log.to),
    status: String(log.status),
    timestamp: String(log.timestamp),
    updated_at: log.updated_at ? String(log.updated_at) : undefined
  }));
  res.json(serializedLogs);
});

// Webhook endpoint for Telnyx events
app.post('/webhook', (req, res) => {
  const event = req.body;
  const telnyxSignature = req.headers['telnyx-signature-ed25519'];
  const telnyxTimestamp = req.headers['telnyx-timestamp'];

  // In production, verify the webhook signature
  // const isValid = verifyTelnyxWebhook(telnyxSignature, telnyxTimestamp, JSON.stringify(event), process.env.TELNYX_PUBLIC_KEY);
  // if (!isValid) {
  //   return res.status(400).send('Invalid signature');
  // }

  console.log('Received webhook event:', event.data.event_type);

  // Handle different event types
  switch (event.data.event_type) {
    case 'message.received':
      // Handle incoming SMS
      const smsData = event.data.payload;
      smsMessages.push({
        id: smsData.id,
        direction: 'inbound',
        from: smsData.from.phone_number,
        to: smsData.to[0].phone_number,
        text: smsData.text,
        timestamp: new Date().toISOString(),
      });
      break;
      
    case 'call.initiated':
    case 'call.answered':
    case 'call.hangup':
    case 'call.recording.saved':
      // Handle call events
      const callData = event.data.payload;
      const existingCallIndex = callLogs.findIndex(call => call.id === callData.call_control_id);
      
      if (existingCallIndex >= 0) {
        callLogs[existingCallIndex].status = event.data.event_type.split('.')[1];
        callLogs[existingCallIndex].updated_at = new Date().toISOString();
      } else if (event.data.event_type === 'call.initiated' && callData.direction === 'incoming') {
        // New incoming call
        callLogs.push({
          id: callData.call_control_id,
          direction: 'inbound',
          from: callData.from,
          to: callData.to,
          status: 'initiated',
          timestamp: new Date().toISOString(),
        });
      }
      break;
      
    default:
      console.log('Unhandled event type:', event.data.event_type);
  }

  res.status(200).send('Webhook received');
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook URL: ${process.env.VITE_APP_DOMAIN}/webhook`);
});

// Helper function to verify Telnyx webhook signatures (for production use)
function verifyTelnyxWebhook(signature, timestamp, body, publicKey) {
  // In a real implementation, you would verify the ED25519 signature here
  // This is a placeholder for demonstration purposes
  return true;
}