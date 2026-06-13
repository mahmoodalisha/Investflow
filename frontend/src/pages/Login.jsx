import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      
      
      localStorage.setItem('token', response.data.token);

      localStorage.setItem('fullName', response.data.fullName);
      
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-card border border-borderTint shadow-card p-8">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-navy rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">NX</span>
          </div>
          <h1 className="text-2xl font-bold text-primaryText">Welcome Back</h1>
          <p className="text-sm text-secondaryText mt-1">Sign in to manage your investments</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-center gap-2 text-danger text-sm font-semibold">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-primaryText mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" size={18} />
              <input 
                type="email" 
                name="email"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-borderTint rounded-lg text-sm focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-all"
                placeholder="investor@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primaryText mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" size={18} />
              <input 
                type="password" 
                name="password"
                required
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-borderTint rounded-lg text-sm focus:outline-none focus:border-action focus:ring-1 focus:ring-action transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2.5 bg-action text-white rounded-lg text-sm font-bold hover:bg-action/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-secondaryText mt-6">
          Don't have an account? <Link to="/register" className="text-action font-bold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;