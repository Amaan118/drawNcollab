const mongoose = require('mongoose');

const connection = async () => {
    db_url = "mongodb://localhost:27017/DrawNCollab";
    const conn = await mongoose.connect(db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = connection;