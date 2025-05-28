import React, { useEffect, useState, useRef } from 'react'
import LocationAutocomplete from '../components/LocationAutocomplete';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravellersList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { chatSession } from '@/service/AiModel';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/FirebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Wallet, Users, Sparkles,Cloud } from 'lucide-react';
import { DatePicker } from "../components/DatePicker";

function CreateTrip() {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [animatedElements, setAnimatedElements] = useState({});

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        handleInputChange('location', location);
        console.log("Selected location:", location);
    };

    const [formData, setFormData] = useState({});

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }

    useEffect(() => {
        console.log(formData);
    }, [formData])

    useEffect(() => {
        window.scrollTo(0, 0);
        const urlParams = new URLSearchParams(window.location.search);
        const destinationParam = urlParams.get('destination');

        if (destinationParam) {
            // Decodificăm parametrul URL (pentru a transforma %20 înapoi în spațiu)
            const destinationName = decodeURIComponent(destinationParam);

            // Creăm un obiect de locație similar cu cel din LocationAutocomplete
            const preSelectedLocation = {
                description: destinationName,
                // Poți adăuga și alte proprietăți dacă sunt necesare
            };

            // Setăm destinația selectată
            setSelectedLocation(preSelectedLocation);
            handleInputChange('location', preSelectedLocation);

            console.log("Pre-completed destination:", destinationName);
        }
    }, []);
      
    // Scroll animation hook
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

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserInformation(codeResp),
        onError: (error) => console.log(error)
    })

    const onGenerateTrip = async () => {
        const user = localStorage.getItem('user');
        const formattedDate = new Date(formData.travelDate).toLocaleDateString('ro-RO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        if (!user) {
            setOpenDialog(true);
            return;
        }

        if (!formData?.location) {
            toast.error('Please select a destination');
            return;
        }

        if (!formData?.days) {
            toast.error('Please enter the number of days');
            return;
        }

        if (!formData?.budget) {
            toast.error('Please select your budget preference');
            return;
        }

        if (!formData?.traveller) {
            toast.error('Please select who will join your trip');
            return;
        }

        if (!formData?.travelDate) {
            toast.error('Te rugăm să selectezi o dată de plecare');
            return;
        }


        if (parseInt(formData.days) > 5) {
            toast.warning('Cannot generate a trip longer than 5 days');
            return;
        }
        toast.success('Generating your personalized trip plan...');

        setLoading(true);

        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location?.description)
            .replace('{totalDays}', formData?.days)
            .replace('{traveller}', formData?.traveller)
            .replace('{budget}', formData?.budget)
            .replace('{totalDays}', formData?.days)
            .replace('{travelDate}', formattedDate); 

        console.log(FINAL_PROMPT);

        const result = await chatSession.sendMessage(FINAL_PROMPT);

        console.log(result?.response?.text())
        setLoading(false);
        SaveTripInformation(result?.response?.text())
    }

    const SaveTripInformation = async (tripData) => {
        setLoading(true);

        const userInformation = JSON.parse(localStorage.getItem('user'));
        const tripId = Date.now().toString();
        await setDoc(doc(db, "AITrip", tripId), {
            userSelection: formData,
            tripInformation: JSON.parse(tripData),
            userEmail: userInformation?.email,
            id: tripId
        });
        setLoading(false);
        navigate('/view-trip/' + tripId);
    }

    const GetUserInformation = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${tokenInfo?.access_token}`,
                    Accept: 'Application/json'
                }
            }).then((resp) => {
                console.log(resp);
                localStorage.setItem('user', JSON.stringify(resp.data));
                setOpenDialog(false);
                onGenerateTrip();
            })
    }

    return (
        <div className='overflow-hidden'>
            {/* Background cu gradient păstrat din prima versiune */}
            <div className="fixed inset-0 z-[-5]">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-black z-10"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1')] bg-cover bg-center opacity-40"></div>
            </div>
            
            {/* Hero Banner - Folosind imaginea din a doua versiune */}
            <div className="relative h-72 flex items-center justify-center mb-10 z-10">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-black/90 z-0"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')] bg-cover bg-center opacity-50"></div>
                </div>
                <div className="container mx-auto px-6 text-center z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        <span className="block">Este Timpul să</span>
                        <span className="text-teal-400">Planificăm Aventura Ta</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                        Completează câteva detalii și lasă inteligența artificială să creeze itinerariul perfect pentru tine.
                    </p>
                </div>
            </div>

            <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 container mx-auto relative z-20 pb-20'>
                <div className='mt-10 flex flex-col gap-16'>
                    
                    {/* Destination Section */}
                    <div id="section-destination" className={`animate-on-scroll transition-all duration-1000 transform ${animatedElements['section-destination'] ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20">
                            <div className="flex items-center mb-6">
                                <div className="bg-teal-500 p-3 rounded-full mr-4">
                                    <MapPin className="text-white" size={24} />
                                </div>
                                <h2 className='text-white text-2xl font-bold'>Care este destinația visurilor tale?</h2>
                            </div>
                            <p className="text-gray-300 mb-6">Spune-ne unde vrei să călătorești și vom crea un itinerariu personalizat pentru tine.</p>
                            <div className="bg-white/5 backdrop-blur-md rounded-lg p-1 border border-white/10">
                                <LocationAutocomplete onSelect={handleLocationSelect} />
                            </div>
                            
                            {selectedLocation && (
                                <div className="mt-4 p-3 bg-teal-500/20 backdrop-blur-md border border-teal-500/30 rounded-lg text-teal-200 flex items-center">
                                    <MapPin className="mr-2" size={18} />
                                    <span>Destinație selectată: <strong>{selectedLocation.description}</strong></span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Days Section */}
                    <div id="section-days" className={`animate-on-scroll transition-all duration-1000 transform ${animatedElements['section-days'] ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20">
                            <div className="flex items-center mb-6">
                                <div className="bg-blue-500 p-3 rounded-full mr-4">
                                    <Calendar className="text-white" size={24} />
                                </div>
                                <h2 className='text-white text-2xl font-bold'>Câte zile va dura aventura ta?</h2>
                            </div>
                            <p className="text-gray-300 mb-6">Durata călătoriei ne ajută să planificăm activitățile perfecte, fără a te epuiza.</p>
                            <div className="bg-white/5 backdrop-blur-md rounded-lg p-1 border border-white/10">
                                <Input 
                                    className="border-0 text-lg py-6 bg-transparent text-white placeholder:text-gray-400" 
                                    placeholder={"Ex. 3"} 
                                    type="number"
                                    onChange={(e)=>handleInputChange("days",e.target.value)}
                                />
                            </div>
                            {formData?.days && parseInt(formData.days) > 5 && (
                                <div className="mt-4 p-3 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-lg text-amber-200">
                                    <span>⚠️ Pentru rezultate optime, recomandăm maxim 5 zile.</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/*Date Section*/}
                    <div id="section-date" className={`animate-on-scroll transition-all duration-1000 transform ${animatedElements['section-date'] ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20">
                            <div className="flex items-center mb-6">
                                <div className="bg-green-500 p-3 rounded-full mr-4">
                                    <Calendar className="text-white" size={24} />
                                </div>
                                <h2 className='text-white text-2xl font-bold'>Când dorești să pornești în călătorie?</h2>
                            </div>
                            <p className="text-gray-300 mb-6">Data de plecare ne ajută să planificăm activitățile în funcție de sezon și evenimente locale.</p>
                            <div className="bg-white/5 backdrop-blur-md rounded-lg p-1 border border-white/10">
                                <DatePicker onSelect={(date) => handleInputChange("travelDate", date)} />
                            </div>
                            {formData?.travelDate && (
                                <div className="mt-4 p-3 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-lg text-green-200 flex items-center">
                                    <Calendar className="mr-2" size={18} />
                                    <span>Data de plecare: <strong>{new Date(formData.travelDate).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Budget Section */}
                    <div id="section-budget" className={`animate-on-scroll transition-all duration-1000 transform ${animatedElements['section-budget'] ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20">
                            <div className="flex items-center mb-6">
                                <div className="bg-purple-500 p-3 rounded-full mr-4">
                                    <Wallet className="text-white" size={24} />
                                </div>
                                <h2 className='text-white text-2xl font-bold'>Care este stilul tău de cheltuială?</h2>
                            </div>
                            <p className="text-gray-300 mb-6">Alege bugetul care ți se potrivește și vom adapta recomandările noastre corespunzător.</p>
                            
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-5'>
                                {SelectBudgetOptions.map((item,index)=>(
                                    <div 
                                        key={index} 
                                        className={`p-6 border backdrop-blur-md rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg 
                                        ${formData?.budget === item.title 
                                            ? 'border-purple-500 bg-purple-500/20 shadow-lg transform scale-105' 
                                            : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/10'}`} 
                                        onClick={()=>handleInputChange('budget',item.title)}
                                    >
                                        <div className="text-4xl text-center mb-3">{item.icon}</div>
                                        <h2 className='text-xl font-bold text-center mb-2 text-white'>{item.title}</h2>
                                        <p className='text-sm text-gray-300 text-center'>{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Travelers Section */}
                    <div id="section-travelers" className={`animate-on-scroll transition-all duration-1000 transform ${animatedElements['section-travelers'] ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20">
                            <div className="flex items-center mb-6">
                                <div className="bg-amber-500 p-3 rounded-full mr-4">
                                    <Users className="text-white" size={24} />
                                </div>
                                <h2 className='text-white text-2xl font-bold'>Cine se alătură aventurii tale?</h2>
                            </div>
                            <p className="text-gray-300 mb-6">Spune-ne cine te însoțește și vom personaliza experiențele pentru grupul tău.</p>
                            
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-5'>
                                {SelectTravellersList.map((item,index)=>(
                                    <div 
                                        key={index} 
                                        className={`p-5 border backdrop-blur-md rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg 
                                        ${formData?.traveller === item.people 
                                            ? 'border-amber-500 bg-amber-500/20 shadow-lg transform scale-105' 
                                            : 'border-white/10 bg-white/5 hover:border-amber-500/50 hover:bg-amber-500/10'}`} 
                                        onClick={()=>handleInputChange('traveller',item.people)}
                                    >
                                        <div className="text-4xl text-center mb-3">{item.icon}</div>
                                        <h2 className='text-lg font-bold text-center mb-2 text-white'>{item.title}</h2>
                                        <p className='text-xs text-gray-300 text-center'>{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Generate Button Section */}
                    <div id="section-generate" className={`animate-on-scroll transition-all duration-1000 transform ${animatedElements['section-generate'] ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                        <div className="bg-gradient-to-r from-blue-800/80 to-teal-700/80 backdrop-blur-md p-8 rounded-xl shadow-lg text-center border border-white/20">
                            <Sparkles className="text-yellow-300 mx-auto mb-4" size={40} />
                            <h2 className="text-white text-2xl font-bold mb-4">Ești gata să începi aventura?</h2>
                            <p className="text-gray-200 mb-8">AI-ul nostru va crea un itinerariu personalizat bazat pe preferințele tale.</p>
                            
                            <Button 
                                disabled={loading} 
                                onClick={onGenerateTrip} 
                                className="bg-teal-500 hover:bg-teal-400 text-white px-10 py-6 text-lg rounded-lg font-medium mx-auto flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                                {loading? 
                                    <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin'/> : 
                                    <>
                                        Generează Călătoria
                                        <Sparkles className="ml-2" size={20} />
                                    </>
                                }
                            </Button>
                            {/* Buton pentru informații meteo - doar dacă avem destinația selectată */}
                            {selectedLocation && (
                                <div className="mt-6 text-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const destination = selectedLocation.description;
                                            const date = formData.travelDate ? new Date(formData.travelDate).toISOString().split('T')[0] : '';
                                            const url = `/weather-test?destination=${encodeURIComponent(destination)}${date ? `&date=${date}` : ''}`;
                                            window.open(url, '_blank');
                                        }}
                                        className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center justify-center mx-auto transition-colors duration-300 shadow-md"
                                    >
                                        <Cloud className="mr-2" size={18} />
                                        Vezi Vremea în {selectedLocation.description.split(',')[0]}
                                        {formData.travelDate && (
                                            <span className="ml-2 text-sm opacity-80">
                                                ({new Date(formData.travelDate).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })})
                                            </span>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <ToastContainer position="top-right" autoClose={10000} />

                <Dialog open={openDialog}>
                    <DialogContent className="max-w-md bg-blue-900/90 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <DialogHeader>
                            <img src='/logo3.png' className='h-24 w-auto mx-auto mb-4'></img>
                            <DialogTitle className="text-xl font-bold text-center text-white">Conectează-te pentru a continua</DialogTitle>
                            <DialogDescription className="text-center">
                                <p className="text-gray-300 mt-2 mb-6">Autentifică-te pentru a salva și gestiona călătoriile tale</p>
                                <Button 
                                    onClick={login} 
                                    className='w-full mt-5 flex gap-4 items-center justify-center py-6 bg-teal-500 hover:bg-teal-400 text-white rounded-lg shadow-md'
                                >
                                    <FcGoogle className='h-6 w-6'/>
                                    Conectează-te cu Google
                                </Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default CreateTrip