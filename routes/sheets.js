const express = require("express");
const { fetchSheetData, fetchAllFormsData } = require("../config/googleSheets");
const FormData = require("../models/FormData");
const User = require("../models/User");
const authenticateUser = require("../middleware/authMiddleware");
const {evaluateForm1} = require("../evaluation/form1Evaluation");
const {evaluateForm2} = require("../evaluation/form2Evaluation");
const {evaluateUGCForm1} = require("../evaluation/UGCform1Evaluation");
const {evaluateUGCForm2} = require("../evaluation/UGCform2Evaluation");
const router = express.Router();
require("dotenv").config();



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
      totalScore = evaluateForm2({ userId: user._id, formData }).totalScore;
    } else if (formType === "Form3") {
      console.log('form3 evaluation function needs to be made')
    } else if (formType === "UGCForm1") {
      totalScore = evaluateUGCForm1({ userId: user._id, formData }).totalScore;
    } else if (formType === "UGCForm2") {
      totalScore = evaluateUGCForm2({ userId: user._id, formData }).totalScore;
    } else if (formType === "UGCForm3Engineering") {
      console.log('form3 evaluation function needs to be made')
    } else if (formType === "UGCForm3Language") {
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


module.exports = router;
