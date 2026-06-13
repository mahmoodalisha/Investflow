const User = require('../models/User');
const ReferralIncome = require('../models/ReferralIncome');

// Expand this dictionary to as many levels as you want!
// The system will infinitely traverse, but only pay out for defined levels.
const COMMISSION_RATES = {
  1: 10.0, // 10% for Direct
  2: 5.0,  // 5% for Grandparent
  3: 2.5,  // 2.5% for Great-Grandparent
  4: 1.0,  // 1% for Level 4
  5: 0.5   // 0.5% for Level 5
};

const distributeReferralIncome = async (generatorUserId, roiAmount) => {
  let currentUserId = generatorUserId;
  let level = 1;

  // Infinite traversal: Keep going up until there is no parent left
  while (currentUserId) {
    const currentUser = await User.findById(currentUserId);

    // Base Case: Break the loop if the user doesn't exist or has no parent
    if (!currentUser || !currentUser.referredBy) {
      break; 
    }

    const parentId = currentUser.referredBy;
    
    // Check if this specific level has a commission rate defined
    const rate = COMMISSION_RATES[level] || 0; 
    const commissionAmount = (roiAmount * rate) / 100;

    if (commissionAmount > 0) {
      await ReferralIncome.create({
        receiverUser: parentId,
        generatedByUser: generatorUserId,
        level: level,
        incomeAmount: commissionAmount
      });

      await User.findByIdAndUpdate(parentId, {
        $inc: {
          walletBalance: commissionAmount,
          totalLevelIncomeEarned: commissionAmount
        }
      });
    }

    // Move the pointer up the tree and increment the level counter
    currentUserId = parentId;
    level++;
  }
};

module.exports = { distributeReferralIncome };