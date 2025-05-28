import axios from "axios";

// Base URL pentru serverul proxy
const BASE_URL = 'http://localhost:3001/api/getPlaceInformation';

// Configurație pentru requesturi
const config = {
  headers: {
    'Content-Type': 'application/json'
  },
  // Adăugăm timeout pentru a evita requesturile blocate
  timeout: 15000 // Mărirea timeout-ului la 15 secunde
};

// Funcție pentru gestionarea eficientă a obținerii informațiilor despre locații
export const GetPlaceInformation = async (data) => {
  // Verificare mai robustă a parametrilor
  if (!data || !data.textQuery || typeof data.textQuery !== 'string' || data.textQuery.trim() === '') {
    console.warn("⚠️ textQuery lipsă sau invalid:", data);
    return Promise.reject(new Error("textQuery este obligatoriu și trebuie să fie un string nevid"));
  }

  try {
    console.log(`🔍 Se caută informații pentru: "${data.textQuery}"`);
    return await axios.post(BASE_URL, data, config);
  } catch (error) {
    // Logarea detaliată a erorilor
    if (error.response) {
      // Eroare de la server cu răspuns
      console.error(`❌ Eroare API (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      // Eroare fără răspuns (probleme de rețea)
      console.error("❌ Nu s-a primit răspuns de la server:", error.request);
    } else {
      // Eroare în configurare
      console.error("❌ Eroare în configurarea cererii:", error.message);
    }
    
    return Promise.reject(error);
  }
};

// URL-ul pentru fotografii
export const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' + import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

// Funcție helper pentru obținerea URLs de imagini cu mecanism de cache
const photoCache = new Map();
const failedRequests = new Set(); // Adăugăm tracking pentru requesturi eșuate

export const getPhotoUrlWithCache = async (searchTerm) => {
  if (!searchTerm) {
    console.warn("⚠️ searchTerm lipsă la apelul getPhotoUrlWithCache");
    return null;
  }
  
  // Normalizăm searchTerm pentru a face căutarea cache-ului mai robustă
  const normalizedTerm = searchTerm.trim().toLowerCase();
  
  // Verificăm dacă URL-ul este deja în cache
  if (photoCache.has(normalizedTerm)) {
    console.log(`📸 URL găsit în cache pentru "${searchTerm}"`);
    return photoCache.get(normalizedTerm);
  }
  
  // Verificăm dacă această cerere a eșuat anterior pentru a evita cereri redundante
  if (failedRequests.has(normalizedTerm)) {
    console.log(`⚠️ Se ignoră cererea pentru "${searchTerm}" - a eșuat anterior`);
    return null; 
  }
  
  try {
    const data = { textQuery: searchTerm };
    const result = await GetPlaceInformation(data);
    
    if (result?.data?.places?.[0]?.photos?.[0]?.name) {
      const photoName = result.data.places[0].photos[0].name;
      const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
      
      // Salvăm URL-ul în cache pentru utilizare ulterioară
      photoCache.set(normalizedTerm, photoUrl);
      console.log(`📸 URL nou obținut pentru "${searchTerm}": ${photoUrl.substring(0, 50)}...`);
      
      return photoUrl;
    } else {
      console.warn(`⚠️ Nu s-au găsit fotografii pentru "${searchTerm}"`);
      failedRequests.add(normalizedTerm); // Marcăm ca eșuat
      return null;
    }
  } catch (error) {
    console.error(`❌ Nu s-a putut obține foto pentru "${searchTerm}":`, error);
    failedRequests.add(normalizedTerm); // Marcăm ca eșuat
    return null;
  }
};

// Funcție pentru curățarea cache-ului dacă devine prea mare
export const clearPhotoCache = () => {
  console.log(`🧹 Se curăță cache-ul de fotografii. Înainte: ${photoCache.size} intrări`);
  photoCache.clear();
  failedRequests.clear();
  console.log(`✅ Cache curățat`);
};