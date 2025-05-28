// src/view-trip/[tripId]/components/HotelCardItem.jsx - Continuare

import { getPhotoUrlWithCache } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Check, Plus } from 'lucide-react';

function HotelCardItem({ hotel, isSelected, onSelect }) {
 const [photoUrl, setPhotoUrl] = useState('/PlaceHolder.png');
 const [loading, setLoading] = useState(true);
 const [loadError, setLoadError] = useState(false);
 
 useEffect(() => {
   let isMounted = true;
   
   const loadPhoto = async () => {
     if (!hotel?.hotelName) {
       console.warn("📭 hotel sau hotelName nu este disponibil:", hotel);
       setLoading(false);
       return;
     }
     
     try {
       setLoading(true);
       setLoadError(false);
       
       const url = await getPhotoUrlWithCache(hotel.hotelName);
       
       if (isMounted) {
         if (url) {
           setPhotoUrl(url);
         } else {
           if (hotel.hotelImageUrl && hotel.hotelImageUrl !== "YOUR_IMAGE_URL_HERE") {
             setPhotoUrl(hotel.hotelImageUrl);
           } else {
             setLoadError(true);
           }
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
   
   return () => {
     isMounted = false;
   };
 }, [hotel]);
 
 const mapQueryLocation = hotel?.hotelAddress || hotel?.hotelName || "Hotel";
 
 const handleImageError = () => {
   console.log("⚠️ Eroare la încărcarea imaginii pentru:", hotel?.hotelName);
   setLoadError(true);
   setPhotoUrl('/PlaceHolder.png');
 };

 const handleSelectClick = (e) => {
   e.preventDefault();
   e.stopPropagation();
   if (onSelect) {
     onSelect();
   }
 };
 
 return (
   <div className="h-full relative">
     {/* Buton de selecție pentru calculator */}
     {onSelect && (
       <button
         onClick={handleSelectClick}
         className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300 ${
           isSelected 
             ? 'bg-teal-500 text-white shadow-lg' 
             : 'bg-white/20 text-gray-300 hover:bg-teal-500/50 hover:text-white'
         }`}
         title={isSelected ? 'Hotel selectat pentru calculator' : 'Selectează pentru calculator'}
       >
         {isSelected ? <Check size={16} /> : <Plus size={16} />}
       </button>
     )}

     <Link 
       to={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapQueryLocation)}
       target='_blank'
       className="block h-full"
     >
       <div className={`h-full bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border shadow-lg hover:shadow-teal-500/10 hover:scale-105 transition-all duration-300 ${
         isSelected 
           ? 'border-teal-400 shadow-teal-500/20' 
           : 'border-white/20 hover:border-teal-400/50'
       }`}>
         <div className="h-[180px] w-full relative rounded-t-xl overflow-hidden">
           {loading ? (
             <div className="absolute inset-0 flex items-center justify-center bg-gray-700/50">
               <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
             </div>
           ) : null}
           
           <img 
             src={loadError ? '/PlaceHolder.png' : photoUrl} 
             alt={hotel?.hotelName || "Hotel"}
             className={`h-full w-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
             onError={handleImageError}
             onLoad={() => console.log(`✅ Imagine încărcată pentru: ${hotel?.hotelName}`)}
           />
           
           {loadError && !loading && (
             <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80">
               <span className="text-sm text-gray-300">
                 {hotel?.hotelName?.substring(0, 15) || "Hotel"}
               </span>
             </div>
           )}

           {/* Overlay pentru hotel selectat */}
           {isSelected && (
             <div className="absolute inset-0 bg-teal-500/20 flex items-center justify-center">
               <div className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                 Selectat pentru Calculator
               </div>
             </div>
           )}
         </div>
         
         <div className='p-4 flex flex-col gap-2'>
           <h2 className='font-medium text-white line-clamp-1'>{hotel?.hotelName || "Hotel"}</h2>
           <h2 className='text-xs text-gray-400 line-clamp-2'>📍{hotel?.hotelAddress || "Adresa indisponibilă"}</h2>
           <h2 className='text-sm text-gray-300'>💰{hotel?.priceRange || hotel?.price || "Preț indisponibil"} per night</h2>
           <h2 className='text-sm text-gray-300'>⭐{hotel?.rating || "N/A"} stars</h2>
         </div>
       </div>
     </Link>
   </div>
 );
}

export default HotelCardItem;