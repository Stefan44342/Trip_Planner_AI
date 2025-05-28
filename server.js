import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

// Cache pentru a reduce numărul de cereri către API-ul Google
const placesCache = new Map();

// Middleware pentru logging-ul tuturor cererilor
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.post('/api/getPlaceInformation', async (req, res) => {
  try {
    const { textQuery } = req.body;
    
    if (!textQuery || typeof textQuery !== 'string' || textQuery.trim() === '') {
      console.warn("⚠️ Cerere invalidă - textQuery lipsă sau invalid");
      return res.status(400).json({ error: 'textQuery este obligatoriu' });
    }
    
    // Normalizăm textQuery pentru cache
    const cacheKey = textQuery.trim().toLowerCase();
    
    // Verificăm cache-ul
    if (placesCache.has(cacheKey)) {
      console.log(`📋 Servind din cache pentru: "${textQuery}"`);
      return res.json(placesCache.get(cacheKey));
    }

    console.log(`🔍 Apelând Google Places API pentru: "${textQuery}"`);
    
    const response = await axios.post(GOOGLE_BASE_URL, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.photos,places.id,places.displayName'
      },
      timeout: 10000 // Adăugăm timeout de 10 secunde
    });
    
    // Stocăm răspunsul în cache
    placesCache.set(cacheKey, response.data);
    
    // Limitarea dimensiunii cache-ului
    if (placesCache.size > 100) {
      // Eliminăm prima intrare adăugată (cea mai veche)
      const firstKey = placesCache.keys().next().value;
      placesCache.delete(firstKey);
      console.log(`🧹 Cache curățat, eliminat: "${firstKey}"`);
    }
    
    console.log(`✅ Răspuns trimis pentru: "${textQuery}"`);
    res.json(response.data);
  } catch (error) {
    console.error('❌ Eroare server proxy:', error.response?.data || error.message);
    
    // Răspuns de eroare mai detaliat
    res.status(error.response?.status || 500).json({ 
      error: 'Nu am putut prelua datele.',
      details: error.response?.data || error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint pentru verificarea stării serverului
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    cacheSize: placesCache.size
  });
});

// Endpoint pentru curățarea cache-ului
app.post('/api/clearCache', (req, res) => {
  const size = placesCache.size;
  placesCache.clear();
  console.log(`🧹 Cache curățat manual, ${size} intrări eliminate`);
  res.json({ success: true, message: `Cache curățat, ${size} intrări eliminate` });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server proxy pornit la http://localhost:${PORT}`);
  console.log(`🔍 Endpoint-uri disponibile:`);
  console.log(`   - POST /api/getPlaceInformation`);
  console.log(`   - GET /api/health`);
  console.log(`   - POST /api/clearCache`);
});