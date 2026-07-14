import { config, isPlaceholder } from '../config';
import type { RsvpPayload } from './whatsapp';

/**
 * Fire-and-forget POST to the Google Apps Script Web App.
 * Apps Script doesn't return CORS headers, so we use mode:'no-cors' with a
 * text/plain body (avoids the preflight) — the response is opaque, so this
 * never throws on the app's behalf and must never block the WhatsApp flow.
 * See SETUP.md for how to deploy the script.
 */
export async function logRsvpToSheet(payload: RsvpPayload): Promise<void> {
  if (isPlaceholder.appsScript) {
    console.warn('[RSVP] VITE_APPS_SCRIPT_URL is not set — skipping Sheet log.', payload);
    return;
  }
  try {
    await fetch(config.appsScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('[RSVP] Failed to log RSVP to Sheet (non-blocking):', err);
  }
}
