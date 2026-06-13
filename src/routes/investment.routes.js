const express = require('express');
const router = express.Router();

const { 
  createInvestment, 
  getMyInvestments, 
  triggerDailyROI, 
  getFullROIHistory
} = require('../controllers/investment.controller');

const { protect } = require('../middleware/auth.middleware');


router.use(protect);

router.post('/', createInvestment);
router.get('/', getMyInvestments);
router.post('/trigger-roi', triggerDailyROI);
router.get('/roi-history', getFullROIHistory);

module.exports = router;