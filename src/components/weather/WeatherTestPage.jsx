// src/components/weather/WeatherTestPage.jsx - Versiunea îmbunătățită

import React, { useState, useEffect } from 'react';
import WeatherAndEventsWidget from './WeatherAndEventsWidget';
import { MapPin, Calendar, ArrowLeft, Globe } from 'lucide-react';

const WeatherTestPage = () => {
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState(new Date());
  const [customDestination, setCustomDestination] = useState('');

  // Citim parametrii din URL când componenta se încarcă
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const destinationParam = urlParams.get('destination');
    const dateParam = urlParams.get('date');
    
    if (destinationParam) {
      setDestination(decodeURIComponent(destinationParam));
      setCustomDestination(decodeURIComponent(destinationParam));
    } else {
      // Dacă nu avem destinație din URL, setăm una default
      setDestination('Paris, Franța');
      setCustomDestination('Paris, Franța');
    }
    
    if (dateParam) {
      setTravelDate(new Date(dateParam));
    }
  }, []);

  const popularDestinations = [
    'Paris, Franța',
    'Barcelona, Spania', 
    'Roma, Italia',
    'Amsterdam, Olanda',
    'Londra, Anglia',
    'New York, SUA',
    'Tokyo, Japonia',
    'Dubai, UAE',
    'Bangkok, Thailanda',
    'Istanbul, Turcia',
    'Berlin, Germania',
    'Prague, Cehia',
    'Vienna, Austria',
    'Budapest, Ungaria'
  ];

  const handleDestinationChange = (value) => {
    setDestination(value);
    setCustomDestination(value);
  };

  const handleCustomDestinationChange = (e) => {
    const value = e.target.value;
    setCustomDestination(value);
    setDestination(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Buton înapoi */}
        <button 
          onClick={() => window.history.back()}
          className="mb-4 flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2" size={18} />
          Înapoi
        </button>
        
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Informații Meteo și Evenimente
        </h1>
        
        {/* Controale pentru testare */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
          <div className="grid grid-cols-1 gap-4">
            {/* Destinația curentă */}
            {destination && (
              <div className="bg-teal-500/20 border border-teal-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="text-teal-400 mr-2" size={20} />
                  <span className="text-white font-medium">Destinația selectată: </span>
                  <span className="text-teal-200 ml-2 font-bold">{destination}</span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input personalizat pentru destinație */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <Globe className="inline mr-1" size={16} />
                  Schimbă Destinația
                </label>
                <input 
                  type="text" 
                  value={customDestination}
                  onChange={handleCustomDestinationChange}
                  placeholder="Ex: London, UK sau Tokyo, Japan"
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-teal-500"
                />
              </div>
              
              {/* Selector dată */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <Calendar className="inline mr-1" size={16} />
                  Data călătoriei
                </label>
                <input 
                  type="date" 
                  value={travelDate.toISOString().split('T')[0]}
                  onChange={(e) => setTravelDate(new Date(e.target.value))}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
            
            {/* Destinații populare ca butoane rapide */}
            <div>
              <label className="block text-white font-medium mb-3">
                Destinații Populare (click rapid):
              </label>
              <div className="flex flex-wrap gap-2">
                {popularDestinations.map((dest, index) => (
                  <button
                    key={index}
                    onClick={() => handleDestinationChange(dest)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      destination === dest 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {dest.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Widget-ul de vreme și evenimente */}
        {destination && (
          <WeatherAndEventsWidget destination={destination} travelDate={travelDate} />
        )}
        
        {!destination && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center border border-white/20">
            <Globe className="mx-auto mb-3 text-gray-500" size={48} />
            <h3 className="text-white text-xl font-semibold mb-2">Selectează o destinație</h3>
            <p className="text-gray-300">Introdu o destinație pentru a vedea informații despre vreme și evenimente locale.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherTestPage;