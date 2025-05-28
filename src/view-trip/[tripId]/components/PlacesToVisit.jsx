// src/view-trip/[tripid]/components/PlacesToVisit.jsx - Versiunea actualizată

import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip, selectedActivities, onActivitySelect }) {
  console.log("Trip data pentru places:", trip?.tripInformation?.itinerary);
  
  if (!trip?.tripInformation?.itinerary) {
    console.log("Trip data:", trip);
    return <div className="text-gray-300 text-center p-6">No itinerary data available</div>;
  }
  
  const dayKeys = Object.keys(trip.tripInformation.itinerary)
    .filter(key => key.startsWith('day'))
    .sort((a, b) => {
      const numA = parseInt(a.replace('day', ''));
      const numB = parseInt(b.replace('day', ''));
      return numA - numB;
    });

  const handleActivityToggle = (dayKey, placeIndex) => {
    const activityId = `${dayKey}-${placeIndex}`;
    const newSelected = { ...selectedActivities };
    
    if (newSelected[activityId]?.selected) {
      newSelected[activityId] = { ...newSelected[activityId], selected: false };
    } else {
      newSelected[activityId] = { 
        selected: true, 
        activity: trip.tripInformation.itinerary[dayKey].plan[placeIndex]
      };
    }
    
    onActivitySelect(newSelected);
  };
  
  return (
    <div className="space-y-10">
      {dayKeys.map((dayKey, index) => {
        const dayData = trip.tripInformation.itinerary[dayKey];
        const dayNumber = dayKey.replace('day', '');
        
        return (
          <div key={index} className="mb-10 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-800/60 to-teal-700/40 p-4 rounded-lg mb-6 inline-block shadow-lg border border-white/10">
              <h2 className="font-bold text-xl text-white tracking-wide">Day {dayNumber}</h2>
              {dayData.theme && (
                <p className="font-medium text-teal-300 mt-1">{dayData.theme}</p>
              )}
            </div>
            
            {dayData.plan && Array.isArray(dayData.plan) && dayData.plan.length > 0 ? (
              groupPlacesByTimeSlots(dayData.plan).map((timeSlot, timeIndex) => (
                <div key={timeIndex} className="mb-8">
                  <h3 className="text-amber-400 font-medium mb-4 pl-2 border-l-2 border-amber-400 flex items-center">
                    <span className=" w-5 h-5 rounded-full bg-amber-400/20 mr-2 flex items-center justify-center">
                      <span className="text-amber-400 text-xs">⏰</span>
                    </span>
                    <span>{timeSlot.timeRange}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {timeSlot.places.map((place, placeIndex) => {
                      const originalIndex = dayData.plan.indexOf(place);
                      const activityId = `${dayKey}-${originalIndex}`;
                      const isSelected = selectedActivities[activityId]?.selected || false;
                      
                      return (
                        <PlaceCardItem 
                          key={originalIndex} 
                          place={place}
                          isSelected={isSelected}
                          onSelect={() => handleActivityToggle(dayKey, originalIndex)}
                        />
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No places planned for this day</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function groupPlacesByTimeSlots(places) {
  const timeSlots = [
    { timeRange: "9:00 AM - 12:00 PM", places: [] },
    { timeRange: "12:00 PM - 2:00 PM", places: [] },
    { timeRange: "2:00 PM - 4:00 PM", places: [] },
    { timeRange: "4:00 PM - 6:00 PM", places: [] },
    { timeRange: "6:00 PM - 8:00 PM", places: [] }
  ];
  
  places.forEach((place, index) => {
    const slotIndex = index % timeSlots.length;
    timeSlots[slotIndex].places.push(place);
  });
  
  return timeSlots.filter(slot => slot.places.length > 0);
}

export default PlacesToVisit;