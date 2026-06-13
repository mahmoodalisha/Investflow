import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';


import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';


import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import ROIHistory from './pages/ROIHistory';
import ReferralIncome from './pages/ReferralIncome';
import ReferralTree from './pages/ReferralTree';
import Login from './pages/Login';
import Register from './pages/Register';


import ProtectedRoute from './components/ProtectedRoute';

// ==========================================
// 1. DASHBOARD LAYOUT WRAPPER
// This ensures the Sidebar and Navbar ONLY 
// show up on protected pages, not the login screen!
// ==========================================
const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-canvas font-sans text-primaryText">
      <Sidebar />
      <div className="flex-1 ml-sidebar">
        <Navbar />
        <main className="mt-navbar min-h-[calc(100vh-70px)] relative z-0">
          {/* Outlet is a placeholder that renders whatever child route is active */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN APP ROUTER
// ==========================================
function App() {
  return (
    <Router>
      <Routes>
        
        {/* PUBLIC ROUTES: No Sidebar, No Navbar */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/roi-history" element={<ROIHistory />} />
          <Route path="/referral-income" element={<ReferralIncome />} />
          <Route path="/referral-tree" element={<ReferralTree />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;