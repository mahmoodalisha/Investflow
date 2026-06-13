import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import api from '../utils/api';

const ReferralIncome = () => {
  const [income, setIncome] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await api.get('/investments/referral-history');
        setIncome(res.data || []);
      } catch (err) {
        console.error("Failed to fetch referral income:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIncome();
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primaryText">Referral Income</h1>
          <p className="text-sm text-secondaryText">Monitor commissions generated across your network.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <input type="text" placeholder="Search user..." className="pl-4 pr-4 py-2 bg-white border border-borderTint rounded-lg text-sm w-56" />
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-borderTint rounded-lg text-sm font-semibold text-primaryText hover:bg-canvas">
            <Calendar size={16} /> This Month
          </button>
        </div>
      </div>

      <div className="bg-white rounded-card border border-borderTint shadow-card overflow-hidden flex flex-col">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-canvas border-b border-borderTint text-xs uppercase tracking-wider text-secondaryText font-semibold">
              <th className="p-5">Generator User</th>
              <th className="p-5">Referral Level</th>
              <th className="p-5">Commission</th>
              <th className="p-5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderTint text-sm text-primaryText">
            {isLoading ? (
              <tr><td colSpan="4" className="p-8 text-center text-secondaryText">Loading...</td></tr>
            ) : income.map((item) => (
              <tr key={item._id} className="hover:bg-canvas/50">
                <td className="p-5 font-bold flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-navy/5 text-navy flex items-center justify-center font-bold text-xs border border-borderTint">
                    {item.generatedByUser.fullName.charAt(0)}
                  </div>
                  {item.generatedByUser.fullName}
                </td>
                <td className="p-5">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-action/10 text-action">
                    Level {item.level}
                  </span>
                </td>
                <td className="p-5 font-bold text-success">+ ₹{item.incomeAmount}</td>
                <td className="p-5 text-secondaryText">{new Date(item.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralIncome;