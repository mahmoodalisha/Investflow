import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import api from '../utils/api'; // Make sure this path points to your Axios instance!

const ROIHistory = () => {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // 2. FETCH FULL LEDGER ON LOAD
  // ==========================================
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/investments/roi-history');
        setHistory(res.data || []);
      } catch (error) {
        console.error("Failed to fetch ROI history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primaryText">ROI History Ledger</h1>
          <p className="text-sm text-secondaryText">Track your daily returns and credited amounts across all active investments.</p>
        </div>
        
        {/* Global Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedText" size={16} />
            <input 
              type="text" 
              placeholder="Search Investment ID..." 
              className="pl-9 pr-4 py-2 bg-white border border-borderTint rounded-lg text-sm focus:outline-none focus:border-action w-full md:w-56"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-borderTint rounded-lg text-sm font-semibold text-primaryText hover:bg-canvas transition-colors">
            <Calendar size={16} />
            Last 30 Days
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-borderTint rounded-lg text-sm font-semibold text-primaryText hover:bg-canvas transition-colors">
            <Filter size={16} />
            Filters
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-action text-white rounded-lg text-sm font-semibold hover:bg-action/90 transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Full-Width ROI Table Card */}
      <div className="bg-white rounded-card border border-borderTint shadow-card overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas border-b border-borderTint text-xs uppercase tracking-wider text-secondaryText font-semibold">
                <th className="p-5">Date</th>
                <th className="p-5">Investment ID</th>
                <th className="p-5">ROI Amount</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderTint text-sm text-primaryText">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-secondaryText font-medium">
                    Loading ledger data...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-secondaryText font-medium">
                    No ROI history found yet.
                  </td>
                </tr>
              ) : (
                history.map((roi) => (
                  <tr key={roi._id} className="hover:bg-canvas/50 transition-colors">
                    <td className="p-5 font-medium">
                      {new Date(roi.roiDate).toISOString().split('T')[0]}
                    </td>
                    <td className="p-5 text-secondaryText font-mono uppercase">
                      NX-{roi.investment.toString().substring(0, 8)}
                    </td>
                    <td className="p-5 font-bold text-lg text-primaryText">
                      ₹{roi.roiAmount}
                    </td>
                    <td className="p-5">
                      <span className="flex items-center gap-2 text-success font-bold">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        {roi.status === 'PROCESSED' ? 'Credited' : roi.status}
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
          <span className="text-sm text-secondaryText font-medium">
            Showing {history.length} entries
          </span>
          <div className="flex gap-1">
            <button className="p-1.5 rounded-md border border-borderTint text-secondaryText hover:bg-canvas disabled:opacity-50">
              <ChevronLeft size={18} />
            </button>
            <button className="px-3 py-1.5 rounded-md bg-action text-white text-sm font-semibold">1</button>
            <button className="p-1.5 rounded-md border border-borderTint text-secondaryText hover:bg-canvas">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ROIHistory;