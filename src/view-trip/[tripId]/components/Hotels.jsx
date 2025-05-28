// src/view-trip/[tripId]/components/Hotels.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import HotelCardItem from './HotelCardItem';

function Hotels({ trip, selectedHotel, onHotelSelect }) {
  const hasHotels = trip?.tripInformation?.hotels && trip.tripInformation.hotels.length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className='text-xl font-bold text-white'>Hotel Recomandation</h2>
        {selectedHotel && (
          <div className="bg-teal-500/20 border border-teal-500/30 rounded-lg px-3 py-1">
            <span className="text-teal-200 text-sm">
              Hotel selectat pentru calculator: <strong>{selectedHotel}</strong>
            </span>
          </div>
        )}
      </div>
     
      {hasHotels ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6'>
          {trip.tripInformation.hotels.map((hotel, index) => (
            <HotelCardItem 
              key={index} 
              hotel={hotel} 
              isSelected={selectedHotel === hotel.hotelName}
              onSelect={() => onHotelSelect(hotel.hotelName)}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-300 bg-white/5 backdrop-blur-sm rounded-xl">
          Nu sunt hoteluri disponibile pentru această călătorie.
        </div>
      )}
    </div>
  );
}

export default Hotels;