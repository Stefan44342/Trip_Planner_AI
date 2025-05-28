// src/view-trip/[tripid]/components/PlaceCardItem.jsx

import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Check, Plus } from 'lucide-react';
import { getPhotoUrlWithCache } from '@/service/GlobalApi';

function PlaceCardItem({ place, isSelected, onSelect }) {
  const [photoUrl, setPhotoUrl] = useState('/PlaceHolder.png');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const hasAttemptedLoad = useRef(false);
  const hasAttemptedApiLoad = useRef(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadPhoto = async () => {
      if (!place?.placeName) {
        console.warn("📭 Nu există nume de loc:", place);
        if (isMounted) setLoading(false);
        return;
      }
      
      try {
        if (!hasAttemptedLoad.current) {
          setLoading(true);
          hasAttemptedLoad.current = true;
          
          // Mai întâi verificăm dacă există URL direct în date
          if (place?.placeImageUrl && place.placeImageUrl !== "YOUR_IMAGE_URL_HERE") {
            console.log(`✅ Folosim URL direct pentru ${place.placeName}: ${place.placeImageUrl.substring(0, 30)}...`);
            if (isMounted) {
              setPhotoUrl(place.placeImageUrl);
              setLoading(false);
            }
            // Nu returnăm aici, dar permitem încărcarea imaginii - dacă eșuează, handleImageError va încerca API-ul
          } else {
            // Dacă nu există URL direct, încercăm direct API-ul
            tryLoadFromApi();
          }
        }
      } catch (error) {
        console.error(`❌ Eroare la obținerea fotografiei pentru ${place.placeName}:`, error);
        if (isMounted) {
          tryLoadFromApi();
        }
      }
    };
    
    // Funcție separată pentru a încărca din API
    const tryLoadFromApi = async () => {
      if (hasAttemptedApiLoad.current) return;
      
      hasAttemptedApiLoad.current = true;
      console.log(`🔄 Încercăm să obținem imagine via API pentru: ${place.placeName}`);
      
      try {
        const url = await getPhotoUrlWithCache(place.placeName);
        
        if (isMounted) {
          if (url) {
            console.log(`✅ URL imagine găsit via API pentru ${place.placeName}`);
            setPhotoUrl(url);
            setLoadError(false);
          } else {
            console.log(`⚠️ Nu s-a găsit URL pentru imaginea locului via API: ${place.placeName}`);
            setLoadError(true);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(`❌ Eroare la obținerea fotografiei via API pentru ${place.placeName}:`, error);
        if (isMounted) {
          setLoadError(true);
          setLoading(false);
        }
      }
    };
    
    loadPhoto();
    
    return () => {
      isMounted = false;
    };
  }, [place]);

  // Handler pentru erori la încărcarea imaginii
  const handleImageError = () => {
    console.log(`⚠️ Eroare la încărcarea imaginii pentru ${place?.placeName}, încercăm API-ul`);
    
    // În loc să setăm direct placeholder, încercăm să obținem imaginea via API
    if (!hasAttemptedApiLoad.current) {
      const tryLoadFromApi = async () => {
        hasAttemptedApiLoad.current = true;
        try {
          const url = await getPhotoUrlWithCache(place.placeName);
          
          if (url) {
            console.log(`✅ URL imagine găsit via API după eroare pentru ${place.placeName}`);
            setPhotoUrl(url);
            setLoadError(false);
          } else {
            console.log(`⚠️ Nu s-a găsit URL pentru imaginea locului: ${place.placeName}`);
            setLoadError(true);
            setPhotoUrl('/PlaceHolder.png');
          }
        } catch (error) {
          console.error(`❌ Eroare la obținerea fotografiei via API pentru ${place.placeName}:`, error);
          setLoadError(true);
          setPhotoUrl('/PlaceHolder.png');
        }
      };
      
      tryLoadFromApi();
    } else {
      // Dacă am încercat deja API-ul, atunci folosim placeholderul
      setLoadError(true);
      setPhotoUrl('/PlaceHolder.png');
    }
  };

  const handleImageLoad = () => {
    // Verificați dacă imaginea încărcată este cea reală sau placeholderul
    if (!loadError && photoUrl !== '/PlaceHolder.png') {
      console.log(`✅ Imagine încărcată cu succes pentru: ${place?.placeName}`);
    }
    setLoading(false);
  };

  const handleSelectClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect();
    }
  };

  const mapUrl = place?.geoCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${place.geoCoordinates.lat},${place.geoCoordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place?.placeName || '')}`;

  return (
    <div className="relative">
      {/* Buton de selecție pentru calculator */}
      {onSelect && (
        <button
          onClick={handleSelectClick}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300 ${
            isSelected 
              ? 'bg-amber-500 text-white shadow-lg' 
              : 'bg-white/20 text-gray-300 hover:bg-amber-500/50 hover:text-white'
          }`}
          title={isSelected ? 'Activitate selectată pentru calculator' : 'Selectează pentru calculator'}
        >
          {isSelected ? <Check size={16} /> : <Plus size={16} />}
        </button>
      )}

      <Link to={mapUrl} target="_blank" rel="noopener noreferrer">
        <div className={`bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border shadow-lg hover:shadow-teal-500/20 hover:scale-105 transition-all duration-300 h-full flex flex-col ${
          isSelected 
            ? 'border-amber-400 shadow-amber-500/20' 
            : 'border-white/20 hover:border-teal-400/50'
        }`}>
          <div className="relative h-48">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-900/50">
                <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
              </div>
            )}
            
            <img
              src={photoUrl}
              className={`w-full h-48 object-cover transition-all duration-500 ${loading ? 'opacity-60' : 'opacity-100'}`}
              alt={place?.placeName || "Locație"}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-16"></div>
            
            {/* Fallback overlay când imaginea nu poate fi încărcată */}
            {loadError && !loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/90 via-blue-900/60 to-blue-800/40">
                <span className="text-lg font-medium text-teal-300">
                  {place?.placeName?.substring(0, 20) || "Destinație"}
                </span>
              </div>
            )}

            {/* Overlay pentru activitate selectată */}
            {isSelected && (
              <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Selectat pentru Calculator
                </div>
              </div>
            )}
          </div>
          
          <div className='p-5 flex-1 flex flex-col'>
            <h2 className='font-bold text-xl mb-2 text-white'>{place?.placeName || "Locație nedisponibilă"}</h2>
            <p className='text-gray-300 mb-auto text-sm leading-relaxed'>{place?.placeDetails || "Detalii indisponibile"}</p>
            
            <div className='flex flex-wrap gap-2 mt-4'>
              {place?.ticketPricing && (
                <span className='bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-medium flex items-center'>
                  <span className="mr-1">💰</span> {place.ticketPricing}
                </span>
              )}
              {place?.rating && (
                <span className='bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-medium flex items-center'>
                  <span className="mr-1">⭐</span> {place.rating}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PlaceCardItem;