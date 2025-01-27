const express = require('express');
const { fetchSheetData } = require('../config/googleSheets');
const FormData = require('../models/FormData');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

const SPREADSHEETID = process.env.SPREADSHEET_ID;
const range = process.env.RANGE; // Adjust based on your Google Sheet's range

// Sync data from Google Sheets to MongoDB
router.post('/sync', async (req, res) => {
  try {
    const rows = await fetchSheetData(SPREADSHEETID, range);

    if (!rows || rows.length === 0) {
      return res.status(400).send('No data found in the sheet');
    }

    const headers = rows[0]; // Extract headers from the first row
    const dataRows = rows.slice(1); // Remaining rows are data

    const syncedData = [];

    for (const row of dataRows) {
      const formData = {};
      headers.forEach((header, index) => {
        formData[header] = row[index] || null; // Map headers to row values
      });

      const email = formData.Email; // Adjust based on the actual header name for email
      if (!email) {
        console.log('No email found for a row, skipping');
        continue;
      }

      const user = await User.findOne({ email });
      if (!user) {
        console.log(`User with email ${email} not found, skipping`);
        continue;
      }

      const dataEntry = await FormData.create({
        userId: user._id,
        formData,
      });

      syncedData.push(dataEntry);
    }

    res.send({ message: 'Data synced successfully', syncedData });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to sync data');
  }
});


module.exports = router;
