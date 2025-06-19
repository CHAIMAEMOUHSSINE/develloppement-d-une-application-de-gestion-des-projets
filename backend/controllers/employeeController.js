const Employee = require('../models/Employee');
const db = require('../config/db'); // Assurez-vous d'avoir accès à la base de données

// Récupérer tous les employés
exports.getAllEmployees = (req, res) => {
  Employee.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Récupérer un employé par ID
exports.getEmployeeById = (req, res) => {
  const { id } = req.params;
  
  Employee.getById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!result) {
      return res.status(404).json({ error: "Employé non trouvé" });
    }
    res.json(result);
  });
};

// Récupérer un employé par user_id
exports.getEmployeeByUserId = (req, res) => {
  const { userId } = req.params;
  
  const query = 'SELECT * FROM employes WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Employé non trouvé pour cet utilisateur" });
    }
    res.json(results[0]);
  });
};

// Créer un employé
exports.createEmployee = (req, res) => {
  const { nom, prenom, telephone, adresse, departement, statut, user_id } = req.body;

  // Validation des champs obligatoires
  if (!nom || !prenom || !departement) {
    return res.status(400).json({ error: "Le nom, prénom et département sont requis" });
  }

  Employee.create({ 
    nom, 
    prenom, 
    telephone, 
    adresse, 
    departement,
    statut: statut || 'actif',
    user_id: user_id || null
  }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      id: result.insertId, 
      nom, 
      prenom, 
      telephone, 
      adresse, 
      departement,
      statut: statut || 'actif',
      user_id: user_id || null,
      date_embauche: new Date()
    });
  });
};
// Dans employeeController.js
exports.autoLinkEmployeesToUsers = async (req, res) => {
  try {
    // 1. Récupérer tous les employés non liés
    const unlinkedEmployees = await db.query(
      'SELECT * FROM employes WHERE user_id IS NULL ORDER BY id ASC'
    );

    // 2. Récupérer tous les utilisateurs disponibles (role = employee et non liés)
    const availableUsers = await db.query(`
      SELECT * FROM users 
      WHERE role = 'employee' 
      AND id NOT IN (SELECT user_id FROM employes WHERE user_id IS NOT NULL)
      ORDER BY id ASC
    `);

    // 3. Vérifier s'il y a des correspondances possibles
    if (unlinkedEmployees.length === 0 || availableUsers.length === 0) {
      return res.json({
        success: false,
        message: "Aucun employé ou utilisateur disponible pour le lien automatique",
        linkedCount: 0
      });
    }

    // 4. Effectuer les liaisons (1 pour 1 dans l'ordre)
    const linkPromises = [];
    const minLength = Math.min(unlinkedEmployees.length, availableUsers.length);

    for (let i = 0; i < minLength; i++) {
      linkPromises.push(
        db.query('UPDATE employes SET user_id = ? WHERE id = ?', [
          availableUsers[i].id, 
          unlinkedEmployees[i].id
        ])
      );
    }

    await Promise.all(linkPromises);

    // 5. Retourner le résultat
    res.json({
      success: true,
      message: `${minLength} liaison(s) automatique(s) effectuée(s)`,
      linkedCount: minLength,
      remainingUnlinked: unlinkedEmployees.length - minLength
    });

  } catch (err) {
    console.error("Erreur de liaison automatique:", err);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la liaison automatique"
    });
  }
};
// Lier automatiquement les employés sans user_id aux utilisateurs 'employee' disponibles
exports.linkEmployeesToUsers = (req, res) => {
  const linkQuery = `
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

  db.query(linkQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ 
      message: `${result.affectedRows} employé(s) lié(s) automatiquement`,
      affectedRows: result.affectedRows
    });
  });
};

// Lier un employé spécifique à un utilisateur
exports.linkEmployeeToUser = (req, res) => {
  const { employeeId, userId } = req.body;

  if (!employeeId || !userId) {
    return res.status(400).json({ error: "L'ID de l'employé et l'ID de l'utilisateur sont requis" });
  }

  // Vérifier que l'utilisateur existe et a le rôle 'employee'
  const checkUserQuery = 'SELECT * FROM users WHERE id = ? AND role = "employee"';
  db.query(checkUserQuery, [userId], (err, userResults) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé ou n'a pas le rôle employé" });
    }

    // Vérifier que l'employé existe et n'est pas déjà lié
    const checkEmployeeQuery = 'SELECT * FROM employes WHERE id = ?';
    db.query(checkEmployeeQuery, [employeeId], (err, empResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (empResults.length === 0) {
        return res.status(404).json({ error: "Employé non trouvé" });
      }
      if (empResults[0].user_id !== null) {
        return res.status(400).json({ error: "Cet employé est déjà lié à un utilisateur" });
      }

      // Effectuer la liaison
      const linkQuery = 'UPDATE employes SET user_id = ? WHERE id = ?';
      db.query(linkQuery, [userId, employeeId], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ 
          message: 'Employé lié avec succès à l\'utilisateur',
          employeeId: employeeId,
          userId: userId
        });
      });
    });
  });
};

// Obtenir la liste des employés non liés et des utilisateurs 'employee' disponibles
exports.getUnlinkedData = (req, res) => {
  const unlinkedEmployeesQuery = `
    SELECT id, nom, prenom, departement 
    FROM employes 
    WHERE user_id IS NULL 
    ORDER BY id ASC
  `;
  
  const availableUsersQuery = `
    SELECT u.id, u.name, u.email 
    FROM users u 
    WHERE u.role = 'employee' 
    AND u.id NOT IN (SELECT COALESCE(user_id, 0) FROM employes WHERE user_id IS NOT NULL)
    ORDER BY u.id ASC
  `;

  db.query(unlinkedEmployeesQuery, (err, employees) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    db.query(availableUsersQuery, (err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({
        unlinkedEmployees: employees,
        availableUsers: users,
        canAutoLink: employees.length > 0 && users.length > 0
      });
    });
  });
};

// Mettre à jour un employé
exports.updateEmployee = (req, res) => {
  const { id } = req.params;
  const employeeData = req.body;

  Employee.update(id, employeeData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employé non trouvé" });
    }
    res.json({ message: 'Employé mis à jour' });
  });
};

// Supprimer un employé
exports.deleteEmployee = (req, res) => {
  const { id } = req.params;

  Employee.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employé non trouvé" });
    }
    res.json({ message: 'Employé supprimé' });
  });
};