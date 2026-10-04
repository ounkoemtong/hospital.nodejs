// src/modules/doctors/doctor.controller.js
import { DoctorModel } from './doctor.model.js';

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorModel.findAll();
    res.status(200).json({ status: 'success', data: doctors });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await DoctorModel.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ status: 'fail', message: 'Doctor not found!' });
    }
    res.status(200).json({ status: 'success', data: doctor });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const newDoctor = await DoctorModel.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Doctor created successfully!',
      data: newDoctor
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const existingDoctor = await DoctorModel.findById(id);
    if (!existingDoctor) {
      return res.status(404).json({ status: 'fail', message: 'Doctor not found!' });
    }

    const updatedDoctor = await DoctorModel.update(id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Doctor updated successfully!',
      data: updatedDoctor
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const deleteDoctor = async (req, res) => {
  try {
    const affectedRows = await DoctorModel.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ status: 'fail', message: 'Doctor not found!' });
    }
    res.status(200).json({
      status: 'success',
      message: 'Doctor deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};