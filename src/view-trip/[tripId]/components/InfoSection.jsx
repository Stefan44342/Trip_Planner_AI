import { Button } from '@/components/ui/button'
import { GetPlaceInformation, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { IoIosSend } from "react-icons/io";


function InfoSection({trip}) {
  const [photoUrl,setPhotoUrl]=useState();
  useEffect(() => {
    if (trip?.userSelection?.location?.description) {
      GetPlacePhoto();
    } else {
      console.warn("📭 trip sau location.description nu este gata:", trip);
    }
  }, [trip]);
  

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: trip?.userSelection?.location?.description
      }
      console.log("📦 Data trimisă:", data);
  
      const result = await GetPlaceInformation(data);
      console.log("🔍 Răspuns complet:", result); 
  
      
      if (result?.data?.places?.[0]?.photos?.length > 0) {
        // Folosește prima fotografie disponibilă în loc de a accesa direct indexul 3
        const photoIndex = result.data.places[0].photos.length > 3 ? 3 : 0;
        const photoName = result.data.places[0].photos[photoIndex].name;
        const photo_Url = PHOTO_REF_URL.replace('{NAME}', photoName);
        setPhotoUrl(photo_Url);
        console.log("📸 photoUrl setat:", photo_Url);
      } else {
        console.error("⚠️ Nu am găsit fotografii în răspuns:", result);
      }
    } catch (error) {
      console.error("❌ Eroare la obținerea fotografiei:", error);
    }
  }

  return (
    <div>
      <img src={photoUrl?photoUrl:'/PlaceHolder.png'} className='h-[340px] w-full object-cover rounded-xl'></img>
      <div className='flex justify-between items-center'>
            <div className='my-5 flex flex-col gap-2'>
                <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.description}</h2>
                <div className='flex gap-5'>
                    <h2 className='p-1 px-3 bg-green-200 text-emerald-900 rounded-full'>{trip?.userSelection?.days} Days</h2>
                    <h2 className='p-1 px-3 bg-green-200 text-emerald-900 rounded-full'>{trip?.userSelection?.budget} Budget</h2>
                    <h2 className='p-1 px-3 bg-green-200 text-emerald-900 rounded-full'>Number of travellers: {trip?.userSelection?.traveller}</h2>
                </div>
            </div>
            
      </div>
    </div>
  )
}

export default InfoSection
