const { google } = require('googleapis');
const credentials = require('../credentials/service-account.json');
const LastProcessedRow = require('../models/LastProcessedRow');

const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
const getAuthClient = async () => {
  return await auth.getClient();
};

// Function to fetch data from Google Sheets
const fetchSheetData = async (spreadsheetId, range) => {
  const authClient = await getAuthClient();

  const response = await sheets.spreadsheets.values.get({
    auth: authClient,
    spreadsheetId,
    range,
  });

  return response.data.values; // Rows from the sheet
};

const FORM_SHEETS = [
  {
    formType: "Form1",
    spreadsheetId: process.env.SPREADSHEET_ID_FORM1,
    range: process.env.RANGE_FORM1,
  },
  {
    formType: "Form2",
    spreadsheetId: process.env.SPREADSHEET_ID_FORM2,
    range: process.env.RANGE_FORM2,
  },
  {
    formType: "Form3",
    spreadsheetId: process.env.SPREADSHEET_ID_FORM3,
    range: process.env.RANGE_FORM3,
  }
];

const fetchAllFormsData = async () => {
  console.log("Fetching data from all Google Sheets...");
  const allData = [];

  for (const { formType, spreadsheetId, range } of FORM_SHEETS) {
    console.log(`Fetching form type: ${formType} from ${spreadsheetId}, range: ${range}`);

    const rows = await fetchSheetData(spreadsheetId, range);

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      console.log(`❌ No data found for form: ${formType}`);
      continue;
    }

    console.log(`✅ Fetched ${rows.length} rows for form: ${formType}`, rows);

    const headers = rows[0]; // First row contains column names
    const dataRows = rows.slice(1); // Remaining rows are data

    allData.push({ formType, headers, dataRows });
  }

  console.log("Final fetched data from all sheets:", JSON.stringify(allData, null, 2));

  return allData;
};



module.exports = { fetchSheetData, fetchAllFormsData, getAuthClient };









// const fetchAllFormsData = async () => {
//   console.log("Fetching data from all Google Sheets...");
//   console.log("FORM_SHEETS data:", FORM_SHEETS); // Check if FORM_SHEETS is populated

//   const allData = [];

//   for (const { formType, spreadsheetId, range } of FORM_SHEETS) {
//     if (!spreadsheetId || !range) {
//       console.error(`Missing spreadsheetId or range for form: ${formType}`);
//       continue;
//     }

//     console.log(`Fetching form type: ${formType} from ${spreadsheetId}, range: ${range}`);

//     const rows = await fetchSheetData(spreadsheetId, range);

//     if (!rows || rows.length === 0) {
//       console.log(`No data found for form: ${formType}`);
//       continue;
//     }

//     console.log(`Fetched ${rows.length} rows for form: ${formType}`, rows);

//     const headers = rows[0];
//     const dataRows = rows.slice(1);

//     allData.push({ formType, headers, dataRows });
//   }

//   console.log("Final fetched data from all sheets:", JSON.stringify(allData, null, 2));

//   return allData;
// };


// const fetchAllFormsData = async () => {
//   console.log("Fetching data from all Google Sheets...")
//   const formsData = [];

//   // Fetch data for each form
//   const formIds = [
//     process.env.SPREADSHEET_ID_FORM1,
//     process.env.SPREADSHEET_ID_FORM2,
//     process.env.SPREADSHEET_ID_FORM3,
//     // process.env.SPREADSHEET_ID_FORM4,
//     // process.env.SPREADSHEET_ID_FORM5,
//     // process.env.SPREADSHEET_ID_FORM6,
//   ];

//   const ranges = [
//     process.env.RANGE_FORM1,
//     process.env.RANGE_FORM2,
//     process.env.RANGE_FORM3,
//     // process.env.RANGE_FORM4,
//     // process.env.RANGE_FORM5,
//     // process.env.RANGE_FORM6,
//   ];

//   for (let i = 0; i < formIds.length; i++) {
//     const data = await fetchSheetData(formIds[i], ranges[i]);
//     formsData.push(data);
//   }

//   return formsData;
// };

// async function fetchLatestFormData(formType) {
//   try {
//     // Get last processed row for the given form type
//     let lastProcessed = await LastProcessedRow.findOne({ formType });
//     let lastRow = lastProcessed ? lastProcessed.lastRow : 1; // Default to 1 if no record exists

//     // Fetch all data from Google Sheets
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: SPREADSHEET_ID,
//       range: RANGE,
//     });

//     const rows = response.data.values;
//     if (!rows || rows.length <= lastRow) {
//       return []; // No new data available
//     }

//     const headers = rows[0]; // First row is the header
//     const newRows = rows.slice(lastRow + 1); // Get new rows only

//     // Update the last processed row in MongoDB
//     await LastProcessedRow.findOneAndUpdate(
//       { formType },
//       { lastRow: rows.length - 1 }, // Store the latest row number
//       { upsert: true, new: true }
//     );

//     // Convert new rows to JSON format
//     return newRows.map((row) => {
//       let formData = {};
//       headers.forEach((header, index) => {
//         formData[header] = row[index] || null;
//       });
//       return { formType, formData };
//     });
//   } catch (error) {
//     console.error("Error fetching latest form data:", error);
//     return [];
//   }
// }