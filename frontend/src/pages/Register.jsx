import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Tag, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    referredByCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      
      // Save token and push to dashboard immediately after registering
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 py-10">
      <div className="bg-white w-full max-w-md rounded-card border border-borderTint shadow-card p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primaryText">Create Account</h1>
          <p className="text-sm text-secondaryText mt-1">Join the NexaChain investment network</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-center gap-2 text-danger text-sm font-semibold">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div>
            <label className="block text-sm font-semibold text-primaryText mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" size={18} />
              <input type="text" name="fullName" required onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-borderTint rounded-lg text-sm focus:outline-none focus:border-action transition-all" placeholder="John Doe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primaryText mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" size={18} />
              <input type="email" name="email" required onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-borderTint rounded-lg text-sm focus:outline-none focus:border-action transition-all" placeholder="john@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primaryText mb-1.5">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" size={18} />
              <input type="tel" name="mobileNumber" required onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-borderTint rounded-lg text-sm focus:outline-none focus:border-action transition-all" placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primaryText mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" size={18} />
              <input type="password" name="password" required onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-borderTint rounded-lg text-sm focus:outline-none focus:border-action transition-all" placeholder="••••••••" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primaryText mb-1.5">Referral Code (Optional)</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" size={18} />
              <input type="text" name="referredByCode" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-borderTint rounded-lg text-sm focus:outline-none focus:border-action transition-all uppercase" placeholder="ENTER CODE" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2.5 bg-action text-white rounded-lg text-sm font-bold hover:bg-action/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-secondaryText mt-6">
          Already have an account? <Link to="/login" className="text-action font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;