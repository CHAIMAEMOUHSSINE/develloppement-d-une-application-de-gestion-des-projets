const db = require('../config/db');

class Employee {
  // Récupérer tous les employés avec leurs informations utilisateur
  static getAll(callback) {
    const query = `
      SELECT e.*, u.name as user_name, u.email as user_email, u.role as user_role
      FROM employes e
      LEFT JOIN users u ON e.user_id = u.id
      ORDER BY e.id ASC
    `;
    db.query(query, callback);
  }

  // Récupérer un employé par ID avec ses informations utilisateur
  static getById(id, callback) {
    const query = `
      SELECT e.*, u.name as user_name, u.email as user_email, u.role as user_role
      FROM employes e
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.id = ?
    `;
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]); // Renvoie le premier résultat ou undefined
    });
  }

  // Récupérer un employé par user_id
  static getByUserId(userId, callback) {
    const query = `
      SELECT e.*, u.name as user_name, u.email as user_email, u.role as user_role
      FROM employes e
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.user_id = ?
    `;
    db.query(query, [userId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]); // Renvoie le premier résultat ou undefined
    });
  }

  // Créer un employé (avec support du user_id)
  static create(employee, callback) {
    const { nom, prenom, telephone, adresse, departement, statut, user_id } = employee;
    const date_embauche = new Date().toISOString().slice(0, 10);
    
    db.query(
      'INSERT INTO employes (nom, prenom, telephone, adresse, departement, statut, date_embauche, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, telephone, adresse, departement, statut, date_embauche, user_id || null],
      callback
    );
  }

  // Mettre à jour un employé (avec support du user_id)
  static update(id, employee, callback) {
    const { nom, prenom, telephone, adresse, departement, statut, user_id } = employee;
    
    // Construire la requête dynamiquement selon les champs fournis
    const fields = [];
    const values = [];
    
    if (nom !== undefined) {
      fields.push('nom = ?');
      values.push(nom);
    }
    if (prenom !== undefined) {
      fields.push('prenom = ?');
      values.push(prenom);
    }
    if (telephone !== undefined) {
      fields.push('telephone = ?');
      values.push(telephone);
    }
    if (adresse !== undefined) {
      fields.push('adresse = ?');
      values.push(adresse);
    }
    if (departement !== undefined) {
      fields.push('departement = ?');
      values.push(departement);
    }
    if (statut !== undefined) {
      fields.push('statut = ?');
      values.push(statut);
    }
    if (user_id !== undefined) {
      fields.push('user_id = ?');
      values.push(user_id);
    }
    
    if (fields.length === 0) {
      return callback(new Error('Aucun champ à mettre à jour'));
    }
    
    values.push(id); // Ajouter l'ID pour la clause WHERE
    
    const query = `UPDATE employes SET ${fields.join(', ')} WHERE id = ?`;
    db.query(query, values, callback);
  }

  // Supprimer un employé
  static delete(id, callback) {
    db.query('DELETE FROM employes WHERE id = ?', [id], callback);
  }

  // Récupérer les employés sans user_id
  static getUnlinked(callback) {
    const query = `
      SELECT id, nom, prenom, departement, date_embauche, statut
      FROM employes 
      WHERE user_id IS NULL 
      ORDER BY id ASC
    `;
    db.query(query, callback);
  }

  // Récupérer les utilisateurs 'employee' disponibles (non liés)
  static getAvailableUsers(callback) {
    const query = `
      SELECT u.id, u.name, u.email 
      FROM users u 
      WHERE u.role = 'employee' 
      AND u.id NOT IN (SELECT COALESCE(user_id, 0) FROM employes WHERE user_id IS NOT NULL)
      ORDER BY u.id ASC
    `;
    db.query(query, callback);
  }

  // Lier un employé à un utilisateur
  static linkToUser(employeeId, userId, callback) {
    db.query(
      'UPDATE employes SET user_id = ? WHERE id = ? AND user_id IS NULL',
      [userId, employeeId],
      callback
    );
  }

  // Lier automatiquement les employés aux utilisateurs disponibles
  static autoLinkToUsers(callback) {
    const query = `
      UPDATE employes e1
      JOIN (
        SELECT 
          e.id as emp_id, 
          u.id as user_id,
          ROW_NUMBER() OVER (ORDER BY e.id ASC) as emp_rank,
          ROW_NUMBER() OVER (ORDER BY u.id ASC) as user_rank
        FROM employes e
        CROSS JOIN users u
        WHERE e.user_id IS NULL 
        AND u.role = 'employee'
        AND u.id NOT IN (SELECT COALESCE(user_id, 0) FROM employes WHERE user_id IS NOT NULL)
      ) mapping ON e1.id = mapping.emp_id AND mapping.emp_rank = mapping.user_rank
      SET e1.user_id = mapping.user_id
    `;
    db.query(query, callback);
  }

  // Vérifier si un utilisateur peut être lié (existe et a le rôle employee)
  static canLinkUser(userId, callback) {
    const query = `
      SELECT u.id, u.name, u.email
      FROM users u 
      WHERE u.id = ? 
      AND u.role = 'employee'
      AND u.id NOT IN (SELECT COALESCE(user_id, 0) FROM employes WHERE user_id IS NOT NULL)
    `;
    db.query(query, [userId], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0 ? results[0] : null);
    });
  }

  // Vérifier si un employé peut être lié (existe et n'est pas déjà lié)
  static canLinkEmployee(employeeId, callback) {
    const query = `
      SELECT id, nom, prenom, departement
      FROM employes 
      WHERE id = ? AND user_id IS NULL
    `;
    db.query(query, [employeeId], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0 ? results[0] : null);
    });
  }

  // Délier un employé d'un utilisateur
  static unlinkFromUser(employeeId, callback) {
    db.query(
      'UPDATE employes SET user_id = NULL WHERE id = ?',
      [employeeId],
      callback
    );
  }
}

module.exports = Employee;