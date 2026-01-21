const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const { adminKPIs, assignCounsellor } = require('../controllers/dashboardController');
const User = require('../models/User');
const Counsellor = require('../models/Counsellor');

router.get('/dashboard', verifyToken, checkRole('admin'), adminKPIs);

router.get('/users', verifyToken, checkRole('admin'), async (req, res) => {
	try {
		const users = await User.find().select('_id name email createdAt').sort({ createdAt: -1 });
		return res.json(users);
	} catch (err) {
		console.error('Failed to list users', err);
		return res.status(500).json({ message: 'Failed to load users' });
	}
});

router.get('/counsellors', verifyToken, checkRole('admin'), async (req, res) => {
	try {
		const counsellors = await Counsellor.find().select('_id name email').sort({ name: 1 });
		return res.json(counsellors);
	} catch (err) {
		console.error('Failed to list counsellors', err);
		return res.status(500).json({ message: 'Failed to load counsellors' });
	}
});

router.put('/assign-counsellor', verifyToken, checkRole('admin'), assignCounsellor);

module.exports = router;
