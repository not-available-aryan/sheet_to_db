const express = require("express");
const { fetchSheetData, fetchAllFormsData } = require("../config/googleSheets");
const FormData = require("../models/FormData");
const User = require("../models/User");
const authenticateUser = require("../middleware/authMiddleware");
const {evaluateForm1} = require("../evaluation/form1Evaluation")
const router = express.Router();
require("dotenv").config();


router.post("/syncAll", async (req, res) => {
  try {
    const allFormsData = await fetchAllFormsData();
    console.log(
      "✅ All forms data fetched:",
      JSON.stringify(allFormsData, null, 2)
    );

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

        const { totalScore } = evaluateForm1({
          userId: user._id,
          formData,
        }).totalScore;

        await FormData.create({
          userId: user._id,
          formType,
          formData,
          totalScore, // Save evaluated score
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
      return res
        .status(404)
        .json({ message: "No form data found for this user" });
    }

    res.json(formData);
  } catch (err) {
    console.error("❌ Error fetching form data:", err);
    res.status(500).json({ message: "Failed to fetch form data" });
  }
});


router.post("/submitFormData", async (req, res) => {
  try {
    const formData = req.body;
    const { email, formType } = formData;

    if (!email || !formType) {
      return res.status(400).json({ message: "Missing email or formType" });
    }

    console.log(`📥 Received ${formType} data from Google Sheets`, formData);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: `User with email ${email} not found` });
    }

    // Select appropriate evaluation function
    let totalScore;
    if (formType === "Form1") {
      totalScore = evaluateForm1({ userId: user._id, formData }).totalScore;
    } else if (formType === "Form2") {
      // totalScore = evaluateForm2({ userId: user._id, formData }).totalScore;
      console.log('form2 evaluation function needs to be made')
    } else if (formType === "Form3") {
      // totalScore = evaluateForm3({ userId: user._id, formData }).totalScore;
      console.log('form3 evaluation function needs to be made')
    } else {
      return res.status(400).json({ message: "Invalid formType" });
    }

    // Save to MongoDB
    const newFormEntry = new FormData({
      userId: user._id,
      formType,
      formData,
      totalScore,
    });

    await newFormEntry.save();
    console.log(`✅ Form data saved for ${email} (${formType}) with totalScore: ${totalScore}`);

    res.json({ message: "Form data processed successfully", totalScore });
  } catch (err) {
    console.error("❌ Error processing form data:", err);
    res.status(500).json({ message: "Server error" });
  }
})



// router.post("/syncForm1", (req, res) => processFormSubmission("Form1", evaluateForm1, res));
// router.post("/syncForm2", (req, res) => processFormSubmission("Form2", evaluateForm2, res));
// router.post("/syncForm3", (req, res) => processFormSubmission("Form3", evaluateForm3, res));

module.exports = router;
