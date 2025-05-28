// src/components/weather/WeatherAndEventsWidget.jsx - Versiunea îmbunătățită

import React, { useState, useEffect } from 'react';
import { 
  Cloud, CloudRain, Sun, CloudSnow, CloudLightning, CloudDrizzle, 
  Calendar, Clock, Music, MapPin, ChevronRight, ChevronLeft, Loader, AlertCircle
} from 'lucide-react';
import { chatSession } from '@/service/AiModel';

const WeatherAndEventsWidget = ({ destination, travelDate }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [debugInfo, setDebugInfo] = useState(''); // Pentru debugging

  useEffect(() => {
    const fetchDataFromAI = async () => {
      if (!destination) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setDebugInfo('');

        // Extrage doar orașul din destinație
        const city = destination.split(',')[0].trim();

        // Prompt mai simplu și mai specific
        // În WeatherAndEventsWidget.jsx - actualizează prompt-ul pentru a fi mai flexibil

        // Înlocuiește prompt-ul din useEffect cu acest prompt îmbunătățit:

        let prompt = `Te rog să îmi oferi informații despre ${city}. Răspunde DOAR cu un JSON valid cu această structură:

{
  "weather": {
    "temperature": "numărul temperaturii",
    "description": "descriere în română despre vremea din ${city}",
    "condition": "sunny sau cloudy sau rainy sau snowy sau stormy"
  },
  "events": [
    {
      "name": "numele evenimentului",
      "date": "data evenimentului",
      "time": "ora evenimentului",
      "location": "locația din ${city}",
      "description": "descriere în română",
      "category": "concert sau festival sau exhibition sau sports sau other"
    }
  ]
}

Pentru ${city}${travelDate ? ` în perioada ${new Date(travelDate).toLocaleDateString('ro-RO')}` : ''}, oferă informații reale sau estimări realiste despre vreme și 2-3 evenimente locale tipice pentru această destinație. 

Răspunde NUMAI cu JSON-ul, fără text suplimentar.`;

        console.log('Sending prompt to AI...');

        // Trimitem prompt-ul către AI
        const result = await chatSession.sendMessage(prompt);
        const textResponse = await result.response.text();

        console.log('AI Response:', textResponse);
        setDebugInfo(`Răspuns AI: ${textResponse.substring(0, 200)}...`);
        
        // Parsăm răspunsul JSON
        try {
          // Curățăm răspunsul de text suplimentar
          let cleanResponse = textResponse.trim();
          
          // Căutăm primul { și ultimul }
          const firstBrace = cleanResponse.indexOf('{');
          const lastBrace = cleanResponse.lastIndexOf('}');
          
          if (firstBrace !== -1 && lastBrace !== -1) {
            cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1);
            
            const jsonData = JSON.parse(cleanResponse);
            
            console.log('Parsed JSON:', jsonData);
            
            if (jsonData.weather) {
              setWeatherData(jsonData.weather);
            }
            
            if (jsonData.events && Array.isArray(jsonData.events)) {
              setEvents(jsonData.events);
            }
          } else {
            throw new Error("Nu s-au găsit acolade în răspuns");
          }
        } catch (jsonError) {
          console.error('Error parsing AI response:', jsonError);
          setError(`Eroare la parsarea răspunsului: ${jsonError.message}`);
          
          // Setăm date mock pentru testing
          setWeatherData({
            temperature: "18",
            description: "Vremea este plăcută și moderată",
            condition: "cloudy"
          });
          
          setEvents([
            {
              name: "Festival de Vară",
              date: travelDate ? new Date(travelDate).toLocaleDateString('ro-RO') : "15 iunie 2024",
              time: "18:00",
              location: `Centrul orașului ${city}`,
              description: "Festival cu muzică live și activități pentru toate vârstele",
              category: "festival"
            },
            {
              name: "Tur Ghidat",
              date: travelDate ? new Date(travelDate).toLocaleDateString('ro-RO') : "16 iunie 2024", 
              time: "10:00",
              location: `Centrul Istoric ${city}`,
              description: "Tur ghidat prin principalele obiective turistice",
              category: "other"
            }
          ]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data from AI:', err);
        setError(`Eroare la obținerea datelor: ${err.message}`);
        setLoading(false);
      }
    };

    if (destination) {
      fetchDataFromAI();
    }
  }, [destination, travelDate]);

  // Funcția pentru afișarea iconului meteo potrivit
  const renderWeatherIcon = (condition) => {
    const iconMap = {
      'sunny': <Sun className="text-yellow-400" size={36} />,
      'cloudy': <Cloud className="text-gray-400" size={36} />,
      'rainy': <CloudRain className="text-blue-400" size={36} />,
      'snowy': <CloudSnow className="text-blue-100" size={36} />,
      'stormy': <CloudLightning className="text-amber-500" size={36} />,
      'windy': <Cloud className="text-gray-300" size={36} />
    };
    
    return iconMap[condition] || <Cloud className="text-gray-400" size={36} />;
  };

  // Funcția pentru afișarea iconului pentru categoria evenimentului
  const renderEventIcon = (category) => {
    const iconMap = {
      'concert': <Music className="text-purple-400" size={20} />,
      'festival': <Music className="text-teal-400" size={20} />,
      'exhibition': <Calendar className="text-blue-400" size={20} />,
      'sports': <Calendar className="text-red-400" size={20} />,
      'other': <Calendar className="text-gray-400" size={20} />
    };
    
    return iconMap[category] || <Calendar className="text-gray-400" size={20} />;
  };

  // Funcție pentru navigarea prin evenimente
  const nextEvent = () => {
    setActiveEventIndex((prev) => (prev + 1) % events.length);
  };

  const prevEvent = () => {
    setActiveEventIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/20 flex items-center justify-center h-48">
        <Loader className="animate-spin text-teal-500" size={32} />
        <p className="text-white ml-3">Se încarcă informațiile despre {destination.split(',')[0]}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/20">
        <div className="flex items-center mb-3">
          <AlertCircle className="text-amber-400 mr-2" size={20} />
          <h4 className="text-white font-medium">Informații de Debug</h4>
        </div>
        <p className="text-amber-300 text-sm mb-3">{error}</p>
        {debugInfo && (
          <div className="bg-white/5 p-3 rounded text-xs text-gray-400">
            <strong>Debug:</strong> {debugInfo}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg border border-white/20">
      <h3 className="text-white text-lg font-bold mb-4 flex items-center">
        <MapPin className="mr-2 text-teal-400" size={20} />
        Informații pentru {destination}
      </h3>
      
      {/* Secțiunea meteo */}
      {weatherData && (
        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Vremea în {destination.split(',')[0]}</h4>
              <p className="text-gray-300 text-sm">
                {travelDate ? (
                  `Estimare pentru ${new Date(travelDate).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })}`
                ) : (
                  'Condiții estimate'
                )}
              </p>
            </div>
            {renderWeatherIcon(weatherData.condition)}
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="text-2xl text-white font-bold">{weatherData.temperature}°C</div>
            <div className="text-gray-300">{weatherData.description}</div>
          </div>
        </div>
      )}
      
      {/* Secțiunea evenimente */}
      {events && events.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Evenimente Locale</h4>
          
          <div className="relative">
            <div className="overflow-hidden">
              {/* Afișează evenimentul activ */}
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center mb-1">
                  {renderEventIcon(events[activeEventIndex]?.category)}
                  <h5 className="text-white ml-2 font-medium">{events[activeEventIndex]?.name}</h5>
                </div>
                <p className="text-gray-300 text-sm mb-2">{events[activeEventIndex]?.description}</p>
                <div className="flex flex-wrap text-xs text-gray-400">
                  <div className="flex items-center mr-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{events[activeEventIndex]?.date}</span>
                  </div>
                  {events[activeEventIndex]?.time && (
                    <div className="flex items-center mr-3">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{events[activeEventIndex]?.time}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{events[activeEventIndex]?.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Controale navigare (doar dacă avem mai multe evenimente) */}
              {events.length > 1 && (
                <div className="flex justify-between mt-2">
                  <button 
                    onClick={prevEvent}
                    className="p-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft size={16} className="text-white" />
                  </button>
                  <div className="text-gray-400 text-xs flex items-center">
                    {activeEventIndex + 1} din {events.length}
                  </div>
                  <button 
                    onClick={nextEvent}
                    className="p-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight size={16} className="text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherAndEventsWidget;