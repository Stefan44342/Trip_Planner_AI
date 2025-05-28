// src/view-trip/[tripId]/components/CostEstimator.jsx

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Hotel, MapPin, Car, Utensils, PlusCircle, MinusCircle, Calculator, 
  Check, X, CreditCard, ShoppingBag, Coffee, Plane, Bus
} from 'lucide-react';

const CostEstimator = ({ tripData, onSaveSelection }) => {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState({});
  const [additionalCosts, setAdditionalCosts] = useState([
    { id: 1, name: 'Transport local', amount: 0, icon: 'bus', enabled: true },
    { id: 2, name: 'Mese (estimare pe zi)', amount: 0, icon: 'food', enabled: true },
    { id: 3, name: 'Suveniruri și cumpărături', amount: 0, icon: 'shopping', enabled: true },
    { id: 4, name: 'Cafea și gustări', amount: 0, icon: 'coffee', enabled: true }
  ]);
  const [totalEstimate, setTotalEstimate] = useState(0);
  
  useEffect(() => {
    // Inițializăm selectarea activităților
    if (tripData && tripData.itinerary) {
      const initialActivities = {};
      Object.keys(tripData.itinerary).forEach(day => {
        if (tripData.itinerary[day].plan) {
          tripData.itinerary[day].plan.forEach((activity, index) => {
            const activityId = `${day}-${index}`;
            initialActivities[activityId] = { 
              selected: true, 
              cost: extractCost(activity.ticketPricing),
              activity: activity
            };
          });
        }
      });
      setSelectedActivities(initialActivities);
    }
    
    // Setăm costurile adiționale bazate pe budget și durata călătoriei
    if (tripData && tripData.userSelection) {
      const budget = tripData.userSelection.budget;
      const days = parseInt(tripData.userSelection.days || 1);
      let transportCost = 0;
      let foodCost = 0;
      let shoppingCost = 0;
      let coffeeCost = 0;
      
      // Ajustăm costurile în funcție de buget
      if (budget === 'Economic') {
        transportCost = 10 * days;
        foodCost = 25 * days;
        shoppingCost = 30;
        coffeeCost = 5 * days;
      } else if (budget === 'Moderat') {
        transportCost = 20 * days;
        foodCost = 50 * days;
        shoppingCost = 80;
        coffeeCost = 10 * days;
      } else if (budget === 'Premium') {
        transportCost = 40 * days;
        foodCost = 100 * days;
        shoppingCost = 200;
        coffeeCost = 20 * days;
      }
      
      setAdditionalCosts(prev => prev.map(cost => {
        if (cost.icon === 'bus') return { ...cost, amount: transportCost };
        if (cost.icon === 'food') return { ...cost, amount: foodCost };
        if (cost.icon === 'shopping') return { ...cost, amount: shoppingCost };
        if (cost.icon === 'coffee') return { ...cost, amount: coffeeCost };
        return cost;
      }));
    }
  }, [tripData]);

  // Actualizăm totalul de fiecare dată când se schimbă selecțiile
  useEffect(() => {
    calculateTotal();
  }, [selectedHotel, selectedActivities, additionalCosts]);

  // Extrage costul din string (ex: "$25" -> 25, "Free" -> 0)
  const extractCost = (costString) => {
    if (!costString) return 0;
    
    if (typeof costString === 'number') return costString;
    
    // Dacă este "Free" sau "Gratis", returnăm 0
    if (costString.toLowerCase().includes('free') || costString.toLowerCase().includes('gratis')) {
      return 0;
    }
    
    // Extragem numărul din string
    const match = costString.match(/(\d+)/g);
    if (match && match.length > 0) {
      // Dacă găsim un interval (ex: "$20-$30"), luăm media
      if (match.length > 1) {
        return (parseInt(match[0]) + parseInt(match[match.length - 1])) / 2;
      }
      return parseInt(match[0]);
    }
    return 0;
  };

  // Calculează costul total
  const calculateTotal = () => {
    let total = 0;
    
    // Adaugă costul hotelului
    if (selectedHotel && tripData.hotels) {
      const hotel = tripData.hotels.find(h => h.hotelName === selectedHotel);
      if (hotel) {
        const days = parseInt(tripData.userSelection?.days || 1);
        const hotelCostPerNight = extractCost(hotel.priceRange || hotel.price);
        total += hotelCostPerNight * days;
      }
    }
    
    // Adaugă costul activităților selectate
    Object.values(selectedActivities).forEach(activity => {
      if (activity.selected) {
        total += activity.cost;
      }
    });
    
    // Adaugă costurile adiționale
    additionalCosts.forEach(cost => {
      if (cost.enabled) {
        total += cost.amount;
      }
    });
    
    setTotalEstimate(total);
  };

  // Toggle selecția unei activități
  const toggleActivity = (activityId) => {
    setSelectedActivities(prev => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        selected: !prev[activityId].selected
      }
    }));
  };

  // Toggle costul adițional
  const toggleAdditionalCost = (costId) => {
    setAdditionalCosts(prev => 
      prev.map(cost => 
        cost.id === costId ? { ...cost, enabled: !cost.enabled } : cost
      )
    );
  };

  // Actualizează valoarea costului adițional
  const updateAdditionalCost = (costId, newAmount) => {
    setAdditionalCosts(prev => 
      prev.map(cost => 
        cost.id === costId ? { ...cost, amount: parseInt(newAmount) || 0 } : cost
      )
    );
  };

  // Renderează iconul pentru costurile adiționale
  const renderCostIcon = (iconType) => {
    switch (iconType) {
      case 'bus':
        return <Bus size={18} className="text-blue-400" />;
      case 'food':
        return <Utensils size={18} className="text-green-400" />;
      case 'shopping':
        return <ShoppingBag size={18} className="text-purple-400" />;
      case 'coffee':
        return <Coffee size={18} className="text-amber-400" />;
      default:
        return <DollarSign size={18} className="text-gray-400" />;
    }
  };

  if (!tripData || !tripData.hotels || !tripData.itinerary) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/20">
        <p className="text-center text-white">
          Datele călătoriei nu sunt disponibile pentru calcularea costurilor.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Calculator className="mr-2 text-yellow-400" />
          Estimator de Costuri Călătorie
        </h2>
        <p className="text-gray-300">Personalizează și calculează bugetul pentru călătoria ta în {tripData.userSelection?.location?.description}</p>
      </div>

      {/* Secțiunea selecție hotel */}
      <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
          <Hotel className="mr-2 text-teal-400" />
          Selecție Cazare
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {tripData.hotels.map((hotel, index) => (
            <div 
              key={index}
              onClick={() => setSelectedHotel(hotel.hotelName)}
              className={`bg-white/5 backdrop-blur-md p-4 rounded-lg cursor-pointer transition-all duration-300 border ${selectedHotel === hotel.hotelName 
                ? 'border-teal-500 bg-teal-500/10 shadow-lg transform scale-102' 
                : 'border-white/10 hover:border-teal-500/50 hover:bg-teal-500/5'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white text-sm">{hotel.hotelName}</h4>
                <div className={`p-1 rounded-full ${selectedHotel === hotel.hotelName ? 'bg-teal-500' : 'bg-white/20'}`}>
                  {selectedHotel === hotel.hotelName ? (
                    <Check size={14} className="text-white" />
                  ) : (
                    <Hotel size={14} className="text-white" />
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-xs mb-2 line-clamp-2">{hotel.description}</p>
              <div className="flex justify-between text-xs">
                <div className="flex items-center text-yellow-400">
                  ⭐ <span className="ml-1">{hotel.rating}</span>
                </div>
                <div className="text-teal-400 font-semibold">
                  {hotel.priceRange || hotel.price || 'Preț variabil'}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedHotel && (
          <div className="mt-3 p-3 bg-teal-500/20 backdrop-blur-md border border-teal-500/30 rounded-lg text-teal-200 flex items-center justify-between">
            <div className="flex items-center">
              <Hotel className="mr-2" size={18} />
              <span>Hotel selectat: <strong>{selectedHotel}</strong></span>
            </div>
            <span className="text-white font-semibold">
              {tripData.hotels.find(h => h.hotelName === selectedHotel)?.priceRange || 'Preț variabil'}
              <span className="text-teal-200 font-normal"> /noapte</span>
            </span>
          </div>
        )}
      </div>

      {/* Secțiunea selecție activități */}
      <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
          <MapPin className="mr-2 text-amber-400" />
          Selecție Activități
        </h3>
        
        <div className="space-y-4">
          {Object.keys(tripData.itinerary).map(day => (
            <div key={day} className="bg-white/5 backdrop-blur-md p-4 rounded-lg border border-white/10">
              <h4 className="font-medium text-white mb-3">
                Ziua {day.replace('day', '')} - {tripData.itinerary[day].theme}
              </h4>
              
              <div className="space-y-3">
                {tripData.itinerary[day].plan.map((activity, actIndex) => {
                  const activityId = `${day}-${actIndex}`;
                  const isSelected = selectedActivities[activityId]?.selected;
                  
                  return (
                    <div 
                      key={actIndex}
                      onClick={() => toggleActivity(activityId)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 border ${isSelected 
                        ? 'border-amber-500 bg-amber-500/10' 
                        : 'border-white/10 bg-white/5 hover:border-amber-500/50 hover:bg-amber-500/5'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-white text-sm">{activity.placeName}</h5>
                          <p className="text-gray-400 text-xs line-clamp-1 mt-1">{activity.placeDetails}</p>
                        </div>
                        <div className="flex items-center ml-3">
                          <div className="text-white text-xs mr-3 text-right">
                            <div>{activity.ticketPricing || 'Preț variabil'}</div>
                            <div className="text-gray-400">{activity.time}</div>
                          </div>
                          <div className={`p-1 rounded-full ${isSelected ? 'bg-amber-500' : 'bg-white/20'}`}>
                            {isSelected ? (
                              <Check size={12} className="text-white" />
                            ) : (
                              <X size={12} className="text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secțiunea costuri adiționale */}
      <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
          <PlusCircle className="mr-2 text-purple-400" />
          Costuri Adiționale
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalCosts.map(cost => (
            <div 
              key={cost.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${cost.enabled 
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-white/10 bg-white/5'}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  {renderCostIcon(cost.icon)}
                  <span className="ml-2 text-white font-medium text-sm">{cost.name}</span>
                </div>
                <button 
                  onClick={() => toggleAdditionalCost(cost.id)}
                  className={`p-1 rounded-full ${cost.enabled ? 'bg-purple-500' : 'bg-white/20'}`}
                >
                  {cost.enabled ? (
                    <Check size={14} className="text-white" />
                  ) : (
                    <PlusCircle size={14} className="text-white" />
                  )}
                </button>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="number"
                  value={cost.amount}
                  onChange={(e) => updateAdditionalCost(cost.id, e.target.value)}
                  disabled={!cost.enabled}
                  className="w-20 p-2 rounded bg-white/10 text-white border border-white/20 focus:border-purple-500 focus:outline-none disabled:opacity-50 text-sm"
                />
                <span className="ml-2 text-gray-300 text-sm">EUR</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secțiunea totală */}
      <div className="bg-gradient-to-r from-blue-800 to-teal-700 rounded-lg p-5 shadow-lg border border-white/20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">Cost Total Estimat</h3>
            <p className="text-gray-300 text-sm">Pentru {tripData.userSelection?.days} zile în {tripData.userSelection?.location?.description.split(',')[0]}</p>
          </div>
          <div className="text-3xl font-bold text-white">
            {totalEstimate} <span className="text-lg">EUR</span>
          </div>
        </div>
        
        {onSaveSelection && (
          <button 
            onClick={() => onSaveSelection({
              selectedHotel,
              selectedActivities,
              additionalCosts: additionalCosts.filter(cost => cost.enabled),
              totalCost: totalEstimate
            })}
            className="mt-4 w-full bg-teal-500 hover:bg-teal-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-300"
          >
            <CreditCard className="mr-2" size={18} />
            Salvează Calculul de Costuri
          </button>
        )}
      </div>
    </div>
  );
};

export default CostEstimator;