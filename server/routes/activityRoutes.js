const express = require("express");
const router = express.Router();
const { createActivity, getActivities } = require("../controllers/activityController");

// POST: Add activity
router.post("/", createActivity);

// GET: Fetch all activities
router.get("/", getActivities);

module.exports = router;
