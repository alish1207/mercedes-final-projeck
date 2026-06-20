const mongoose = require('mongoose');

module.exports = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`✅ MongoDB: ${conn.connection.host}`);
  } catch (e) {
    console.error('❌ MongoDB error:', e.message);
    process.exit(1);
  }
};
