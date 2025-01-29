const express = require('express');
const { fetchSheetData, fetchAllFormsData } = require('../config/googleSheets');
const FormData = require('../models/FormData');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

const SPREADSHEETID = process.env.SPREADSHEET_ID;
const range = process.env.RANGE; // Adjust based on your Google Sheet's range

router.post('/syncAll', async (req, res) => {
  try {
    const allFormsData = await fetchAllFormsData();
    console.log("✅ All forms data fetched:", JSON.stringify(allFormsData, null, 2));

    if (!allFormsData || allFormsData.length === 0) {
      return res.status(400).json({ message: "❌ No data found in any form" });
    }

    for (const { formType, headers, dataRows } of allFormsData) {
      console.log(`Processing form type: ${formType}`);
      console.log("Headers:", headers);
      console.log("Data Rows:", dataRows);

      if (!Array.isArray(dataRows)) {
        console.error(`❌ Error: Expected array but got ${typeof dataRows}`);
        continue;
      }

      for (const row of dataRows) {
        const formData = {};
        headers.forEach((header, index) => {
          formData[header] = row[index] || null;
        });

        console.log("Mapped Form Data:", formData);

        // Save to MongoDB
        const email = formData.email;
        if (!email) {
          console.log("Skipping row: No email found.");
          continue;
        }

        const user = await User.findOne({ email });
        if (!user) {
          console.log(`User with email ${email} not found, skipping.`);
          continue;
        }

        await FormData.create({
          userId: user._id,
          formType,
          formData,
        });
      }
    }

    res.json({ message: "✅ Data synced successfully for all forms" });
  } catch (err) {
    console.error("❌ Failed to sync data:", err);
    res.status(500).json({ message: "Failed to sync data" });
  }
});


// router.post('/syncAll', async (req, res) => {
//   try {
//     const allFormsData = await fetchAllFormsData();

//     const syncedData = [];

//     for (let formIndex = 0; formIndex < allFormsData.length; formIndex++) {
//       const formData = allFormsData[formIndex];

//       if (!formData || formData.length === 0) continue;

//       const headers = formData[0]; // Extract headers
//       const dataRows = formData.slice(1); // Rows

//       for (const row of dataRows) {
//         const formEntry = {};
//         headers.forEach((header, index) => {
//           formEntry[header] = row[index] || null;
//         });

//         const email = formEntry.Email; // Adjust based on actual header
//         if (!email) continue;

//         const user = await User.findOne({ email });
//         if (!user) continue;

//         // Save form data to the database
//         const dataEntry = await FormData.create({
//           userId: user._id,
//           formType: `Form${formIndex + 1}`, // Tag with form type
//           formData: formEntry,
//         });

//         syncedData.push(dataEntry);
//       }
//     }

//     res.send({ message: 'Data synced successfully for all forms', syncedData });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Failed to sync data');
//   }
// });


module.exports = router;
