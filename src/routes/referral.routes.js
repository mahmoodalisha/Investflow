const express = require('express');
const router = express.Router();
const { getDirectReferrals, getReferralTree } = require('../controllers/referral.controller');
const { protect } = require('../middleware/auth.middleware');


router.use(protect);

router.get('/direct', getDirectReferrals);
router.get('/tree', getReferralTree);

module.exports = router;