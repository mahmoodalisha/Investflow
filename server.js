const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./src/routes/auth.routes");
const investmentRoutes = require("./src/routes/investment.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const referralRoutes = require("./src/routes/referral.routes");
const { scheduleDailyROI } = require('./src/jobs/roi.cron');

scheduleDailyROI();

app.use("/api/auth", authRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/referrals", referralRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err.message);
  });


app.get("/", (req, res) => {
  res.send("InvestFlow API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});