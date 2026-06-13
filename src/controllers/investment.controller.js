const investmentService = require('../services/investment.service');
const roiService = require('../services/roi.service');


const createInvestment = async (req, res) => {
  try {
    const investment = await investmentService.createInvestment(req.user._id, req.body);
    res.status(201).json(investment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyInvestments = async (req, res) => {
  try {
    const investments = await investmentService.getUserInvestments(req.user._id);
    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const triggerDailyROI = async (req, res) => {
  try {
    const result = await roiService.processAllActiveInvestments();
    res.status(200).json({
      message: "Manual ROI calculation triggered successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFullROIHistory = async (req, res) => {
  try {
    // 1. Grab the user ID from the token
    const userId = req.user._id;

    // 2. Ask the service layer to get the data
    const history = await investmentService.getFullROIHistory(userId);

    
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createInvestment, getMyInvestments, triggerDailyROI, getFullROIHistory };