const User = require('../models/User');

const getDirectReferrals = async (req, res) => {
  try {
    const directReferrals = await User.find({ referredBy: req.user._id })
      .select('fullName email referralCode createdAt walletBalance');
      
    res.status(200).json({
      count: directReferrals.length,
      data: directReferrals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReferralTree = async (req, res) => {
  try {
    // Recursive function with NO depth limit
    const buildTree = async (userId, currentLevel) => {
      
      const children = await User.find({ referredBy: userId })
        .select('fullName email referralCode createdAt');

      // Base case: If this user has no children, return an empty array
      if (children.length === 0) {
        return [];
      }

      const tree = [];
      
      for (const child of children) {
        // Keep digging deeper infinitely
        const downline = await buildTree(child._id, currentLevel + 1);
        
        tree.push({
          _id: child._id,
          fullName: child.fullName,
          email: child.email,
          level: currentLevel,
          downline: downline
        });
      }
      
      return tree;
    };

    // Kick off the recursion starting with the logged-in user at Level 1
    const fullTree = await buildTree(req.user._id, 1);

    res.status(200).json({
      tree: fullTree
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDirectReferrals, getReferralTree };