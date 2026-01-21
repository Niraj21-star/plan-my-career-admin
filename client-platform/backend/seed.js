require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./controllers/db');
const Admin = require('./models/Admin');
const Counsellor = require('./models/Counsellor');

async function seed(){
  await connectDB();
  const adminEmail = 'admin@clientdomain.com';
  const counsellorEmail = 'counsellor@clientdomain.com';

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('AdminPass123!', 10);
    await Admin.create({ name: 'Initial Admin', email: adminEmail, password: hashed });
    console.log('Created admin', adminEmail);
  } else console.log('Admin exists');

  const existingCounsellor = await Counsellor.findOne({ email: counsellorEmail });
  if (!existingCounsellor) {
    const hashed = await bcrypt.hash('CounselorPass123!', 10);
    await Counsellor.create({ name: 'Initial Counsellor', email: counsellorEmail, password: hashed });
    console.log('Created counsellor', counsellorEmail);
  } else console.log('Counsellor exists');

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
