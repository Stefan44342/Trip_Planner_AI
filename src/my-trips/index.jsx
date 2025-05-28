import { db } from '@/service/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, CalendarDays, DollarSign, Loader2 } from 'lucide-react';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatedElements, setAnimatedElements] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimatedElements(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
      });
    }, 100);
    
    return () => observer.disconnect();
  }, [userTrips]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user) {
        navigate('/');
        return;
      }
      
      const q = query(collection(db, 'AITrip'), where("userEmail", "==", user?.email));
      const querySnapshot = await getDocs(q);
      
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({...doc.data(), docId: doc.id});
      });
      
      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black pt-28 pb-20 px-6 md:px-10">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Călătoriile <span className="text-teal-400">Mele</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl md:mx-0 mx-auto">
            Toate aventurile tale planificate cu Tripwise, gata să fie explorate sau retrăite.
          </p>
        </div>
        
        {/* Trips Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-teal-400 animate-spin mb-4" />
              <p className="text-gray-300">Se încarcă călătoriile tale...</p>
            </div>
          </div>
        ) : userTrips.length === 0 ? (
          <div id="no-trips" className="animate-on-scroll bg-white/5 backdrop-blur-md p-10 rounded-xl border border-white/10 text-center max-w-2xl mx-auto transition-all duration-1000 transform translate-y-0 opacity-100">
            <Map className="h-16 w-16 text-teal-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">Nicio călătorie încă</h2>
            <p className="text-gray-300 mb-8">
              Se pare că nu ai planificat încă nicio călătorie. Începe prima ta aventură Tripwise acum!
            </p>
            <button 
              onClick={() => navigate('/create-trip')}
              className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all"
            >
              Planifică Prima Călătorie
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {userTrips.map((trip, index) => (
              <div 
                id={`trip-${index}`} 
                key={index}
                className="animate-on-scroll transition-all duration-700 transform"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  transform: animatedElements[`trip-${index}`] ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
                  opacity: animatedElements[`trip-${index}`] ? 1 : 0
                }}
              >
                <UserTripCardItem trip={trip} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;