const Activity = require("../models/activityModels");

// ✅ Add new activity
exports.createActivity = async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all activities (latest first)
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ time: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
