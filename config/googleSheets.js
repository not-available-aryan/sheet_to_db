const { google } = require('googleapis');
const credentials = require('../credentials/service-account.json');

const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Function to fetch data from Google Sheets
const fetchSheetData = async (spreadsheetId, range) => {
  try {
    const authClient = await auth.getClient();

    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId, // Pass spreadsheetId here
      range, // Pass range here
    });

    console.log(`Fetching data from Google Sheets: Spreadsheet ID: ${spreadsheetId}, Range: ${range}`);
    return response.data.values; // Rows from the sheet
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
};

module.exports = { fetchSheetData };
