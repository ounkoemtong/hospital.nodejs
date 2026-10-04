import db from '../config/db.js';

export const requirePermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user?.role_id;

      if (!roleId) {
        return res.status(401).json({ 
          success: false, 
          message: "Unauthorized: No role found for this user bro!" 
        });
      }

      const [rows] = await db.query(
        `SELECT p.name FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         WHERE rp.role_id = ? AND p.name = ?`,
        [roleId, permissionName]
      );


      if (rows.length === 0) {
        return res.status(403).json({ 
          success: false, 
          message: `Forbidden: You do not have the '${permissionName}' permission bro!` 
        });
      }


      next();
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
};