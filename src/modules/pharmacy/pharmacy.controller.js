// src/modules/pharmacy/pharmacy.controller.js
import { PharmacyModel } from './pharmacy.models.js';

export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await PharmacyModel.findAll();
    res.status(200).json({ status: 'success', data: medicines });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const medicine = await PharmacyModel.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ status: 'fail', message: 'Medicine not found!' });
    }
    res.status(200).json({ status: 'success', data: medicine });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createMedicine = async (req, res) => {
  try {
    const newMedicine = await PharmacyModel.create(req.body);
    res.status(201).json({ status: 'success', message: 'Medicine added successfully!', data: newMedicine });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await PharmacyModel.findById(id);
    if (!existing) {
      return res.status(404).json({ status: 'fail', message: 'Medicine not found!' });
    }
    const updated = await PharmacyModel.update(id, req.body);
    res.status(200).json({ status: 'success', message: 'Medicine updated successfully!', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const affected = await PharmacyModel.delete(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ status: 'fail', message: 'Medicine not found!' });
    }
    res.status(200).json({ status: 'success', message: 'Medicine deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};