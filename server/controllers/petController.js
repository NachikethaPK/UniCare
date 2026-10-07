import Pet from "../models/Pet.js";
import PetVaccination from "../models/PetVaccination.js";

export const getPets = async (req, res) => {
  try {
    const pets = await Pet.find({ user: req.user.id });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPet = async (req, res) => {
  try {
    const pet = await Pet.create({ ...req.body, user: req.user.id });
    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getVaccinations = async (req, res) => {
  try {
    // Optional: filter by pet ID
    const { petId } = req.query;
    let filter = {};
    if (petId) {
      filter.pet = petId;
    } else {
      // Find all pets for the user, then get their vaccinations
      const pets = await Pet.find({ user: req.user.id }).select("_id");
      const petIds = pets.map(p => p._id);
      filter.pet = { $in: petIds };
    }
    
    const vaccinations = await PetVaccination.find(filter);
    res.json(vaccinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addVaccination = async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.body.pet, user: req.user.id });
    if (!pet) return res.status(404).json({ message: "Pet not found or unauthorized" });
    
    const vaccination = await PetVaccination.create(req.body);
    res.status(201).json(vaccination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
