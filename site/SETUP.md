# Setup — filling in the placeholders

The site runs and builds fine with zero real values (`npm run dev` / `npm run build`), but a few things need to be supplied before it's fully live. All of them are read from `site/.env` (copy `.env.example` to `.env` first) via `src/config.ts`. None of them are secret — they ship inside the client bundle — so this is purely for convenience, not security.

## 1. WhatsApp numbers

Set `VITE_WHATSAPP_BRIDE` and `VITE_WHATSAPP_GROOM`, digits only with country code, no `+` or spaces (e.g. `919876543210`). RSVPs are routed to whichever side's number matches the guest's Team Ladki/Ladke pick — the bride's number is the fallback when no team has been picked yet, or when the matching side's number isn't set. Until *both* are unset, the "Send RSVP on WhatsApp" button stays disabled and reads "WhatsApp number not set yet." — as soon as either one is set, the button works (routing to whichever is available).

## 2. RSVP deadline

Set `VITE_RSVP_DEADLINE` to an ISO date (`YYYY-MM-DD`). Shown to guests under the RSVP form. Defaults to `2026-07-20`.

## 3. Venue directions link

`VITE_VENUE_MAPS_LINK` already defaults to the couple's real map link (`https://maps.app.goo.gl/BGt7gv9gKCA6Kapk6`, Mango Bloom River Resort, Jim Corbett) — only override it if that changes. If you do, ideally use a link that starts turn-by-turn navigation from the guest's location rather than just opening a place card:

```
https://www.google.com/maps/dir/?api=1&destination=<place name, or lat,lng>
```

If the configured link doesn't contain `google.com/maps`, `goo.gl/maps`, or `maps.app.goo.gl`, the Directions button on the "Getting There" section visibly flags itself as not configured yet.

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
     -d '{"name":"Test Guest","attending":"yes","celebrations":["haldi","wedding"],"headcount":"2","contact":"test@example.com","songRequest":"Kesariya","teamPick":"ladki","travelOption":"road-delhi","wantsTrainCoach":false,"message":"hi"}' \
     "<your /exec URL>"
   ```
   Then check the Sheet — a new `RSVPs` tab should appear (if it doesn't already exist) with columns Timestamp / Name / Attending / Celebrations / Headcount / Contact / Song Request / Team Pick / Travel Option / Wants Train Coach / Message, and a row for "Test Guest."

### Why the frontend uses `mode: 'no-cors'`

Apps Script Web Apps don't return CORS headers, so a normal `fetch` with a JSON `Content-Type` triggers a preflight request that Apps Script can't satisfy. The site works around this by POSTing with `mode: 'no-cors'` and a `text/plain` body (see `src/lib/sheet.ts`), which avoids the preflight entirely. The tradeoff: the response becomes opaque, so the app can't tell if the write succeeded — it fires the request and moves on, treating the WhatsApp message as the guest-visible confirmation. If a submission doesn't show up in the Sheet, check the Apps Script deployment (Execute as/Access settings) rather than expecting an error in the browser console.

### Redeploying after editing `Code.gs`

Every time you change the script, you must **Deploy → Manage deployments → Edit (pencil icon) → New version** — just saving the script does *not* update the live `/exec` URL.
