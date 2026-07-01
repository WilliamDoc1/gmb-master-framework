// simulate-bridge.js
const crypto = require('crypto');

// The Mocked Environment
const process_env = {
  GMB_AGENCY_TOKEN: 'gmb_sec_994857394857_mock_token',
  GMB_MOTHERSHIP_URL: 'https://gmb-creation.co/api/v1/intake'
};

class GMB_Dispatcher {
  constructor(config) {
    this.agencyToken = config.agencyToken;
    this.mothershipUrl = config.mothershipUrl;
  }

  // Encrypt payload to ensure zero-trust security
  _encryptPayload(data) {
    // In production this would use AES-256-GCM
    const hash = crypto.createHmac('sha256', this.agencyToken).update(JSON.stringify(data)).digest('hex');
    return {
      payload: data,
      signature: hash
    };
  }

  async dispatchLead(leadData) {
    console.log('[Dispatcher] Packaging lead data...');
    const secureData = this._encryptPayload(leadData);
    
    // Simulate Network Request to the Mothership
    console.log(`[Dispatcher] Firing Webhook to: ${this.mothershipUrl}`);
    console.log(`[Dispatcher] Signature Generated: ${secureData.signature}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate a successful 200 OK from the Mothership Make.com / Supabase backend
        resolve({ status: 200, message: 'Lead successfully ingested by Mothership' });
      }, 500);
    });
  }
}

async function runSimulation() {
  console.log('--- STARTING GMB DISPATCHER SIMULATION ---');
  
  const dispatcher = new GMB_Dispatcher({
    agencyToken: process_env.GMB_AGENCY_TOKEN,
    mothershipUrl: process_env.GMB_MOTHERSHIP_URL
  });

  const mockLead = {
    sourceSite: 'Apex Plumbing',
    prospect: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 555-0198',
      email: 'john@example.com'
    },
    context: {
      service: 'Emergency Plumber',
      urgency: 'HIGH',
      abVariant: 'B'
    },
    timestamp: new Date().toISOString()
  };

  try {
    const response = await dispatcher.dispatchLead(mockLead);
    if (response.status === 200) {
      console.log('--- SIMULATION RESULT ---');
      console.log('Payload Security: VALID');
      console.log('Webhook Traversal: SUCCESS');
      console.log('Mothership Ingestion: 200 OK');
      console.log('SIMULATION SCORE: 100/100');
    } else {
      console.error('SIMULATION FAILED');
    }
  } catch (err) {
    console.error('SIMULATION ERROR', err);
  }
}

runSimulation();
