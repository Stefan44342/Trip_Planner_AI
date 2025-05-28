// src/view-trip/[tripid]/index.jsx - Versiunea actualizată

import { db } from '@/service/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import InfoSection from './components/InfoSection';
import Hotels from './components/Hotels';
import PlacesToVisit from './components/PlacesToVisit';
import Footer from './components/Footer';
import CostEstimator from './components/CostEstimator'; // Importăm calculatorul

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  const [animatedElements, setAnimatedElements] = useState({});
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState({});

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    const docRef = doc(db, 'AITrip', tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document: ", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No such document");
      toast('No trip Found!');
    }
  };

  // Salvează selecția în Firebase
  const handleSaveSelection = async (selectionData) => {
    try {
      const docRef = doc(db, 'AITrip', tripId);
      await updateDoc(docRef, {
        costCalculation: selectionData,
        lastUpdated: new Date().toISOString()
      });
      
      toast.success('Calculul de costuri a fost salvat cu succes!');
      console.log('Selection saved:', selectionData);
    } catch (error) {
      console.error('Error saving selection:', error);
      toast.error('Eroare la salvarea calculului de costuri.');
    }
  };

  // Mutați IntersectionObserver după ce `trip` este setat
  useEffect(() => {
    if (!trip || Object.keys(trip).length === 0) return;
  
    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          console.log(`Element ${entry.target.id} is intersecting: ${entry.isIntersecting}`);
          if (entry.isIntersecting) {
            setAnimatedElements(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
            observer.unobserve(entry.target);
          }
        });
      }, { 
        threshold: 0.05,
        rootMargin: '0px 0px -100px 0px'
      });
  
      const elements = document.querySelectorAll('.animate-on-scroll');
      console.log(`Found ${elements.length} elements to animate`);
      elements.forEach(el => {
        console.log(`Observing element with ID: ${el.id}`);
        observer.observe(el);
      });
  
      return () => observer.disconnect();
    }, 1000);
  
    return () => clearTimeout(timeout);
  }, [trip]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  

  useEffect(() => {
    if (!trip || Object.keys(trip).length === 0) return;

    const timer = setTimeout(() => {
        setAnimatedElements(prev => ({
            ...prev,
            'places-section': true,
            'cost-section': true // Adăugăm și secțiunea de costuri
        }));
        console.log("Forțează afișarea places-section după timeout");
    }, 3000);

    return () => clearTimeout(timer);
  }, [trip]);

  return (
    <div className="overflow-hidden min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-black">
      <div className="container mx-auto p-6 md:px-10 lg:px-20">
        {/* Information Section */}
        <div
          id="info-section"
          className={`animate-on-scroll transition-all duration-1000 transform ${
            animatedElements['info-section'] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="backdrop-blur-md bg-white/5 rounded-xl border border-white/20 p-6 md:p-8 mb-10">
            <InfoSection trip={trip} />
          </div>
        </div>

        {/* Recommended Hotels */}
        <div
          id="hotels-section"
          className={`animate-on-scroll transition-all duration-1000 delay-100 transform ${
            animatedElements['hotels-section'] ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
        >
          <div className="backdrop-blur-md bg-white/5 rounded-xl border border-white/20 p-6 md:p-8 mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              <span className="text-teal-400">Cazare</span> Recomandată
            </h2>
            <Hotels 
              trip={trip} 
              selectedHotel={selectedHotel}
              onHotelSelect={setSelectedHotel}
            />
          </div>
        </div>

        {/* Itinerary Section */}
        <div
          id="places-section"
          className={`animate-on-scroll transition-all duration-1000 delay-200 transform ${
            animatedElements['places-section'] ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <div className="backdrop-blur-md bg-white/5 rounded-xl border border-white/20 p-6 md:p-8 mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">Itinerariul</span>
            <span className="text-white ml-2">Tău</span>
            <span className="ml-2 text-lg bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Explorează
            </span>
            </h2>
            <PlacesToVisit 
              trip={trip} 
              selectedActivities={selectedActivities}
              onActivitySelect={setSelectedActivities}
            />
          </div>
        </div>

        {/* Cost Calculator Section */}
        <div
          id="cost-section"
          className={`animate-on-scroll transition-all duration-1000 delay-300 transform ${
            animatedElements['cost-section'] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="backdrop-blur-md bg-white/5 rounded-xl border border-white/20 p-6 md:p-8 mb-10">
            {trip && trip.tripInformation && (
              <CostEstimator 
                tripData={{
                  userSelection: trip.userSelection,
                  hotels: trip.tripInformation.hotels,
                  itinerary: trip.tripInformation.itinerary
                }}
                onSaveSelection={handleSaveSelection}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          id="footer-section"
          className={`animate-on-scroll transition-all duration-1000 delay-400 transform ${
            animatedElements['footer-section'] ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <div className="backdrop-blur-md bg-white/5 rounded-xl border border-white/20 p-6 md:p-8">
            <Footer trip={trip} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Viewtrip;