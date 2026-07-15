/**
 * RSVP endpoint for Shikha & Amit's wedding site.
 * Deploy this in the Apps Script editor bound to the target Google Sheet
 * (Extensions → Apps Script), then Deploy → New deployment → Web app.
 * See ../SETUP.md for the full walkthrough.
 */

function doPost(e) {
  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVPs') ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet('RSVPs');

  var data = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Name',
      'Attending',
      'Celebrations',
      'Headcount',
      'Contact',
      'Song Request',
      'Team Pick',
      'Travel Option',
      'Wants Train Coach',
      'Message',
    ]);
  }

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.attending || '',
    (data.celebrations || []).join(', '),
    data.headcount || '',
    data.contact || '',
    data.songRequest || '',
    data.teamPick || '',
    data.travelOption || '',
    data.wantsTrainCoach ? 'Yes' : 'No',
    data.message || '',
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('RSVP endpoint is live.');
}
