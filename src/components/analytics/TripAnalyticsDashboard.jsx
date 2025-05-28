// src/components/analytics/TripAnalyticsDashboard.jsx - Versiune actualizată

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Calendar, MapPin, DollarSign, Users, BarChart2, TrendingUp, Clock, RefreshCcw
} from 'lucide-react';

// Paleta de culori pentru grafice
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TripAnalyticsDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destinationStats, setDestinationStats] = useState([]);
  const [budgetStats, setBudgetStats] = useState([]);
  const [timeStats, setTimeStats] = useState([]);
  const [travellerStats, setTravellerStats] = useState([]);
  const [activeTab, setActiveTab] = useState('destinations');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('user'));
        
        if (!userInfo || !userInfo.email) {
          console.error('No user logged in');
          setLoading(false);
          return;
        }
        
        // Importăm Firebase Firestore folosind dynamic import
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('@/service/FirebaseConfig');
        
        const q = query(
          collection(db, "AITrip"), 
          where("userEmail", "==", userInfo.email)
        );
        
        const querySnapshot = await getDocs(q);
        const tripsData = [];
        
        querySnapshot.forEach((doc) => {
          tripsData.push(doc.data());
        });
        
        setTrips(tripsData);
        processData(tripsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trips: ", error);
        setLoading(false);
      }
    };
    
    fetchTrips();
  }, []);
  
  const processData = (tripsData) => {
    // Procesăm statisticile de destinații
    const destinations = {};
    tripsData.forEach(trip => {
      const location = trip.userSelection?.location?.description || 'Nedefinit';
      destinations[location] = (destinations[location] || 0) + 1;
    });
    
    const destinationData = Object.keys(destinations).map(key => ({
      name: key,
      value: destinations[key]
    }));
    
    setDestinationStats(destinationData);
    
    // Procesăm statisticile de buget
    const budgets = {};
    tripsData.forEach(trip => {
      const budget = trip.userSelection?.budget || 'Nedefinit';
      budgets[budget] = (budgets[budget] || 0) + 1;
    });
    
    const budgetData = Object.keys(budgets).map(key => ({
      name: key,
      value: budgets[key]
    }));
    
    setBudgetStats(budgetData);
    
    // Procesăm statisticile de durata călătoriei
    const daysData = tripsData.map(trip => ({
      id: trip.id,
      days: parseInt(trip.userSelection?.days || 0),
      location: trip.userSelection?.location?.description || 'Nedefinit'
    }));
    
    setTimeStats(daysData);
    
    // Procesăm statisticile de călători
    const travellers = {};
    tripsData.forEach(trip => {
      const traveller = trip.userSelection?.traveller || 'Nedefinit';
      travellers[traveller] = (travellers[traveller] || 0) + 1;
    });
    
    const travellerData = Object.keys(travellers).map(key => ({
      name: key,
      value: travellers[key]
    }));
    
    setTravellerStats(travellerData);
  };

  // Funcție pentru a limita un text la un anumit număr de caractere
  const truncateText = (text, limit = 15) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  // Renderer personalizat pentru etichetele de pe graficul pie
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Afișăm doar procentul, nu și numele destinației (care va fi afișat în legendă)
    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  // Generăm concluziile bazate pe statistici
  const generateConclusions = () => {
    // Inițializăm concluziile
    let conclusions = [];
    
    // Destinația preferată
    if (destinationStats.length > 0) {
      const topDestination = [...destinationStats].sort((a, b) => b.value - a.value)[0];
      conclusions.push(`Destinația ta preferată este ${topDestination.name}.`);
    }
    
    // Bugetul preferat
    if (budgetStats.length > 0) {
      const topBudget = [...budgetStats].sort((a, b) => b.value - a.value)[0];
      conclusions.push(`Preferi călătoriile cu buget ${topBudget.name.toLowerCase()}.`);
    }
    
    // Durata medie
    if (timeStats.length > 0) {
      const avgDuration = timeStats.reduce((acc, curr) => acc + curr.days, 0) / timeStats.length;
      conclusions.push(`În medie, călătoriile tale durează ${avgDuration.toFixed(1)} zile.`);
    }
    
    // Tipul de călător preferat
    if (travellerStats.length > 0) {
      const topTraveller = [...travellerStats].sort((a, b) => b.value - a.value)[0];
      conclusions.push(`Călătorești cel mai des ${topTraveller.name}.`);
    }
    
    // Recomandări bazate pe preferințe
    if (destinationStats.length > 0 && budgetStats.length > 0) {
      const topDestination = [...destinationStats].sort((a, b) => b.value - a.value)[0];
      const topBudget = [...budgetStats].sort((a, b) => b.value - a.value)[0];
      
      // Generăm o recomandare personalizată
      let recommendation = '';
      if (topBudget.name === 'Economic') {
        recommendation = 'Ai putea explora destinații precum Budapesta, Praga sau Lisabona, care oferă experiențe valoroase la prețuri accesibile.';
      } else if (topBudget.name === 'Moderat') {
        recommendation = 'Consideră destinații precum Barcelona, Atena sau Viena pentru următoarea ta aventură.';
      } else {
        recommendation = 'Destinații precum Dubai, Tokyo sau New York s-ar potrivi perfect cu preferințele tale pentru experiențe premium.';
      }
      
      conclusions.push(recommendation);
    }
    
    return conclusions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-xl bg-gradient-to-r from-blue-800/50 to-teal-700/50 backdrop-blur-md">
        <div className="text-white mb-4">
          <BarChart2 className="mx-auto mb-3" size={48} />
          <h3 className="text-xl font-semibold">Nu ai călătorii salvate</h3>
          <p className="mt-2 text-gray-300">Planifică o călătorie pentru a vedea statistici și analize personalizate.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/create-trip'} 
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-400 transition-colors"
        >
          Creează o călătorie
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900/80 to-teal-800/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <BarChart2 className="mr-2" />
          Dashboard de Analiză a Călătoriilor
        </h2>
        <p className="text-gray-300">Descoperă tendințele tale de călătorie bazate pe {trips.length} călătorii planificate</p>
      </div>

      {/* Tabs pentru diferite tipuri de statistici */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          className={`px-4 py-2 rounded-md flex items-center text-sm ${activeTab === 'destinations' ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          onClick={() => setActiveTab('destinations')}
        >
          <MapPin size={16} className="mr-2" />
          Destinații
        </button>
        <button 
          className={`px-4 py-2 rounded-md flex items-center text-sm ${activeTab === 'budget' ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          onClick={() => setActiveTab('budget')}
        >
          <DollarSign size={16} className="mr-2" />
          Buget
        </button>
        <button 
          className={`px-4 py-2 rounded-md flex items-center text-sm ${activeTab === 'duration' ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          onClick={() => setActiveTab('duration')}
        >
          <Clock size={16} className="mr-2" />
          Durată
        </button>
        <button 
          className={`px-4 py-2 rounded-md flex items-center text-sm ${activeTab === 'travellers' ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          onClick={() => setActiveTab('travellers')}
        >
          <Users size={16} className="mr-2" />
          Călători
        </button>
        <button 
          className="ml-auto px-4 py-2 rounded-md flex items-center text-sm bg-white/10 text-gray-300 hover:bg-white/20"
          onClick={() => window.location.reload()}
        >
          <RefreshCcw size={16} className="mr-2" />
          Reîmprospătează
        </button>
      </div>

      {/* Conținutul tab-urilor */}
      <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
        {/* Tab Destinații */}
        {activeTab === 'destinations' && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <MapPin className="mr-2" size={20} />
              Distribuția Destinațiilor
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Grafic Pie pentru distribuția destinațiilor */}
              <div className="bg-white/5 rounded-lg p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={destinationStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {destinationStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [`Călătorii: ${value}`, props.payload.name]}
                      contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
                      itemStyle={{ color: 'white' }}
                    />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Tabel cu top destinații */}
              <div className="bg-white/5 rounded-lg p-4 h-72 overflow-auto">
                <h4 className="text-white font-medium mb-3">Top Destinații</h4>
                <table className="w-full text-sm text-gray-300">
                  <thead className="text-xs uppercase bg-white/10">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left">Destinație</th>
                      <th scope="col" className="px-3 py-2 text-center">Călătorii</th>
                      <th scope="col" className="px-3 py-2 text-right">Procent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinationStats
                      .sort((a, b) => b.value - a.value)
                      .map((item, index) => {
                        const totalTrips = destinationStats.reduce((acc, curr) => acc + curr.value, 0);
                        const percentage = ((item.value / totalTrips) * 100).toFixed(1);
                        
                        return (
                          <tr key={index} className="border-b border-white/10">
                            <td className="px-3 py-2 text-left font-medium">{item.name}</td>
                            <td className="px-3 py-2 text-center">{item.value}</td>
                            <td className="px-3 py-2 text-right">{percentage}%</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Buget */}
        {activeTab === 'budget' && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <DollarSign className="mr-2" size={20} />
              Analiza Bugetelor de Călătorie
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Grafic Bar pentru distribuția bugetelor */}
              <div className="bg-white/5 rounded-lg p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" tick={{ fill: 'white' }} />
                    <YAxis tick={{ fill: 'white' }} />
                    <Tooltip 
                      formatter={(value) => [`Călătorii: ${value}`, 'Număr']}
                      contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
                      itemStyle={{ color: 'white' }}
                    />
                    <Bar dataKey="value" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Tabel cu sumarul bugetelor */}
              <div className="bg-white/5 rounded-lg p-4 h-72 overflow-auto">
                <h4 className="text-white font-medium mb-3">Preferințe de Buget</h4>
                <table className="w-full text-sm text-gray-300">
                  <thead className="text-xs uppercase bg-white/10">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left">Tip Buget</th>
                      <th scope="col" className="px-3 py-2 text-center">Călătorii</th>
                      <th scope="col" className="px-3 py-2 text-right">Procent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetStats
                      .sort((a, b) => b.value - a.value)
                      .map((item, index) => {
                        const totalTrips = budgetStats.reduce((acc, curr) => acc + curr.value, 0);
                        const percentage = ((item.value / totalTrips) * 100).toFixed(1);
                        
                        return (
                          <tr key={index} className="border-b border-white/10">
                            <td className="px-3 py-2 text-left font-medium">{item.name}</td>
                            <td className="px-3 py-2 text-center">{item.value}</td>
                            <td className="px-3 py-2 text-right">{percentage}%</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Durată */}
        {activeTab === 'duration' && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Durata Călătoriilor
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Grafic Bar pentru durata călătoriilor */}
              <div className="bg-white/5 rounded-lg p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={timeStats.map(item => ({
                      location: truncateText(item.location),
                      days: item.days
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="location" tick={{ fill: 'white' }} />
                    <YAxis tick={{ fill: 'white' }} />
                    <Tooltip 
                      formatter={(value) => [`${value} zile`, 'Durată']}
                      contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
                      itemStyle={{ color: 'white' }}
                      labelFormatter={(value) => `Destinație: ${value}`}
                    />
                    <Bar dataKey="days" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Statistici despre durata medie */}
              <div className="bg-white/5 rounded-lg p-4 h-72 flex flex-col">
                <h4 className="text-white font-medium mb-3">Statistici de Durată</h4>
                
                {/* Card cu durata medie */}
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Durata medie</p>
                      <h5 className="text-white text-2xl font-bold">
                        {(timeStats.reduce((acc, curr) => acc + curr.days, 0) / timeStats.length).toFixed(1)} zile
                      </h5>
                    </div>
                    <div className="bg-amber-500/20 p-3 rounded-lg">
                      <Clock className="text-amber-400" size={24} />
                    </div>
                  </div>
                </div>
                
                {/* Card cu durata maximă */}
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Călătoria cea mai lungă</p>
                      <h5 className="text-white text-2xl font-bold">
                        {Math.max(...timeStats.map(item => item.days))} zile
                      </h5>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <TrendingUp className="text-blue-400" size={24} />
                    </div>
                  </div>
                </div>
                
                {/* Card cu durata minimă */}
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Călătoria cea mai scurtă</p>
                      <h5 className="text-white text-2xl font-bold">
                        {Math.min(...timeStats.map(item => item.days))} zile
                      </h5>
                    </div>
                    <div className="bg-purple-500/20 p-3 rounded-lg">
                      <Clock className="text-purple-400" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Călători */}
        {activeTab === 'travellers' && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="mr-2" size={20} />
              Tipuri de Călători
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Grafic Pie pentru tipurile de călători */}
              <div className="bg-white/5 rounded-lg p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={travellerStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {travellerStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [`Călătorii: ${value}`, props.payload.name]}
                      contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', borderColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
                      itemStyle={{ color: 'white' }}
                    />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Tabel cu tipuri de călători */}
              <div className="bg-white/5 rounded-lg p-4 h-72 overflow-auto">
                <h4 className="text-white font-medium mb-3">Preferințe de Grup</h4>
                <table className="w-full text-sm text-gray-300">
                  <thead className="text-xs uppercase bg-white/10">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left">Tip Călători</th>
                      <th scope="col" className="px-3 py-2 text-center">Călătorii</th>
                      <th scope="col" className="px-3 py-2 text-right">Procent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {travellerStats
                      .sort((a, b) => b.value - a.value)
                      .map((item, index) => {
                        const totalTrips = travellerStats.reduce((acc, curr) => acc + curr.value, 0);
                        const percentage = ((item.value / totalTrips) * 100).toFixed(1);
                        
                        return (
                          <tr key={index} className="border-b border-white/10">
                            <td className="px-3 py-2 text-left font-medium">{item.name}</td>
                            <td className="px-3 py-2 text-center">{item.value}</td>
                            <td className="px-3 py-2 text-right">{percentage}%</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Secțiunea de concluzii */}
      <div className="mt-8 bg-gradient-to-r from-blue-800/60 to-purple-800/60 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <BarChart2 className="mr-2" size={20} />
          Profilul Tău de Călător
        </h3>
        <div className="text-gray-200 space-y-3">
          {generateConclusions().map((conclusion, index) => (
            <p key={index} className="flex items-start">
              <span className="text-teal-400 mr-2 mt-1">•</span>
              <span>{conclusion}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripAnalyticsDashboard;