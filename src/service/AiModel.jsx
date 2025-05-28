import { GoogleGenerativeAI } from "@google/generative-ai";

  
const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
  
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});
  
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Generate Travel Plan for Location : Las Vegas, for 3 Days for Couple with a Cheap budget ,Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.Give real sample image URLs for the hotels and attractions (e.g., from Unsplash, Pexels or similar free image services)."}
        ]
      },
      {
        role: "model",
        parts: [
          {text: `I cannot directly access and display images or real-time pricing for hotels. Hotel prices are incredibly dynamic and change constantly. Also, I do not have access to a live image database. Therefore, I'll provide you with a JSON structure containing the information you requested, but you will need to fill in the image URLs, real-time pricing, and potentially refine the geo-coordinates using a map service like Google Maps.
  
  \`\`\`json
  {
    "tripName": "Las Vegas Budget Trip for Couples (3 Days)",
    "hotels": [
      {
        "hotelName": "Circus Circus Hotel & Casino",
        "hotelAddress": "2880 S Las Vegas Blvd, Las Vegas, NV 89109",
        "price": "Check online for current rates", 
        "hotelImageUrl": "YOUR_IMAGE_URL_HERE",
        "geoCoordinates": {"lat": 36.1204, "lng": -115.1728},
        "rating": "3.5",
        "description": "A budget-friendly option with a circus theme, offering various attractions and amenities."
      },
      {
        "hotelName": "Excalibur Hotel & Casino",
        "hotelAddress": "3850 S Las Vegas Blvd, Las Vegas, NV 89109",
        "price": "Check online for current rates",
        "hotelImageUrl": "YOUR_IMAGE_URL_HERE",
        "geoCoordinates": {"lat": 36.0914, "lng": -115.1762},
        "rating": "3.8",
        "description": "Medieval-themed hotel and casino with affordable rooms and a convenient location on the Strip."
      },
      {
        "hotelName": "Luxor Hotel & Casino",
        "hotelAddress": "3900 S Las Vegas Blvd, Las Vegas, NV 89119",
        "price": "Check online for current rates",
        "hotelImageUrl": "YOUR_IMAGE_URL_HERE",
        "geoCoordinates": {"lat": 36.0900, "lng": -115.1728},
        "rating": "4.0",
        "description": "Pyramid-shaped hotel with a distinct theme. Offers relatively affordable options compared to other Strip hotels."
      }
  
    ],
    "itinerary": {
      "day1": {
        "theme": "Strip Exploration & Free Activities",
        "plan": [
          {
            "placeName": "Bellagio Fountains",
            "placeDetails": "Free water show with music.",
            "placeImageUrl": "YOUR_IMAGE_URL_HERE",
            "geoCoordinates": {"lat": 36.1146, "lng": -115.1736},
            "ticketPricing": "Free",
            "rating": "4.8",
            "time": "Evening (check show schedule)"
          },
          {
            "placeName": "Walk the Las Vegas Strip",
            "placeDetails": "Explore the hotels, architecture, and atmosphere.",
            "placeImageUrl": "YOUR_IMAGE_URL_HERE",
            "geoCoordinates": {"lat": 36.1186, "lng": -115.1715}, 
            "ticketPricing": "Free",
            "rating": "4.5",
            "time": "Afternoon to Evening"
          }
        ]
      },
      "day2": {
        "theme": "Downtown & Fremont Street Experience",
        "plan": [
          {
            "placeName": "Fremont Street Experience",
            "placeDetails": "Free light show and entertainment in Downtown Las Vegas.",
            "placeImageUrl": "YOUR_IMAGE_URL_HERE",
            "geoCoordinates": {"lat": 36.1699, "lng": -115.1404},
            "ticketPricing": "Free (some optional paid activities)",
            "rating": "4.2",
            "time": "Evening"
          },
          {
            "placeName": "Explore Downtown Las Vegas",
            "placeDetails": "Walk around, find vintage shops and casual eateries.",
            "placeImageUrl": "YOUR_IMAGE_URL_HERE",
            "geoCoordinates": {"lat": 36.16, "lng": -115.14},
            "ticketPricing": "Free",
            "rating": "4.0",
            "time": "Afternoon"
          }
        ]
      },
      "day3": {
        "theme": "Relaxation and Affordable Entertainment",
        "plan": [
          {
            "placeName": "Pool Time (at your hotel)",
            "placeDetails": "Most budget hotels have pools. Relax and enjoy the sun.",
            "placeImageUrl": "YOUR_IMAGE_URL_HERE",
            "geoCoordinates": "Check your hotel's coordinates",
            "ticketPricing": "Free (if included with your stay)",
            "rating": "4.0",
            "time": "Afternoon"
          },
          {
            "placeName": "Free Shows & Street Performers",
            "placeDetails": "Enjoy free entertainment along the Strip.",
            "placeImageUrl": "YOUR_IMAGE_URL_HERE",
            "geoCoordinates": "Various locations on the Strip",
            "ticketPricing": "Free",
            "rating": "4.0",
            "time": "Evening"
          }
        ]
      }
    }
  }
  \`\`\`
  
  Remember to replace the placeholder image URLs, prices, and potentially adjust the geo-coordinates with accurate information before using this plan. You can also add more places and refine the timings to suit your preferences. Consider using a budget-friendly food strategy, like packing some snacks or eating at less expensive restaurants, to keep costs down.`}
        ]
      }
    ]
  });

