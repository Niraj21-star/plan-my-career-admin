require('dotenv').config();
const connectDB = require('../controllers/db');
const Admin = require('../models/Admin');

async function run(){
  await connectDB();
  const admins = await Admin.find().select('-password').lean();
  console.log('Admins:');
  console.log(admins);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
