const User = require('../models/User');
const Investment = require('../models/Investment');
const ROIHistory = require('../models/ROIHistory'); 
const mongoose = require('mongoose'); 

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get the current user to access their wallet and earnings
    const user = await User.findById(userId);

    // 2. Find all investments for this user
    const userInvestments = await Investment.find({ user: userId });

    // 3. Calculate the total sum of all their investment amounts
    const totalInvestments = userInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0);

    // ==========================================
    // 4. AGGREGATE ROI CHART DATA
    // ==========================================
    const roiPipeline = await ROIHistory.aggregate([
      // A. Find only PROCESSED receipts for this specific user
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(userId), 
          status: "PROCESSED" 
        } 
      },
      // B. Group them by Date and Sum the amounts
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$roiDate" } },
          amount: { $sum: "$roiAmount" },
          dateOriginal: { $first: "$roiDate" } // Keep a real date object so we can sort properly
        }
      },
      // C. Sort chronologically (Oldest to Newest) so the chart flows left to right
      { $sort: { dateOriginal: 1 } },
      // D. Only grab the last 30 days of data for performance
      { $limit: 30 } 
    ]);

    // Format the data exactly how Recharts expects: { day: 'Oct 01', amount: 400 }
    const roiChartData = roiPipeline.map(item => {
      const dateObj = new Date(item.dateOriginal);
      const dayString = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      
      return {
        day: dayString,
        amount: item.amount
      };
    });

    // ==========================================
    // 5. FETCH RECENT ROI TRANSACTIONS (For the Table)
    // ==========================================
    const recentROI = await ROIHistory.find({ user: userId })
      .sort({ roiDate: -1 }) // Sort by newest first
      .limit(5); // Only grab the latest 5 for the dashboard

    // Format them nicely for the frontend table
    const recentROIHistory = recentROI.map(record => ({
      date: new Date(record.roiDate).toISOString().split('T')[0], // Formats to YYYY-MM-DD
      id: record.investment.toString().substring(0, 8).toUpperCase(), // Shortens the Mongo ID
      amount: record.roiAmount,
      status: record.status === 'PROCESSED' ? 'Credited' : record.status
    }));

    // ==========================================
    // 6. SEND ALL DATA TO FRONTEND
    // ==========================================
    res.status(200).json({
      totalInvestments: totalInvestments,
      totalROIEarned: user.totalROIEarned,
      totalLevelIncomeEarned: user.totalLevelIncomeEarned,
      walletBalance: user.walletBalance,
      roiChartData: roiChartData,
      recentROIHistory: recentROIHistory 
    });
    
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
