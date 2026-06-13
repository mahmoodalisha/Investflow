const Investment = require('../models/Investment');
const User = require('../models/User');
const ReferralIncome = require('../models/ReferralIncome');
const ROIHistory = require('../models/ROIHistory');

const createInvestment = async (userId, investmentData) => {
  const { investmentAmount, planDetails, planDurationDays, dailyROIPercentage } = investmentData;

  // Calculate the end date dynamically based on the duration
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + planDurationDays);

  // 1. Create the Investment Document
  const newInvestment = await Investment.create({
    user: userId,
    investmentAmount,
    planDetails: planDetails || "Basic Plan",
    startDate,
    endDate,
    dailyROIPercentage,
    investmentStatus: "ACTIVE"
  });

  // ==========================================
  // 2. MLM COMMISSION DISTRIBUTION ENGINE
  // ==========================================
  
  // Define 4-level commission structure: 10%, 5%, 2.5%, 1%
  const COMMISSION_RATES = [0.10, 0.05, 0.025, 0.01]; 
  
  // Find the user who just invested to see who referred them
  const investingUser = await User.findById(userId);
  
  let currentParentId = investingUser.referredBy;
  let currentLevel = 0;

  // Traverse UP the tree (Stop if there is no parent OR we hit 4 levels)
  while (currentParentId && currentLevel < COMMISSION_RATES.length) {
    // Calculate the cut for this specific level
    const commissionAmount = investmentAmount * COMMISSION_RATES[currentLevel];

    try {
        // 1. Pay the parent
        const parentUser = await User.findByIdAndUpdate(
          currentParentId,
          {
            $inc: {
              walletBalance: commissionAmount,
              totalLevelIncomeEarned: commissionAmount
            }
          },
          { new: true } 
        );

        if (!parentUser) {
            console.log(`⚠️ Parent ${currentParentId} not found. Breaking tree.`);
            break;
        }

        // 2. PRINT THE RECEIPT! 
        await ReferralIncome.create({
          receiverUser: parentUser._id,
          generatedByUser: userId, // The person who made the investment
          level: currentLevel + 1,
          incomeAmount: commissionAmount
        });

        console.log(`💵 Paid ${parentUser.fullName} and generated receipt!`);

        // Move up the tree
        currentParentId = parentUser.referredBy;
        currentLevel++;
        
    } catch (error) {
        // Catch block required for try statements to prevent server crashes
        console.error(`❌ DATABASE UPDATE ERROR:`, error.message);
        break; 
    }
  }

  return newInvestment;
};

const getUserInvestments = async (userId) => {
  // Returns all investments for this specific user, newest first
  return await Investment.find({ user: userId }).sort({ createdAt: -1 });
};

const getFullROIHistory = async (userId) => {
  return await ROIHistory.find({ 
    user: userId,
    status: "PROCESSED"
  }).sort({ roiDate: -1 });
};


module.exports = { createInvestment, getUserInvestments, getFullROIHistory};