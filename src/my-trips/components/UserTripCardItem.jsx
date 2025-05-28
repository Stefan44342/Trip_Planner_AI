import { getPhotoUrlWithCache } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, MapPin, Clock, Loader2 } from 'lucide-react';

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/PlaceHolder.png');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadPhoto = async () => {
      if (!trip?.userSelection?.location?.description) {
        console.log("📍 Nu există locație pentru acest trip");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setLoadError(false);
        console.log(`🔍 Se caută imagine pentru "${trip.userSelection.location.description}"`);
        
        // Folosim noul helper cu cache
        const url = await getPhotoUrlWithCache(trip.userSelection.location.description);
        
        if (isMounted) {
          if (url) {
            console.log("✅ URL imagine găsit:", url.substring(0, 50) + "...");
            setPhotoUrl(url);
          } else {
            console.log("⚠️ Nu s-a găsit URL pentru imagine");
            setLoadError(true);
          }
        }
      } catch (error) {
        console.error("❌ Eroare la obținerea fotografiei:", error);
        if (isMounted) {
          setLoadError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadPhoto();
    
    // Cleanup pentru a evita memory leaks și race conditions
    return () => {
      isMounted = false;
    };
  }, [trip]);

  // Handler pentru erori la încărcarea imaginii
  const handleImageError = () => {
    console.log("⚠️ Eroare la încărcarea imaginii, se folosește placeholder");
    setLoadError(true);
    setPhotoUrl('/PlaceHolder.png');
  };

  return (
    <Link to={'/view-trip/' + trip?.id}>
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:shadow-2xl hover:border-teal-400/30 hover:scale-105 transition-all duration-300 h-full flex flex-col">
        {/* Card Image with improved loading state */}
        <div className="relative h-52 overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-900/50">
              <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
            </div>
          ) : null}
          
          <img 
            src={photoUrl} 
            className={`object-cover w-full h-full transition-all duration-700 ${loading ? 'opacity-60' : 'opacity-100'} ${!loadError ? 'hover:scale-110' : ''}`}
            alt={trip?.userSelection?.location?.description || "Trip destination"}
            onError={handleImageError}
            onLoad={() => console.log(`✅ Imagine încărcată pentru: ${trip?.userSelection?.location?.description}`)}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          {/* Fallback overlay când imaginea nu poate fi încărcată */}
          {loadError && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/90 via-blue-900/60 to-blue-800/40">
              <span className="text-lg font-medium text-teal-300">
                {trip?.userSelection?.location?.description?.substring(0, 20) || "Destinație"}
              </span>
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="h-5 w-5 text-teal-400 flex-shrink-0 mt-1" />
            <h2 className="font-bold text-xl text-white line-clamp-1">
              {trip?.userSelection?.location?.description || "Destinație necunoscută"}
            </h2>
          </div>
          
          <div className="flex flex-col gap-2 mt-2 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-400 flex-shrink-0" />
              <p className="text-gray-300 text-sm">
                {trip?.userSelection?.days || "?"} zile
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-teal-400 flex-shrink-0" />
              <p className="text-gray-300 text-sm">
                Buget: {trip?.userSelection?.budget || "Nedefinit"}
              </p>
            </div>
            
            {trip?.createdAt && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  Creat: {new Date(trip.createdAt.seconds * 1000).toLocaleDateString('ro-RO')}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-auto">
            <button className="w-full bg-white/10 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
              Vezi detaliile călătoriei
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;