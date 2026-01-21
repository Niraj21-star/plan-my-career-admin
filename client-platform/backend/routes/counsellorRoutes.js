const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { counsellorDashboard } = require('../controllers/dashboardController');

router.get('/dashboard', verifyToken, checkRole('counsellor'), counsellorDashboard);

module.exports = router;
