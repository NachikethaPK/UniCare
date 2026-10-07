import BloodDonor from "../models/BloodDonor.js";
import BloodRequest from "../models/BloodRequest.js";

export const getDonors = async (req, res) => {
  try {
    const donors = await BloodDonor.find();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDonor = async (req, res) => {
  try {
    const donor = await BloodDonor.create({ ...req.body, user: req.user.id });
    res.status(201).json(donor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRequest = async (req, res) => {
  try {
    const request = await BloodRequest.create({ ...req.body, user: req.user.id });
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const request = await BloodRequest.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: req.body.status },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
