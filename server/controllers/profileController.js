import Profile from "../models/Profile.js";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      // Create a default profile if none exists
      profile = await Profile.create({ user: req.user.id, notifications: { email: true, sms: false } });
    }
    const user = await User.findById(req.user.id);
    const profileData = profile.toObject ? profile.toObject() : { ...profile };
    if (user) {
      profileData.name = user.name;
      profileData.email = user.email;
    }
    res.json(profileData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, upsert: true }
    );
    const user = await User.findById(req.user.id);
    const profileData = profile.toObject ? profile.toObject() : { ...profile };
    if (user) {
      profileData.name = user.name;
      profileData.email = user.email;
    }
    res.json(profileData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
