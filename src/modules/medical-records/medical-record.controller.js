import { MedicalRecordModel } from './medical-record.model.js';
import db from '../../config/db.js';
export const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecordModel.getAll();
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecordModel.getById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Medical record not found bro!" });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMyMedicalRecords = async (req, res) => {
  try {
    const userId = req.user.id; // ID របស់ User ដែលកំពុង Login
    const [patientRows] = await db.query(`SELECT id FROM patients WHERE user_id = ?`, [userId]);
    
    if (patientRows.length === 0) {
      return res.status(404).json({ success: false, message: "Patient profile not found for this user bro!" });
    }

    const patientId = patientRows[0].id;
    const records = await MedicalRecordModel.getByPatientId(patientId);
    
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMedicalRecord = async (req, res) => {
  try {
    const newId = await MedicalRecordModel.create(req.body);
    res.status(201).json({ success: true, message: "Medical record created successfully bro!", id: newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMedicalRecord = async (req, res) => {
  try {
    await MedicalRecordModel.update(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Medical record updated successfully bro!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMedicalRecord = async (req, res) => {
  try {
    await MedicalRecordModel.delete(req.params.id);
    res.status(200).json({ success: true, message: "Medical record deleted successfully bro!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};