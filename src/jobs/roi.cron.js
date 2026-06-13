const cron = require('node-cron');
const roiService = require('../services/roi.service');

const scheduleDailyROI = () => {
  // The string '0 0 * * *' tells the server to run this exactly at Midnight (00:00) every day.
  cron.schedule('0 0 * * *', async () => {
    console.log("-----------------------------------------");
    console.log("⏰ CRON TRIGGERED: Starting Daily ROI Run");
    console.log("-----------------------------------------");
    
    try {
      await roiService.processAllActiveInvestments();
    } catch (error) {
      console.error("Cron Job Error:", error);
    }
  }, {
    scheduled: true,
    timezone: "UTC" // Standardizes the midnight trigger regardless of where the server is hosted
  });

  console.log("Daily ROI Cron Job scheduled successfully. Waiting for midnight...");
};

module.exports = { scheduleDailyROI };