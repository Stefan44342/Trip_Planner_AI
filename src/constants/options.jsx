export const SelectTravellersList=[
    {
        id:1,
        title:"Just me",
        description:"Solo adventures where only your footprints matter",
        icon:"🧭",
        people:1
    },
    {
        id:2,
        title:"Couple",
        description:"Romantic getaways to kindle the spark",
        icon:"💑",
        people:2
    },
    {
        id:3,
        title:"Family",
        description:"Memory-making trips for the whole clan",
        icon:"👨‍👩‍👧‍👦",
        people:"3 to 5 people"
    },
    {
        id:4,
        title:"Friends",
        description:"Squad adventures that strengthen bonds",
        icon:"🎭",
        people:"5 to 10 people"
    }
]

export const SelectBudgetOptions=[
    {
        id:1,
        title:"Cheap",
        description:"Treasure hunting on a shoestring budget",
        icon:"💰",
    },
    {
        id:2,
        title:"Moderate",
        description:"Comfort without emptying your wallet",
        icon:"⚖️",
    },
    {
        id:3,
        title:"Expensive",
        description:"Luxury experiences worth every penny",
        icon:"💎",
    }
]

export const AI_PROMPT="Generate travel plan for location: {location}, for {totalDays} days, for {traveller} people with a {budget} budget, starting on {travelDate}.Give me Hotels options list with Hotel Name, Hotel address, For hotels, please provide an approximate price range per night (e.g., '$45-$65' or '$80-$120') based on typical budget rates, don't say 'Check online for current rates', hotel image url, geo coordinates, rating, description and suggest itinerary with Place Name, Place details, Place Image URL, Geo Coordinates, ticket Pricing, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format."