import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Plus, X, AlertCircle } from 'lucide-react';
import api from '../utils/api'; // Make sure the path to your api is correct!

const Investments = () => {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    investmentAmount: '',
    planDetails: 'Standard 30-Day Plan',
    planDurationDays: 30,
    dailyROIPercentage: 1.0
  });

  // ==========================================
  // 2. FETCH INVESTMENTS
  // ==========================================
  const fetchInvestments = async () => {
    try {
      const res = await api.get('/investments');
      setInvestments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch investments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  // ==========================================
  // 3. HANDLE FORM SUBMISSION
  // ==========================================
  const handlePlanChange = (e) => {
    const selectedPlan = e.target.value;
    if (selectedPlan === "Basic 15-Day Plan") {
      setFormData({ ...formData, planDetails: selectedPlan, planDurationDays: 15, dailyROIPercentage: 0.5 });
    } else if (selectedPlan === "Standard 30-Day Plan") {
      setFormData({ ...formData, planDetails: selectedPlan, planDurationDays: 30, dailyROIPercentage: 1.0 });
    } else if (selectedPlan === "Premium 45-Day Plan") {
      setFormData({ ...formData, planDetails: selectedPlan, planDurationDays: 45, dailyROIPercentage: 1.5 });
    }
  };

  const handleCreateInvestment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/investments', {
        investmentAmount: Number(formData.investmentAmount),
        planDurationDays: formData.planDurationDays,
        dailyROIPercentage: formData.dailyROIPercentage,
        planDetails: formData.planDetails
      });

      
      setIsModalOpen(false);
      setFormData({ ...formData, investmentAmount: '' });
      fetchInvestments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create investment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 pb-20 relative">
      
      {/* ========================================== */}
      {/* PAGE HEADER & CONTROLS                     */}
      {/* ========================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primaryText">Investment Portfolio</h1>
          <p className="text-sm text-secondaryText">Manage and track all your active and past investments.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" size={16} />
            <input 
              type="text" 
              placeholder="Search ID..." 
              className="pl-9 pr-4 py-2 bg-white border border-borderTint rounded-lg text-sm focus:outline-none focus:border-action w-full md:w-48"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-borderTint rounded-lg text-sm font-semibold text-primaryText hover:bg-canvas transition-colors">
            <Filter size={16} />
            Filter
          </button>
          
          {/* NEW BUTTON: Open Modal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-action text-white rounded-lg text-sm font-semibold hover:bg-action/90 transition-colors shadow-sm"
          >
            <Plus size={16} />
            New Investment
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* DYNAMIC INVESTMENT TABLE                   */}
      {/* ========================================== */}
      <div className="bg-white rounded-card border border-borderTint shadow-card overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas border-b border-borderTint text-xs uppercase tracking-wider text-secondaryText font-semibold">
                <th className="p-5">Investment ID</th>
                <th className="p-5">Plan Details</th>
                <th className="p-5">Amount</th>
                <th className="p-5">Daily ROI %</th>
                <th className="p-5">Start Date</th>
                <th className="p-5">End Date</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderTint text-sm text-primaryText">
              {isLoading ? (
                <tr><td colSpan="7" className="p-8 text-center text-secondaryText font-medium">Loading investments...</td></tr>
              ) : investments.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-secondaryText font-medium">No investments found. Create one to get started!</td></tr>
              ) : (
                investments.map((inv) => (
                  <tr key={inv._id} className="hover:bg-canvas/50 transition-colors">
                    <td className="p-5 font-medium uppercase">NX-{inv._id.substring(0, 8)}</td>
                    <td className="p-5 text-secondaryText">{inv.planDetails}</td>
                    <td className="p-5 font-bold text-primaryText">₹{inv.investmentAmount}</td>
                    <td className="p-5 text-secondaryText font-medium">{inv.dailyROIPercentage}%</td>
                    <td className="p-5 text-secondaryText">{new Date(inv.startDate).toLocaleDateString()}</td>
                    <td className="p-5 text-secondaryText">{new Date(inv.endDate).toLocaleDateString()}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                        inv.investmentStatus === 'ACTIVE' ? 'bg-success/10 text-success' :
                        inv.investmentStatus === 'COMPLETED' ? 'bg-action/10 text-action' :
                        'bg-borderTint text-secondaryText'
                      }`}>
                        {inv.investmentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-borderTint flex items-center justify-between bg-white">
          <span className="text-sm text-secondaryText font-medium">Showing {investments.length} entries</span>
          <div className="flex gap-1">
            <button className="p-1.5 rounded-md border border-borderTint text-secondaryText hover:bg-canvas disabled:opacity-50"><ChevronLeft size={18} /></button>
            <button className="px-3 py-1.5 rounded-md bg-action text-white text-sm font-semibold">1</button>
            <button className="p-1.5 rounded-md border border-borderTint text-secondaryText hover:bg-canvas"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* CREATE INVESTMENT MODAL                    */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-borderTint overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-borderTint bg-canvas/30">
              <h2 className="text-lg font-bold text-primaryText">Create New Investment</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-secondaryText hover:text-danger hover:bg-danger/10 rounded-md transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateInvestment} className="p-6 space-y-5">
              
              {error && (
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-center gap-2 text-danger text-sm font-semibold">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-primaryText mb-1.5">Investment Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  min="1000"
                  value={formData.investmentAmount}
                  onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-borderTint rounded-lg text-sm focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
                  placeholder="Enter amount (min. ₹1000)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primaryText mb-1.5">Select Investment Plan</label>
                <select 
                  value={formData.planDetails}
                  onChange={handlePlanChange}
                  className="w-full px-4 py-2.5 bg-white border border-borderTint rounded-lg text-sm focus:outline-none focus:border-action focus:ring-1 focus:ring-action"
                >
                  <option value="Basic 15-Day Plan">Basic 15-Day Plan (0.5% Daily)</option>
                  <option value="Standard 30-Day Plan">Standard 30-Day Plan (1.0% Daily)</option>
                  <option value="Premium 45-Day Plan">Premium 45-Day Plan (1.5% Daily)</option>
                </select>
              </div>

              {/* Informational Read-Only Fields */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-canvas border border-borderTint rounded-lg text-center">
                  <p className="text-xs text-secondaryText font-medium">Duration</p>
                  <p className="text-lg font-bold text-primaryText mt-0.5">{formData.planDurationDays} Days</p>
                </div>
                <div className="p-3 bg-canvas border border-borderTint rounded-lg text-center">
                  <p className="text-xs text-secondaryText font-medium">Daily ROI</p>
                  <p className="text-lg font-bold text-success mt-0.5">{formData.dailyROIPercentage}%</p>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-2.5 bg-action text-white rounded-lg text-sm font-bold hover:bg-action/90 transition-colors disabled:opacity-70 mt-2"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Investment'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Investments;