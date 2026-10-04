// src/modules/patients/patient.controller.js
import { PatientModel } from './patient.model.js';

// ១. មុខងារទាញយកទិន្នន័យអ្នកជំងឺទាំងអស់
export const getAllPatients = async (req, res) => {
  try {
    const patients = await PatientModel.findAll();
    res.status(200).json({
      status: 'success',
      data: patients
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ២. មុខងារបង្កើតអ្នកជំងឺថ្មី
export const createPatient = async (req, res) => {
  try {
    const newPatient = await PatientModel.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Patient created successfully!',
      data: newPatient
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ៣. មុខងារកែប្រែព័ត៌មានអ្នកជំងឺ (Update)
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params; // យក ID มาจาก URL (ឧទាហរណ៍: /api/patients/1)
    const updatedPatient = await PatientModel.update(id, req.body);
    
    res.status(200).json({
      status: 'success',
      message: 'Patient updated successfully!',
      data: updatedPatient
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ៤. មុខងារលុបអ្នកជំងឺ (Delete)
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params; // យក ID មកពី URL
    const affectedRows = await PatientModel.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Patient not found!'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Patient deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};