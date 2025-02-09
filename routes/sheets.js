const express = require('express');
const { fetchSheetData, fetchAllFormsData } = require('../config/googleSheets');
const FormData = require('../models/FormData');
const User = require('../models/User');
const authenticateUser = require("../middleware/authMiddleware");
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

router.get("/fetchData", authenticateUser, async (req, res) => {
  try {
    const userEmail = req.user.email; // Get email from JWT payload

    console.log(`Fetching form data for user: ${userEmail}`);
    const formData = await FormData.find({ "formData.email": userEmail }); // Find user's form submissions

    if (!formData || formData.length === 0) {
      return res.status(404).json({ message: "No form data found for this user" });
    }

    res.json(formData);
  } catch (err) {
    console.error("❌ Error fetching form data:", err);
    res.status(500).json({ message: "Failed to fetch form data" });
  }
});


module.exports = router;
