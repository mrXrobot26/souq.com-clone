const mongoose = require('mongoose');

async function db_connect() {
    try {
        await mongoose.connect(process.env.db_application);
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database error:", err);
    }
}

module.exports = db_connect;
