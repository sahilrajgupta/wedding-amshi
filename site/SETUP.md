# Setup — filling in the placeholders

The site runs and builds fine with zero real values (`npm run dev` / `npm run build`), but four things need to be supplied before it's fully live. All of them are read from `site/.env` (copy `.env.example` to `.env` first) via `src/config.ts`. None of them are secret — they ship inside the client bundle — so this is purely for convenience, not security.

## 1. WhatsApp number

Set `VITE_WHATSAPP_PHONE` to the number RSVPs should go to, digits only with country code, no `+` or spaces (e.g. `919876543210`). Until this is set, the "Send RSVP on WhatsApp" button on the site stays disabled and reads "WhatsApp number not set yet."

## 2. RSVP deadline

Set `VITE_RSVP_DEADLINE` to an ISO date (`YYYY-MM-DD`). Shown to guests under the RSVP form. Defaults to `2026-12-20`.

## 3. Venue directions link

Set `VITE_VENUE_MAPS_LINK` to a real Google Maps **directions** link for Mango Bloom Riverview Resort, Jim Corbett — ideally one that starts turn-by-turn navigation from the guest's location rather than just opening a place card:

```
https://www.google.com/maps/dir/?api=1&destination=<place name, or lat,lng>
```

Until this is set (or it doesn't contain `google.com/maps`/`goo.gl/maps`), the Directions button on the "Getting There" section visibly flags itself as not configured yet.

## 4. RSVP → Google Sheet logging (Google Apps Script)

The site logs every RSVP to a Google Sheet via a small script you deploy yourself in your own Google account — this can't be provisioned by Claude, it needs your Google login.

1. Open (or create) the Google Sheet you want RSVPs logged to.
2. **Extensions → Apps Script.**
3. Delete the placeholder code and paste in the contents of [`apps-script/Code.gs`](apps-script/Code.gs).
4. **Deploy → New deployment.**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click Deploy, authorize the script when prompted, and copy the resulting URL (ends in `/exec`).
6. Paste it into `.env` as `VITE_APPS_SCRIPT_URL`.
7. **Test it before wiring the frontend:**
   ```sh
   curl -X POST -H "Content-Type: text/plain" \
     -d '{"name":"Test Guest","headcount":"2","teamPick":"ladki","travelOption":"road-delhi","wantsTrainCoach":false,"message":"hi"}' \
     "<your /exec URL>"
   ```
   Then check the Sheet — a new `RSVPs` tab should appear (if it doesn't already exist) with a row for "Test Guest."

### Why the frontend uses `mode: 'no-cors'`

Apps Script Web Apps don't return CORS headers, so a normal `fetch` with a JSON `Content-Type` triggers a preflight request that Apps Script can't satisfy. The site works around this by POSTing with `mode: 'no-cors'` and a `text/plain` body (see `src/lib/sheet.ts`), which avoids the preflight entirely. The tradeoff: the response becomes opaque, so the app can't tell if the write succeeded — it fires the request and moves on, treating the WhatsApp message as the guest-visible confirmation. If a submission doesn't show up in the Sheet, check the Apps Script deployment (Execute as/Access settings) rather than expecting an error in the browser console.

### Redeploying after editing `Code.gs`

Every time you change the script, you must **Deploy → Manage deployments → Edit (pencil icon) → New version** — just saving the script does *not* update the live `/exec` URL.
