import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Globe, Map, Calendar, 
  Users, Compass, DollarSign, Heart 
} from 'lucide-react';

function Hero() {
  const useScrollAnimation = () => {
    const [elements, setElements] = useState({});
    
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setElements(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
      });
      
      return () => observer.disconnect();
    }, []);
    
    return elements;
  };
  
  const animatedElements = useScrollAnimation();
  
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-black/80 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1')] bg-cover bg-center"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 z-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            <span className="block">Este Timpul să</span> 
            <span className="text-teal-400">Începi Aventura</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-10">
            Lasă inteligența artificială să planifice călătoria perfectă, în timp ce tu te concentrezi pe crearea amintirilor.
          </p>
          <Link to="/create-trip">
            <Button className="bg-teal-500 hover:bg-teal-400 text-white text-lg px-8 py-6 rounded-lg font-medium flex items-center gap-2 mx-auto transition-all shadow-lg hover:shadow-xl">
              Începe Călătoria 
              <ArrowRight size={22} />
            </Button>
          </Link>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-10 w-full flex justify-center animate-bounce">
            <div className="flex flex-col items-center">
              <p className="text-gray-300 mb-2">Descoperă mai multe</p>
              <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section - Cards appearing from left and right */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Ce Face <span className="text-teal-400">Tripwise</span> Special
          </h2>
          
          {/* Feature 1 - Left */}
          <div id="feature-1" className={`animate-on-scroll flex flex-col md:flex-row items-center gap-8 mb-20 transition-all duration-1000 transform ${animatedElements['feature-1'] ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 h-full">
                <Map className="text-teal-400 mb-4" size={40} />
                <h3 className="text-2xl font-bold text-white mb-3">Itinerarii Personalizate</h3>
                <p className="text-gray-300 text-lg">
                  Algoritmul nostru de AI analizează preferințele tale și creează un plan de călătorie unic, adaptat exact dorințelor tale. Fără mai multe ore pierdute căutând online.
                </p>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img 
                src="/landing1.png" 
                alt="Personalized Itinerary" 
                className="w-[200px]" 
              />
            </div>
          </div>
          
          {/* Feature 2 - Right */}
          <div id="feature-2" className={`animate-on-scroll flex flex-col md:flex-row-reverse items-center gap-8 mb-20 transition-all duration-1000 transform ${animatedElements['feature-2'] ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 h-full">
                <Compass className="text-teal-400 mb-4" size={40} />
                <h3 className="text-2xl font-bold text-white mb-3">Sfaturi Locale Autentice</h3>
                <p className="text-gray-300 text-lg">
                  Descoperă locuri ascunse și experiențe autentice recomandate de localnici. AI-ul nostru te ajută să eviți capcanele turistice și să trăiești destinația ca un local.
                </p>
              </div>
            </div>
            <div className="flex-1 flex justify-center h-[250px] w-[auto] overflow-hidden">
              <img 
                src="/local.png" 
                alt="Local Insights" 
                className="h-auto w-auto object-cove " 
              />
            </div>
          </div>
          
          {/* Feature 3 - Left */}
          <div id="feature-3" className={`animate-on-scroll flex flex-col md:flex-row items-center gap-8 transition-all duration-1000 transform ${animatedElements['feature-3'] ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="flex-1">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 h-full">
                <Calendar className="text-teal-400 mb-4" size={40} />
                <h3 className="text-2xl font-bold text-white mb-3">Planificare Fără Efort</h3>
                <p className="text-gray-300 text-lg">
                  În doar câteva secunde, obții un itinerariu complet pe zile, cu activități, timpi de călătorie și recomandări. Tot ce îți rămâne de făcut este să te bucuri de călătorie.
                </p>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img 
                src="/plan.png" 
                alt="Effortless Planning" 
                className=" w-[400px]" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Sign Up Section */}
      <div className="py-20 bg-gradient-to-b from-blue-900 to-blue-800">
        <div className="container mx-auto px-6">
          <div id="signup" className={`animate-on-scroll bg-white/10 backdrop-blur-md p-10 rounded-xl border border-white/20 max-w-3xl mx-auto text-center transition-all duration-1000 transform ${animatedElements['signup'] ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
            <h2 className="text-3xl font-bold text-white mb-4">Nu ai cont la noi?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Loghează-te rapid și simplu cu email-ul tău pentru a salva și gestiona itinerariile create.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-6 rounded-lg font-medium text-lg">
                Înregistrează-te Acum
              </Button>
              <Button className="bg-transparent border-2 border-white/50 hover:border-white text-white px-8 py-6 rounded-lg font-medium text-lg">
                Autentificare
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-20 bg-gradient-to-b from-blue-800 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Cum <span className="text-teal-400">Funcționează</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div id="step-1" className={`animate-on-scroll transition-all duration-700 delay-100 transform ${animatedElements['step-1'] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 h-full relative">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-xl">1</div>
                <Globe className="text-teal-400 mb-6 mt-4" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">Alege Destinația</h3>
                <p className="text-gray-300">
                  Selectează orice oraș sau regiune din lume pe care dorești să o explorezi.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div id="step-2" className={`animate-on-scroll transition-all duration-700 delay-200 transform ${animatedElements['step-2'] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 h-full relative">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-xl">2</div>
                <Calendar className="text-teal-400 mb-6 mt-4" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">Durata & Buget</h3>
                <p className="text-gray-300">
                  Specifică numărul de zile și bugetul disponibil pentru călătoria ta.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div id="step-3" className={`animate-on-scroll transition-all duration-700 delay-300 transform ${animatedElements['step-3'] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 h-full relative">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-xl">3</div>
                <Heart className="text-teal-400 mb-6 mt-4" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">Stil & Interese</h3>
                <p className="text-gray-300">
                  Spune-ne ce îți place: aventură, cultură, gastronomie, relaxare și multe altele.
                </p>
              </div>
            </div>
            
            {/* Step 4 */}
            <div id="step-4" className={`animate-on-scroll transition-all duration-700 delay-400 transform ${animatedElements['step-4'] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 h-full relative">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-xl">4</div>
                <Users className="text-teal-400 mb-6 mt-4" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">Compania Ta</h3>
                <p className="text-gray-300">
                  Călătorești singur, cu partenerul, familia sau prietenii? Adaptăm experiența pentru grupul tău.
                </p>
              </div>
            </div>
          </div>
          
          {/* Final CTA */}
          <div id="final-cta" className={`animate-on-scroll mt-16 text-center transition-all duration-1000 transform ${animatedElements['final-cta'] ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
            <h3 className="text-2xl font-bold text-white mb-6">Gata să Pornești în Aventură?</h3>
            <Link to="/create-trip">
              <Button className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-6 rounded-lg font-medium text-lg flex items-center gap-2 mx-auto">
                Planifică Călătoria Acum
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;