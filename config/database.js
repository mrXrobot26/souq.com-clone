const mongoose = require('mongoose');

async function db_connect() {
    await mongoose.connect(process.env.db_application);
    console.log("\x1b[32m%s\x1b[0m", "Database connected successfully");
}

module.exports = db_connect;
