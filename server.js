const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

const app = express();
dotenv.config();
connectDB();

app.get("/", (req, res) => {
    res.status(200).json({api:"Version 1.0"})
});

app.use(express.json());
app.use(cors());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Running on PORT ${PORT}`));