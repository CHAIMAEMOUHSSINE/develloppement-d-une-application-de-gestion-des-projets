const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Routes existantes
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

// Nouvelles routes pour la liaison
router.get('/user/:userId', employeeController.getEmployeeByUserId);
router.get('/admin/unlinked', employeeController.getUnlinkedData);
router.post('/admin/auto-link', employeeController.linkEmployeesToUsers);
router.post('/admin/manual-link', employeeController.linkEmployeeToUser);

module.exports = router;