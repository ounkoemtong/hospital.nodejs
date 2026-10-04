// src/modules/Permissions/permission.controller.js
import { PermissionModel } from './permission.model.js';

// 📋 1. យកទិន្នន័យ Permissions ទាំងអស់
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await PermissionModel.getAll();
    res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➕ 2. បង្កើត Permission ថ្មី
export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Permission name is required' });
    }
    const newPermission = await PermissionModel.create(name, description);
    res.status(201).json({ success: true, message: 'Permission created successfully', data: newPermission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ 3. កែប្រែ Permission
export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Permission name is required' });
    }
    const updated = await PermissionModel.update(id, name, description);
    res.status(200).json({ success: true, message: 'Permission updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑️ 4. លុប Permission
export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    await PermissionModel.delete(id);
    res.status(200).json({ success: true, message: 'Permission deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 5. មើលសិទ្ធិរបស់ Role តាម ID
export const getRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const permissions = await PermissionModel.getPermissionsByRoleId(roleId);
    res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ➕ 6. បន្ថែមសិទ្ធិឱ្យ Role (Assign)
export const assignPermissionToRole = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;
    if (!role_id || !permission_id) {
      return res.status(400).json({ success: false, message: 'role_id and permission_id are required!' });
    }
    const result = await PermissionModel.assignPermissionToRole(role_id, permission_id);
    res.status(201).json({ success: true, message: 'Permission assigned successfully!', data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ❌ 7. ដកហូតសិទ្ធិពី Role (Remove)
export const removePermissionFromRole = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;
    if (!role_id || !permission_id) {
      return res.status(400).json({ success: false, message: 'role_id and permission_id are required!' });
    }
    const affectedRows = await PermissionModel.removePermissionFromRole(role_id, permission_id);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found!' });
    }
    res.status(200).json({ success: true, message: 'Permission removed from role successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};