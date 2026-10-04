// src/modules/Permissions/permission.model.js
import db from '../../config/db.js';

export const PermissionModel = {
  // ─── ផ្នែក Permissions ដើម ───
  async getAll() {
    const [rows] = await db.query('SELECT * FROM permissions');
    return rows;
  },
  async create(name, description) {
    const [result] = await db.query(
      'INSERT INTO permissions (name, description) VALUES (?, ?)',
      [name, description]
    );
    return { id: result.insertId, name, description };
  },
  async update(id, name, description) {
    await db.query('UPDATE permissions SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    return { id, name, description };
  },
  async delete(id) {
    await db.query('DELETE FROM permissions WHERE id = ?', [id]);
    return true;
  },

  // ─── ផ្នែក Role-Permissions (Assign/Remove) ───
  async getPermissionsByRoleId(roleId) {
    const [rows] = await db.query(`
      SELECT p.id as permission_id, p.name, p.description
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role_id = ?
    `, [roleId]);
    return rows;
  },

  async assignPermissionToRole(roleId, permissionId) {
    const [existing] = await db.query(
      'SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?',
      [roleId, permissionId]
    );
    if (existing.length > 0) {
      throw new Error('This role already has this permission!');
    }
    await db.query(
      'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
      [roleId, permissionId]
    );
    return { role_id: roleId, permission_id: permissionId };
  },

  async removePermissionFromRole(roleId, permissionId) {
    const [result] = await db.query(
      'DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?',
      [roleId, permissionId]
    );
    return result.affectedRows;
  }
};