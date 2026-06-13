import React, { useState, useEffect } from 'react';
import { Download, Maximize2 } from 'lucide-react';
import api from '../utils/api';

const ReferralTree = () => {
  const [tree, setTree] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await api.get('/referrals/tree');
        setTree(res.data.tree); // Assuming the response is { tree: [...] }
      } catch (err) {
        console.error("Error fetching referral tree:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTree();
  }, []);

  // Recursive component to render any number of levels
  const Node = ({ node, level }) => {
    const colors = { 1: 'bg-success', 2: 'bg-warning', 3: 'bg-danger', 4: 'bg-action' };
    const colorClass = colors[level] || 'bg-navy';

    return (
      <div className="relative mt-6 ml-8 pl-8 border-l-2 border-dashed border-borderTint">
        <div className="absolute -left-8 top-5 w-8 border-t-2 border-dashed border-borderTint"></div>
        
        {/* Node Card */}
        <div className="flex items-center gap-4 bg-white p-3 pr-5 rounded-xl border border-borderTint shadow-sm w-[300px] hover:border-action transition-all">
          <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold shadow-inner ${colorClass}`}>
            {node.fullName.charAt(0)}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-primaryText text-sm leading-tight">{node.fullName}</h4>
            <p className="text-secondaryText text-[10px] uppercase font-bold tracking-wider mt-0.5">Level {node.level}</p>
          </div>
        </div>

        {/* Recursive call for children */}
        {node.downline && node.downline.map((child, idx) => (
          <Node key={idx} node={child} level={child.level} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 pb-20 h-[calc(100vh-70px)] flex flex-col">
      <div className="flex justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Network Visualization</h1>
          <p className="text-sm text-secondaryText">Interactive hierarchy of your downline.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-borderTint rounded-lg text-sm font-semibold hover:bg-canvas">
            <Maximize2 size={16} /> Fullscreen
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-action text-white rounded-lg text-sm font-semibold">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 bg-canvas rounded-card border border-borderTint p-8 overflow-y-auto">
        {isLoading ? (
          <p className="text-center text-secondaryText mt-10">Loading network tree...</p>
        ) : (
          <div className="relative z-10 w-fit">
            {/* Root Node */}
            <div className="flex items-center gap-4 bg-navy p-4 rounded-xl shadow-lg w-[320px]">
              <div className="w-12 h-12 bg-white/20 rounded-full text-white flex items-center justify-center font-bold text-lg">
                {/* Note: This assumes you have the user's name available */}
                {localStorage.getItem('fullName')?.charAt(0) || 'U'}
              </div>
              <h3 className="font-bold text-white text-lg">My Network</h3>
            </div>
            
            {/* Render recursive tree */}
            {tree && tree.map((node, idx) => (
              <Node key={idx} node={node} level={node.level} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralTree;