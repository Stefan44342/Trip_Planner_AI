// src/components/pages/DashboardPage.jsx - Versiunea corectată

import React, { useState } from 'react';
import TripAnalyticsDashboard from './TripAnalyticsDashboard';
import TripRecommendations from '../recommendations/TripRecommendations';
import { BarChart2, Compass } from 'lucide-react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // ADĂUGAT - definirea activeTab

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
        
        {/* ADĂUGAT - Tabs pentru a naviga între componente */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'analytics' ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          >
            <BarChart2 size={18} className="mr-2" />
            Statistici
          </button>
          <button 
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'recommendations' ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          >
            <Compass size={18} className="mr-2" />
            Recomandări
          </button>
        </div>

        {/* Afișarea componentelor în funcție de tab-ul activ */}
        {activeTab === 'analytics' && <TripAnalyticsDashboard />}
        {activeTab === 'recommendations' && <TripRecommendations />}
      </div>
    </div>
  );
};

export default DashboardPage;