import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function LocationAutocomplete({ onSelect }) {
  const geocoderContainerRef = useRef(null);

  useEffect(() => {
    if (!geocoderContainerRef.current) return;

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      types: 'place',
      placeholder: 'Enter destination',
      marker: false
    });

    geocoder.addTo(geocoderContainerRef.current);

    geocoder.on('result', (e) => {
      if (onSelect) {
        onSelect({
          description: e.result.place_name,
          location: {
            lat: e.result.center[1],
            lng: e.result.center[0]
          },
          placeData: e.result
        });
      }
    });

    return () => {
      geocoder.onRemove();
    };
  }, [onSelect]);

  return (
    <div ref={geocoderContainerRef} className="w-full"></div>
  );
}

export default LocationAutocomplete;