// src/components/recommendation/TripRecommendations.jsx

import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, CalendarDays, TrendingUp, Sun, Snowflake, Compass, ArrowRight } from 'lucide-react';

// Lista de destinații populare cu informații detaliate
const POPULAR_DESTINATIONS = [
  {
    name: "Paris, Franța",
    description: "Capitala romantică a Europei, perfectă pentru cupluri și iubitorii de artă.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
    season: "primăvară, toamnă",
    budget: "Premium",
    type: "City Break",
    similarTo: ["Roma", "Barcelona", "Amsterdam"]
  },
  {
    name: "Barcelona, Spania",
    description: "Combinație perfectă între plajă, arhitectură unică și viață de noapte.",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1000&auto=format&fit=crop",
    season: "vară, primăvară",
    budget: "Moderat",
    type: "City Break",
    similarTo: ["Valencia", "Madrid", "Nice"]
  },
  {
    name: "Santorini, Grecia",
    description: "Insulă spectaculoasă cu vederi uimitoare, perfectă pentru relaxare.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000&auto=format&fit=crop",
    season: "vară",
    budget: "Premium",
    type: "Relaxare",
    similarTo: ["Mykonos", "Creta", "Malta"]
  },
  {
    name: "Roma, Italia",
    description: "Oraș bogat în istorie, cultură și gastronomie delicioasă.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop",
    season: "primăvară, toamnă",
    budget: "Moderat",
    type: "Cultural",
    similarTo: ["Florența", "Veneția", "Atena"]
  },
  {
    name: "New York, SUA",
    description: "Metropolă vibrantă cu atracții nelimitate și energie urbană unică.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop",
    season: "primăvară, toamnă",
    budget: "Premium",
    type: "City Break",
    similarTo: ["Chicago", "Boston", "Toronto"]
  },
  {
    name: "Bali, Indonezia",
    description: "Paradis tropical cu plaje superbe și atmosferă spirituală.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop",
    season: "vară, iarnă",
    budget: "Economic",
    type: "Plajă",
    similarTo: ["Thailanda", "Filipine", "Maldive"]
  },
  {
    name: "Tokyo, Japonia",
    description: "Oraș futurist cu tradiții ancestrale și tehnologie de vârf.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop",
    season: "primăvară, toamnă",
    budget: "Premium",
    type: "Cultural",
    similarTo: ["Kyoto", "Seoul", "Singapore"]
  },
  {
    name: "Amsterdam, Olanda",
    description: "Oraș pitoresc cu canale, muzee de renume și atmosferă relaxată.",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1000&auto=format&fit=crop",
    season: "primăvară, vară",
    budget: "Moderat",
    type: "City Break",
    similarTo: ["Bruges", "Copenhaga", "Stockholm"]
  },
  {
    name: "Praga, Cehia",
    description: "Oraș de poveste cu arhitectură medievală și prețuri accesibile.",
    image: "https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=1000&auto=format&fit=crop",
    season: "primăvară, toamnă",
    budget: "Economic",
    type: "Cultural",
    similarTo: ["Budapesta", "Viena", "Cracovia"]
  },
  {
    name: "Dubai, UAE",
    description: "Oraș ultra-modern cu shopping de lux și experiențe extravagante.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop",
    season: "iarnă, primăvară",
    budget: "Premium",
    type: "Shopping",
    similarTo: ["Abu Dhabi", "Doha", "Kuwait"]
  }
];

// Obține sezonul actual bazat pe luna curentă
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "primăvară";
  if (month >= 6 && month <= 8) return "vară";
  if (month >= 9 && month <= 11) return "toamnă";
  return "iarnă";
};

const TripRecommendations = () => {
  const [userTrips, setUserTrips] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [similarDestinations, setSimilarDestinations] = useState([]);
  const [seasonalRecommendations, setSeasonalRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('favorite');
  
  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('user'));
        
        if (!userInfo || !userInfo.email) {
          console.error('No user logged in');
          // Dacă nu există utilizator, folosim recomandările generale
          generateGeneralRecommendations();
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
        
        setUserTrips(tripsData);
        
        if (tripsData.length > 0) {
          generateRecommendations(tripsData);
        } else {
          generateGeneralRecommendations();
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trips: ", error);
        generateGeneralRecommendations();
        setLoading(false);
      }
    };
    
    fetchUserTrips();
  }, []);
  
  // Generează recomandări generale dacă utilizatorul nu are călătorii anterioare
  const generateGeneralRecommendations = () => {
    const currentSeason = getCurrentSeason();
    
    // Destinații în funcție de sezon
    const seasonalDestinations = POPULAR_DESTINATIONS.filter(dest => 
      dest.season.includes(currentSeason)
    );
    
    setSeasonalRecommendations(seasonalDestinations);
    
    // Recomandări generale pentru toate bugetele
    const budgetCategories = {
      economic: POPULAR_DESTINATIONS.filter(dest => dest.budget === "Economic"),
      moderate: POPULAR_DESTINATIONS.filter(dest => dest.budget === "Moderat"),
      premium: POPULAR_DESTINATIONS.filter(dest => dest.budget === "Premium")
    };
    
    // Combinăm toate recomandările
    setRecommendations([
      ...budgetCategories.economic.slice(0, 2),
      ...budgetCategories.moderate.slice(0, 2),
      ...budgetCategories.premium.slice(0, 2)
    ]);
    
    // Pentru destinații similare, folosim destinații generale
    setSimilarDestinations(POPULAR_DESTINATIONS.slice(0, 4));
  };

  // Generează recomandări personalizate bazate pe călătoriile anterioare ale utilizatorului
  const generateRecommendations = (trips) => {
    // Extragem informații din călătoriile anterioare
    const userLocations = trips.map(trip => trip.userSelection?.location?.description).filter(Boolean);
    const userBudgets = trips.map(trip => trip.userSelection?.budget).filter(Boolean);
    const userTravellers = trips.map(trip => trip.userSelection?.traveller).filter(Boolean);
    
    // Determinăm preferințele utilizatorului
    const favoriteLocation = getMostFrequent(userLocations);
    const favoriteBudget = getMostFrequent(userBudgets);
    const favoriteTravellerType = getMostFrequent(userTravellers);
    
    // Generăm destinații similare cu cele vizitate
    const generatedSimilarDestinations = generateSimilarDestinations(favoriteLocation);
    setSimilarDestinations(generatedSimilarDestinations);
    
    // Destinații în funcție de sezon curent
    const currentSeason = getCurrentSeason();
    const seasonalDests = POPULAR_DESTINATIONS.filter(dest => 
      dest.season.includes(currentSeason) && dest.budget === favoriteBudget
    );
    setSeasonalRecommendations(seasonalDests.length > 0 ? seasonalDests : POPULAR_DESTINATIONS.filter(dest => dest.season.includes(currentSeason)));
    
    // Recomandări bazate pe buget și preferințe
    const budgetMatchingDests = POPULAR_DESTINATIONS.filter(dest => 
      dest.budget === favoriteBudget && !userLocations.some(loc => loc.includes(dest.name.split(',')[0]))
    );
    
    // Combinăm toate recomandările
    setRecommendations([
      ...budgetMatchingDests.slice(0, 3),
      ...seasonalDests.filter(dest => !budgetMatchingDests.includes(dest)).slice(0, 3)
    ]);
  };
  
  // Funcție pentru a determina cel mai frecvent element dintr-un array
  const getMostFrequent = (arr) => {
    if (!arr || arr.length === 0) return null;
    
    const frequency = {};
    let maxFreq = 0;
    let mostFrequent = arr[0];
    
    arr.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
      
      if (frequency[item] > maxFreq) {
        maxFreq = frequency[item];
        mostFrequent = item;
      }
    });
    
    return mostFrequent;
  };
  
  // Generează destinații similare cu cele preferate ale utilizatorului
  const generateSimilarDestinations = (favoriteLocation) => {
    if (!favoriteLocation) return POPULAR_DESTINATIONS.slice(0, 4);
    
    // Extragem numele orașului din descrierea locației (e.g. "Paris, Franța" -> "Paris")
    const cityName = favoriteLocation.split(',')[0];
    
    // Găsim destinația în lista noastră pentru a obține destinațiile similare
    const matchingDestination = POPULAR_DESTINATIONS.find(dest => 
      dest.name.includes(cityName)
    );
    
    if (matchingDestination && matchingDestination.similarTo) {
      // Creăm obiecte complete pentru destinațiile similare
      const similarDestinations = matchingDestination.similarTo.map(similarCity => {
        const foundDest = POPULAR_DESTINATIONS.find(dest => 
          dest.name.includes(similarCity)
        );
        
        return foundDest || {
          name: `${similarCity}`,
          description: `Destinație similară cu ${cityName}, perfectă pentru următoarea ta aventură.`,
          image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop",
          season: "orice sezon",
          budget: "Moderat",
          type: "City Break"
        };
      });
      
      return similarDestinations;
    }
    
    // Dacă nu avem o potrivire, returnăm destinații populare
    return POPULAR_DESTINATIONS.slice(0, 4);
  };

  // Componenta de card pentru o destinație recomandată
  const DestinationCard = ({ destination }) => {
    return (
      <div className="relative group rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
        {/* Background image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110"
        />
        
        {/* Card content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transition-all duration-300">
          <div className="flex items-center">
            <MapPin className="text-teal-400 h-5 w-5 mr-1" />
            <h3 className="text-white font-bold text-lg">{destination.name}</h3>
          </div>
          
          <p className="text-gray-200 mt-1 text-sm line-clamp-2">{destination.description}</p>
          
          <div className="flex items-center text-xs text-gray-300 mt-2">
            <div className="flex items-center mr-3">
              <CalendarDays className="h-3 w-3 mr-1 text-teal-400" />
              <span>{destination.season}</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-teal-400" />
              <span>{destination.budget}</span>
            </div>
          </div>
          
          {/* Button that appears on hover */}
          <div className="mt-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              onClick={() => window.location.href = `/create-trip?destination=${encodeURIComponent(destination.name)}`} 
              className="w-full bg-teal-500 hover:bg-teal-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <span>Planifică Călătoria</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900/80 to-teal-800/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Sparkles className="mr-2 text-yellow-400" />
          Recomandări de Călătorie Personalizate
        </h2>
        <p className="text-gray-300">Descoperă următoarea ta aventură pe baza preferințelor și istoricului tău</p>
      </div>

      {/* Tabs de categorii */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          className={`px-4 py-2 rounded-md flex items-center text-sm ${activeCategory === 'favorite' ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          onClick={() => setActiveCategory('favorite')}
        >
          <Sparkles size={16} className="mr-2" />
          Recomandări pentru tine
        </button>
        <button 
          className={`px-4 py-2 rounded-md flex items-center text-sm ${activeCategory === 'similar' ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          onClick={() => setActiveCategory('similar')}
        >
          <Compass size={16} className="mr-2" />
          Destinații similare
        </button>
        <button 
          className={`px-4 py-2 rounded-md flex items-center text-sm ${activeCategory === 'seasonal' ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
          onClick={() => setActiveCategory('seasonal')}
        >
          {getCurrentSeason() === 'vară' || getCurrentSeason() === 'primăvară' 
            ? <Sun size={16} className="mr-2" /> 
            : <Snowflake size={16} className="mr-2" />
          }
          Recomandări sezoniere
        </button>
      </div>

      {/* Grid de destinații */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCategory === 'favorite' && recommendations.map((destination, index) => (
          <DestinationCard destination={destination} key={index} />
        ))}
        
        {activeCategory === 'similar' && similarDestinations.map((destination, index) => (
          <DestinationCard destination={destination} key={index} />
        ))}
        
        {activeCategory === 'seasonal' && seasonalRecommendations.map((destination, index) => (
          <DestinationCard destination={destination} key={index} />
        ))}
      </div>
      
      {/* Mesaj dacă nu sunt recomandări disponibile */}
      {((activeCategory === 'favorite' && recommendations.length === 0) ||
        (activeCategory === 'similar' && similarDestinations.length === 0) ||
        (activeCategory === 'seasonal' && seasonalRecommendations.length === 0)) && (
        <div className="text-center py-12">
          <Compass className="mx-auto mb-3 text-gray-500" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">Nu am găsit recomandări</h3>
          <p className="text-gray-300">Planifică mai multe călătorii pentru a primi recomandări personalizate.</p>
        </div>
      )}
    </div>
  );
};

export default TripRecommendations;