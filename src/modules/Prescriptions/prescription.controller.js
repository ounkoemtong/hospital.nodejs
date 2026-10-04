// src/modules/prescriptions/prescription.controller.js
import { PrescriptionModel } from './prescription.model.js';

export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await PrescriptionModel.findAll();
    res.status(200).json({ status: 'success', data: prescriptions });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await PrescriptionModel.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ status: 'fail', message: 'Prescription not found!' });
    }
    res.status(200).json({ status: 'success', data: prescription });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createPrescription = async (req, res) => {
  try {
    const newPrescription = await PrescriptionModel.create(req.body);
    res.status(201).json({ status: 'success', message: 'Prescription created successfully!', data: newPrescription });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await PrescriptionModel.findById(id);
    if (!existing) {
      return res.status(404).json({ status: 'fail', message: 'Prescription not found!' });
    }
    const updated = await PrescriptionModel.update(id, req.body);
    res.status(200).json({ status: 'success', message: 'Prescription updated successfully!', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const affected = await PrescriptionModel.delete(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ status: 'fail', message: 'Prescription not found!' });
    }
    res.status(200).json({ status: 'success', message: 'Prescription deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};