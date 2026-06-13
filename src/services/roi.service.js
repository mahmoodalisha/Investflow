const Investment = require('../models/Investment');
const ROIHistory = require('../models/ROIHistory');
const User = require('../models/User');
const { distributeReferralIncome } = require('./referral.service');

const processAllActiveInvestments = async () => {
  console.log("Starting daily ROI processing...");
  
  // 1. Get today's date at midnight (UTC) for strict idempotency checking
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // 2. Fetch all currently active investments
  const activeInvestments = await Investment.find({ investmentStatus: 'ACTIVE' });
  
  let processedCount = 0;
  let skippedCount = 0;

  for (const inv of activeInvestments) {
    try {
      // 3. Calculate today's ROI Amount
      const roiAmount = (inv.investmentAmount * inv.dailyROIPercentage) / 100;

      // 4. Attempt to create the ROI History record
      // If this runs twice today, the unique index on { user, investment, roiDate } will throw an error
      await ROIHistory.create({
        user: inv.user,
        investment: inv._id,
        roiAmount: roiAmount,
        roiDate: today,
        status: "PROCESSED"
      });

      // 5. If creation succeeds, update the User's wallet and total ROI
      await User.findByIdAndUpdate(inv.user, {
        $inc: {
          walletBalance: roiAmount,
          totalROIEarned: roiAmount
        }
      });

      processedCount++;

      await distributeReferralIncome(inv.user, roiAmount);

      // 6. Check if the investment has reached its completion date
      if (new Date() >= inv.endDate) {
        inv.investmentStatus = "COMPLETED";
        await inv.save();
        console.log(`Investment ${inv._id} marked as COMPLETED.`);
      }

    } catch (error) {
      // Error Code 11000 is MongoDB's "Duplicate Key" error
      if (error.code === 11000) {
        skippedCount++; // Silent skip: Idempotency is working perfectly!
      } else {
        console.error(`Error processing investment ${inv._id}:`, error.message);
      }
    }
  }

  console.log(`ROI Processing Complete: ${processedCount} processed, ${skippedCount} skipped.`);
  return { processedCount, skippedCount };
};

module.exports = { processAllActiveInvestments };