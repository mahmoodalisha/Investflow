import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  Filter,
  Download,
  BellRing
} from 'lucide-react';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

import api from '../utils/api';

const Dashboard = () => {
  // ==========================================
  // 1. STATE MANAGEMENT (Real Data)
  // ==========================================
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvestments: 0,
    walletBalance: 0,
    totalROIEarned: 0,
    totalLevelIncomeEarned: 0
  });
  
  // States ready for Row 4 & 5 (Next Step!)
  const [investments, setInvestments] = useState([]);
  const [referralTree, setReferralTree] = useState([]);
  const roiHistoryData = stats.recentROIHistory || [];

  // ==========================================
  // 2. FETCH DATA ON LOAD
  // ==========================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, treeRes, investmentsRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/referrals/tree'),
          api.get('/investments') 
        ]);

        setStats(dashboardRes.data);
        setReferralTree(treeRes.data.tree || []);
        setInvestments(investmentsRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ==========================================
  // 3. DYNAMIC DATA MAPPING
  // ==========================================

  // 1. Calculate Today's ROI FIRST (So kpiData can use it!)
  const roiPerformanceData = stats.roiChartData || [];
  const todayString = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  const todaysChartEntry = roiPerformanceData.find(entry => entry.day === todayString);
  const todaysROI = todaysChartEntry ? todaysChartEntry.amount : 0;

  // 2. Map backend stats to our UI cards
  const kpiData = [
    { title: "Total Investments", value: `₹${stats.totalInvestments}`, trend: "Active", isPositive: true, icon: <Wallet size={24} className="text-action" /> },
    { title: "Wallet Balance", value: `₹${stats.walletBalance}`, trend: "Available", isPositive: true, icon: <Activity size={24} className="text-action" /> },
    { title: "Total ROI Earned", value: `₹${stats.totalROIEarned}`, trend: "Lifetime", isPositive: true, icon: <TrendingUp size={24} className="text-action" /> },
    { title: "Referral Income", value: `₹${stats.totalLevelIncomeEarned}`, trend: "Lifetime", isPositive: true, icon: <Users size={24} className="text-action" /> },
    { title: "Active Investments", value: investments.length.toString(), trend: "Current", isPositive: true, icon: <PieChartIcon size={24} className="text-action" /> },
    { title: "Today's ROI", value: `₹${todaysROI}`, trend: todaysROI > 0 ? "Credited" : "Pending", isPositive: true, icon: <TrendingUp size={24} className="text-action" /> },
  ];

  // 3. Dynamic Income Breakdown Chart
  const incomeBreakdownData = [
    { name: 'ROI Income', value: stats.totalROIEarned, color: '#2563EB' },
    { name: 'Referral Income', value: stats.totalLevelIncomeEarned, color: '#22C55E' }
  ];
  const totalIncome = stats.totalROIEarned + stats.totalLevelIncomeEarned;

  // 4. Flatten the Referral Tree
  const flattenTree = (nodes, level = 1, result = []) => {
    nodes.forEach(node => {
      result.push({
        name: node.fullName,
        level: `Level ${level}`,
        color: level === 1 ? 'bg-success' : level === 2 ? 'bg-warning' : level === 3 ? 'bg-action' : 'bg-danger'
      });
      if (node.downline && node.downline.length > 0) {
        flattenTree(node.downline, level + 1, result);
      }
    });
    return result;
  };
  
  const flatTreeData = flattenTree(referralTree);

  // 5. Catch loading state right before rendering
  if (isLoading) {
    return <div className="p-10 text-center text-primaryText font-bold text-xl">Loading Dashboard Data...</div>;
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 pb-20">
      
      {/* ROW 1: Welcome Frame */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-primaryText">Welcome Back, Investor 👋</h1>
        <p className="text-sm text-secondaryText">Monitor investments, ROI earnings, and referral growth.</p>
      </div>

      {/* ROW 2: Core KPI Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((card, index) => (
          <div key={index} className="bg-white rounded-card p-5 shadow-card border border-borderTint hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-[140px]">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-action/10 flex items-center justify-center">
                {card.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
                card.isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              }`}>
                {card.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.trend}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primaryText mt-2">{card.value}</h3>
              <p className="text-xs text-secondaryText font-medium mt-0.5">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ROW 3: Dual-Column Analytics (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mt-6">
        
        {/* Left: Area Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-card border border-borderTint shadow-card">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-primaryText">ROI Performance</h2>
            <p className="text-sm text-secondaryText">30-day earnings trend</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roiPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`₹${value}`, 'Earned']} />
                <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Donut Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-card border border-borderTint shadow-card flex flex-col">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-primaryText">Income Breakdown</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs text-secondaryText font-medium">Total</span>
              <span className="text-xl font-bold text-primaryText">₹{totalIncome}</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={incomeBreakdownData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {incomeBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full flex justify-center gap-6 mt-4">
              {incomeBreakdownData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-secondaryText">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* ROW 4: ROI History Table (60%) & Referral Tree (40%) */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mt-6">
        
        {/* Left Column (60%) - ROI History Table (Static Placeholder) */}
        <div className="lg:col-span-6 bg-white rounded-card border border-borderTint shadow-card overflow-hidden flex flex-col">
          <div className="p-5 border-b border-borderTint flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-primaryText">ROI History Table</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-borderTint rounded-lg text-secondaryText hover:bg-canvas transition-colors"><Filter size={16} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-canvas border-b border-borderTint text-xs uppercase tracking-wider text-secondaryText font-semibold">
                  <th className="p-4">Date</th>
                  <th className="p-4">Investment ID</th>
                  <th className="p-4">ROI Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderTint text-sm text-primaryText">
                {roiHistoryData.length === 0 ? (
                  <tr><td colSpan="4" className="p-4 text-center text-secondaryText">No ROI history found</td></tr>
                ) : (
                  roiHistoryData.map((roi, index) => (
                    <tr key={index} className="hover:bg-canvas/50 transition-colors">
                      <td className="p-4 font-medium">{roi.date}</td>
                      <td className="p-4 text-secondaryText">NX-{roi.id}</td>
                      <td className="p-4 font-bold">₹{roi.amount}</td>
                      <td className="p-4 font-bold text-success">{roi.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (40%) - REAL Referral Network Visualization */}
        <div className="lg:col-span-4 bg-white rounded-card border border-borderTint shadow-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-primaryText">Referral Network</h2>
              <p className="text-xs text-secondaryText mt-1">Interactive network hierarchy</p>
            </div>
            <button className="bg-action text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-action/90 transition-colors">
              Export CSV
            </button>
          </div>

          <div className="flex-1 bg-canvas rounded-xl border border-borderTint p-5 overflow-y-auto max-h-[350px]">
            {/* Root Node (Current Logged-in User) */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-borderTint shadow-sm w-fit z-10 relative">
              <div className="w-8 h-8 bg-navy rounded-full text-white flex items-center justify-center font-bold text-xs">ME</div>
              <span className="font-bold text-sm">You (Root)</span>
              <span className="text-xs bg-navy/10 text-navy px-2 py-0.5 rounded text-center ml-2 font-semibold">Root Node</span>
            </div>

            {/* Dynamic Tree Branches mapped from flatTreeData! */}
            <div className="ml-6 pl-5 border-l-2 border-dashed border-borderTint mt-4 space-y-6 relative">
              {flatTreeData.length === 0 ? (
                <p className="text-sm text-secondaryText mt-2">No referrals yet. Share your code!</p>
              ) : (
                flatTreeData.map((node, index) => (
                  <div key={index} className="relative flex items-center gap-3">
                    <div className="absolute -left-5 top-1/2 w-5 border-t-2 border-dashed border-borderTint"></div>
                    <div className="flex items-center gap-3 bg-white p-2.5 pr-4 rounded-lg border border-borderTint shadow-sm w-fit hover:border-action transition-colors cursor-pointer">
                      <div className="w-7 h-7 bg-canvas rounded-full text-secondaryText flex items-center justify-center font-bold text-xs border border-borderTint">
                        {node.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-sm">{node.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded text-white ml-2 font-semibold ${node.color}`}>
                        {node.level}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* ROW 5: REAL Investment Table (60%) & Notifications (40%) */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mt-6">
        
        {/* Left: REAL Investment Table */}
        <div className="lg:col-span-6 bg-white rounded-card border border-borderTint shadow-card overflow-hidden flex flex-col">
          <div className="p-5 border-b border-borderTint flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-primaryText">My Investments</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-borderTint rounded-lg text-secondaryText hover:bg-canvas transition-colors"><Filter size={16} /></button>
              <button className="p-2 border border-borderTint rounded-lg text-secondaryText hover:bg-canvas transition-colors"><Download size={16} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-canvas border-b border-borderTint text-xs uppercase tracking-wider text-secondaryText font-semibold">
                  <th className="p-4">Investment ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Daily ROI</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderTint text-sm text-primaryText">
                {investments.length === 0 ? (
                  <tr><td colSpan="4" className="p-4 text-center text-secondaryText">No active investments found</td></tr>
                ) : (
                  investments.map((inv) => (
                    <tr key={inv._id} className="hover:bg-canvas/50 transition-colors">
                      <td className="p-4 font-medium uppercase">{inv._id.substring(0, 8)}</td>
                      <td className="p-4 font-bold">₹{inv.investmentAmount}</td>
                      <td className="p-4 text-secondaryText">{inv.dailyROIPercentage}%</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          inv.investmentStatus === 'ACTIVE' ? 'bg-success/10 text-success' :
                          'bg-borderTint/50 text-secondaryText'
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
        </div>

        {/* Right: Notifications (Static Placeholder) */}
        <div className="lg:col-span-4 bg-white rounded-card border border-borderTint shadow-card p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <BellRing size={20} className="text-primaryText" />
            <h2 className="text-lg font-bold text-primaryText">System Broadcasts</h2>
          </div>
          <div className="flex-1 flex flex-col gap-5">
            {[
              { text: 'System connected successfully', time: 'Just now', color: 'bg-success' },
              { text: 'Daily ROI calculations complete', time: '4 hours ago', color: 'bg-warning' }
            ].map((note, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex flex-col items-center mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${note.color} ring-4 ring-canvas shadow-sm`}></div>
                  {index !== 1 && <div className="w-px h-10 bg-borderTint mt-2"></div>}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primaryText leading-snug">{note.text}</p>
                  <p className="text-xs text-secondaryText mt-1">{note.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 rounded-lg text-sm font-bold text-action bg-action/5 hover:bg-action/10 transition-colors">
            View All Notifications
          </button>
        </div>

      </div>

      {/* ========================================== */}
      {/* ROW 6: Activity Timeline (40%) & Referral Income (60%) */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mt-6">
        
        {/* Left Column (40%) - Recent Operational Activity (Static Placeholder) */}
        <div className="lg:col-span-4 bg-white rounded-card border border-borderTint shadow-card p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-primaryText">Recent Transactions</h2>
            <p className="text-sm text-secondaryText">Real-time financial tracking</p>
          </div>

          <div className="flex-1 flex flex-col gap-6 mt-2">
            {[
              { title: 'ROI Credited', desc: 'Main System Ledger Balance update', time: '10:00 AM', color: 'bg-success' },
              { title: 'New Investment', desc: 'Active Plan Triggered', time: 'Yesterday', color: 'bg-action' }
            ].map((activity, index) => (
              <div key={index} className="flex gap-4 items-start relative">
                <div className="flex flex-col items-center mt-1">
                  <div className={`w-3 h-3 rounded-full ${activity.color} ring-4 ring-canvas z-10`}></div>
                  {index !== 1 && <div className="absolute top-4 bottom-[-24px] left-1.5 w-px bg-borderTint -z-0"></div>}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-primaryText">{activity.title}</p>
                    <span className="text-xs font-medium text-secondaryText whitespace-nowrap ml-4">{activity.time}</span>
                  </div>
                  <p className="text-xs text-secondaryText mt-1">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (60%) - Referral Income Ledger (Static Placeholder) */}
        <div className="lg:col-span-6 bg-white rounded-card border border-borderTint shadow-card overflow-hidden flex flex-col">
          <div className="p-5 border-b border-borderTint flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-primaryText">Referral Income</h2>
            <button className="bg-action/10 text-action px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-action/20 transition-colors flex items-center gap-2">
              <Download size={14} />
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-canvas border-b border-borderTint text-xs uppercase tracking-wider text-secondaryText font-semibold">
                  <th className="p-4">Generator User</th>
                  <th className="p-4">Referral Level</th>
                  <th className="p-4">Commission Earned</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderTint text-sm text-primaryText">
                {[
                  { user: 'Network User', level: 'Level 1', amount: '+ ₹2,500', date: '2026-06-12' },
                  { user: 'Network User', level: 'Level 2', amount: '+ ₹1,200', date: '2026-06-11' }
                ].map((income, index) => (
                  <tr key={index} className="hover:bg-canvas/50 transition-colors">
                    <td className="p-4 font-bold">{income.user}</td>
                    <td className="p-4">
                      <span className="bg-navy/5 text-navy px-2 py-1 rounded text-xs font-semibold">
                        {income.level}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-success">{income.amount}</td>
                    <td className="p-4 text-secondaryText">{income.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;