/**
 * GMB_Dispatcher
 * The master API bridge that connects a generated client site (Spoke) to the GMB Creation Co Mothership (Hub).
 * This utility handles zero-trust token encryption and forwards lead payloads to the central Supabase backend.
 */

export interface LeadPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  serviceRequested: string;
  urgency: 'STANDARD' | 'EMERGENCY';
  sourceUrl: string;
}

export class GMBDispatcher {
  private static async generateSignature(payload: string, token: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(token);
    
    // Web Crypto API HMAC Generation
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    
    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payload));
    return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async dispatchLead(data: LeadPayload): Promise<boolean> {
    try {
      // In a production environment, these env vars are automatically injected by the repo's deploy pipeline
      const agencyToken = import.meta.env.VITE_GMB_AGENCY_TOKEN || 'dev_mock_token';
      const mothershipUrl = import.meta.env.VITE_GMB_MOTHERSHIP_URL || 'https://gmb-creation.co/api/v1/intake';

      const timestamp = new Date().toISOString();
      const payloadString = JSON.stringify({ ...data, timestamp });
      
      const signature = await this.generateSignature(payloadString, agencyToken);

      console.log('[GMB_Dispatcher] Routing lead to Supabase Omniagents...');

      const response = await fetch(mothershipUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-GMB-Signature': signature,
          'X-GMB-Client-ID': agencyToken.slice(0, 10) // Identifies the tenant for the Agency Dashboard
        },
        body: payloadString
      });

      if (!response.ok) {
        console.warn('[GMB_Dispatcher] Warning: Mothership unreachable. Falling back to local CRM push.');
        return false;
      }

      console.log('[GMB_Dispatcher] Success: Lead injected into GMB Central Nervous System.');
      return true;

    } catch (error) {
      console.error('[GMB_Dispatcher] Critical Bridge Failure:', error);
      return false;
    }
  }
}
