import BloodDonor from "../models/BloodDonor.js";
import BloodRequest from "../models/BloodRequest.js";

export const getDonors = async (req, res) => {
  try {
    const donors = await BloodDonor.find().sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDonor = async (req, res) => {
  try {
    const donor = await BloodDonor.create({ ...req.body, user: req.user?.id });
    res.status(201).json(donor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.hospitalId) filter.hospitalId = req.query.hospitalId;

    const requests = await BloodRequest.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRequest = async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      user: req.user?.id,
      postedByRole: req.user?.role || req.body.postedByRole || "hospital",
    };

    // If hospital user, automatically fill hospital details if not present
    if (req.user?.role === "hospital" && req.user?.hospitalDetails) {
      if (!requestData.hospitalName) requestData.hospitalName = req.user.name;
      if (!requestData.hospitalAddress) requestData.hospitalAddress = req.user.hospitalDetails.address;
      if (!requestData.lat && req.user.hospitalDetails.lat) requestData.lat = req.user.hospitalDetails.lat;
      if (!requestData.lng && req.user.hospitalDetails.lng) requestData.lng = req.user.hospitalDetails.lng;
      if (!requestData.contact && req.user.hospitalDetails.emergencyContact)
        requestData.contact = req.user.hospitalDetails.emergencyContact;
      requestData.hospitalId = req.user.id;
    }

    const request = await BloodRequest.create(requestData);
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
