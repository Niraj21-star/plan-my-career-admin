const Admin = require('../models/Admin');
const Counsellor = require('../models/Counsellor');
const User = require('../models/User');

async function adminKPIs(req, res){
  // basic KPIs - counts
  const totalUsers = await User.countDocuments();
  const totalCounsellors = await Counsellor.countDocuments();
  const totalAdmins = await Admin.countDocuments();
  // tests, reports, revenue, bookings would be separate collections; mocked 0 for now
  res.json({ totalUsers, totalCounsellors, totalAdmins, testsTaken: 0, reports: 0, revenue: 0, bookings: 0 });
}

async function counsellorDashboard(req, res){
  // find counsellor and populate assignedStudents
  const counsellorId = req.user.id;
  const counsellor = await Counsellor.findById(counsellorId).populate('assignedStudents', 'name email');
  if (!counsellor) return res.status(404).json({ message: 'Counsellor not found' });
  res.json({ assignedStudents: counsellor.assignedStudents, upcomingSessions: [], notes: [] });
}

async function assignCounsellor(req, res) {
  const { userId, counsellorId } = req.body;
  if (!userId || !counsellorId) return res.status(400).json({ message: 'userId and counsellorId required' });

  try {
    const counsellor = await Counsellor.findById(counsellorId);
    if (!counsellor) return res.status(404).json({ message: 'Counsellor not found' });

    if (!counsellor.assignedStudents.includes(userId)) {
      counsellor.assignedStudents.push(userId);
      await counsellor.save();
    }

    // Remove from other counsellors if assigned elsewhere
    await Counsellor.updateMany(
      { _id: { $ne: counsellorId }, assignedStudents: userId },
      { $pull: { assignedStudents: userId } }
    );

    res.json({ message: 'Assigned successfully' });
  } catch (err) {
    console.error('Assign counsellor error:', err);
    res.status(500).json({ message: 'Failed to assign' });
  }
}

module.exports = { adminKPIs, counsellorDashboard, assignCounsellor };
