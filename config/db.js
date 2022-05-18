const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
        });
        console.log(`Database Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDB;