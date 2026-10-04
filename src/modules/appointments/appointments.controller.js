// src/modules/appointments/appointment.controller.js
import { AppointmentModel } from './appointment.model.js';
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.findAll();
    res.status(200).json({ status: 'success', data: appointments });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await AppointmentModel.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ status: 'fail', message: 'Appointment not found!' });
    }
    res.status(200).json({ status: 'success', data: appointment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const newAppointment = await AppointmentModel.create(req.body);
    res.status(201).json({ status: 'success', message: 'Appointment created successfully!', data: newAppointment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await AppointmentModel.findById(id);
    if (!existing) {
      return res.status(404).json({ status: 'fail', message: 'Appointment not found!' });
    }
    const updated = await AppointmentModel.update(id, req.body);
    res.status(200).json({ status: 'success', message: 'Appointment updated successfully!', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const affected = await AppointmentModel.delete(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ status: 'fail', message: 'Appointment not found!' });
    }
    res.status(200).json({ status: 'success', message: 'Appointment deleted successfully!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};