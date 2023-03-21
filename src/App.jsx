import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import './App.css';

// Vite .env file shenanigans
const token = import.meta.env.VITE_MAPBOX_KEY;
mapboxgl.accessToken = token;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lon, setLon] = useState(-122.21);
  const [lat, setLat] = useState(47.59);
  const [zoom, setZoom] = useState(10);
  const [pitch, setPitch] = useState(77);

  useEffect(() => {
    if (map.current) return; // initialize the map only once
  
    // MapboxGL Map object go brrrr
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lon, lat],
      zoom: zoom,
      pitch: pitch,
      bearing: 135,
    });

    map.current.on('style.load', () => {
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.current.setTerrain({'source': 'mapbox-dem', 'exaggeration': 5});
    });

    // Add some Mapbox controls for the user for freeee
    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    }));
    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    // Let's get that directions box up and running
    map.current.addControl(
      new MapboxDirections({
        flyTo: false,
        profile: "mapbox/cycling",
        alternatives: true,
        accessToken: token,
        controls: {
          profileSwitcher: false
        },
        exclude: "ferry",
      }),
      "bottom-right"
    );
  });

  // On map move, update the state of the app to have fresh lat/lon/zoom values
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLon(map.current.getCenter().lng.toFixed(2));
      setLat(map.current.getCenter().lat.toFixed(2));
      setZoom(map.current.getZoom().toFixed(2));
      setPitch(map.current.getPitch().toFixed(2));
    });
  })

  return (
    <div className="App">
      <div className="sidebar">
        Longitude: {lon} | Latitude: {lat} | Zoom: {zoom} | Pitch: {pitch}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default App;
