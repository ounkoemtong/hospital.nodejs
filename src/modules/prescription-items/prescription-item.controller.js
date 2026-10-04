// src/modules/prescription-items/prescription-item.controller.js
import { PrescriptionItemModel } from './prescription-item.model.js';

export const getItemsByPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const items = await PrescriptionItemModel.findByPrescriptionId(prescriptionId);
    res.status(200).json({ status: 'success', data: items });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const addPrescriptionItem = async (req, res) => {
  try {
    const newItem = await PrescriptionItemModel.create(req.body);
    res.status(201).json({ 
      status: 'success', 
      message: 'Medicine added to prescription successfully!', 
      data: newItem 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const removePrescriptionItem = async (req, res) => {
  try {
    const affected = await PrescriptionItemModel.delete(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ status: 'fail', message: 'Prescription item not found!' });
    }
    res.status(200).json({ status: 'success', message: 'Prescription item removed successfully!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
export const getAllPrescriptionItems = async (req, res) => {
  try {
    const items = await PrescriptionItemModel.findAll();
    res.status(200).json({ status: 'success', data: items });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};