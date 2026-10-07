import HealthRecord from "../models/HealthRecord.js";

export const getRecords = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { user: req.user.id };
    if (category) filter.category = category;
    
    const records = await HealthRecord.find(filter);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRecord = async (req, res) => {
  try {
    const record = await HealthRecord.create({ ...req.body, user: req.user.id });
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const result = await HealthRecord.deleteOne({ _id: req.params.id, user: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Record not found" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
