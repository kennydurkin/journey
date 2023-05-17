import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { introAnimation } from "./animations/intro";
import DirectionsPlugin, { initializeDirectionsPlugin } from "./components/directions/Plugin";
import JourneyForm from "./components/form/JourneyForm";
import MenuButtons from "./components/buttons/Menu";
import './App.css';

const token = import.meta.env.VITE_MAPBOX_KEY;
mapboxgl.accessToken = token;

function App() {
  const isFirstTimeVisitor = localStorage.getItem("hasVisited") ? false : true;
  // TODO: -122.2685 for desktop users once media queries start being added
  const initialLon = isFirstTimeVisitor ? -122.11 : -122.3275;
  const initialLat = isFirstTimeVisitor ? 47.36 : 47.5505;
  const initialZoom = isFirstTimeVisitor ? 2.58 : 11.73;
  const initialPitch = isFirstTimeVisitor ? 70.00 : 62.50;
  const initialBearing = isFirstTimeVisitor ? -64.50 : 5.00;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [formVisibility, setFormVisibility] = useState(true);
  const [aboutVisibility, setAboutVisibility] = useState(false);
  const [directionsLoaded, setAreDirectionsLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return; // initialize the map only once
  
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initialLon, initialLat],
      zoom: initialZoom,
      pitch: initialPitch,
      bearing: initialBearing,
      bearingSnap: 0
    });

    // map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.GeolocateControl());
    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    }));

    // Lots of initialization specific to the directions plugin
    // Kept in the JSX component file for better separation of concerns
    initializeDirectionsPlugin(map, setAreDirectionsLoaded);

    map.current.on('load', () => {
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.current.setTerrain({'source': 'mapbox-dem', 'exaggeration': 4});

      if (isFirstTimeVisitor) {
        introAnimation(map);
      }
    });
  });

  return (
    <div className="App">
      <div ref={mapContainer} className="map-container" />
      <DirectionsPlugin
        directionsLoaded={directionsLoaded}
        isAboutVisible={aboutVisibility}
      />
      <JourneyForm
        map={map}
        isVisible={formVisibility}
        isAboutVisible={aboutVisibility}
      />
      <MenuButtons
        map={map}
        isFormVisible={formVisibility}
        visibilityHook={setFormVisibility}
        isAboutVisible={aboutVisibility}
        aboutHook={setAboutVisibility}
      />
    </div>
  )
}

export default App;
