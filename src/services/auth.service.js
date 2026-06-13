const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const generateReferralCode = require('../utils/generateReferralCode');

const registerUser = async (userData) => {
  
  const { fullName, email, mobileNumber, password, referredByCode } = userData;

  
  const userExists = await User.findOne({ $or: [{ email }, { mobileNumber }] });
  if (userExists) {
    throw new Error('User with this email or mobile number already exists');
  }

  // Referral Logic
  let parentUserId = null;
  if (referredByCode) {
    const parentUser = await User.findOne({ referralCode: referredByCode });
    
    if (parentUser) {
      parentUserId = parentUser._id;
    } else {
      throw new Error('Invalid referral code provided. Registration failed.');
    }
  }

  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  
  const user = await User.create({
    fullName,
    email,
    mobileNumber, 
    password: hashedPassword,
    referralCode: generateReferralCode(),
    referredBy: parentUserId
  });

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    referralCode: user.referralCode,
    token: generateToken(user._id)
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      referralCode: user.referralCode,
      token: generateToken(user._id)
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

module.exports = { registerUser, loginUser };