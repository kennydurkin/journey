import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
// import polygonize from "@turf/polygonize";
// import pointsWithinPolygon from "@turf/points-within-polygon";
import { introAnimation } from "../animations/intro";
import { toggleDestinationUI } from "../util/helpers";
import DirectionsToggle from "./DirectionsToggle";
import JourneyForm from "./JourneyForm";
import MenuButtons from "./MenuButtons";
import './App.css';
import "./DirectionsDiv.css";

const token = import.meta.env.VITE_MAPBOX_KEY;
mapboxgl.accessToken = token;

function App() {
  const isFirstTimeVisitor = false;
  // TODO: -122.2685 for desktop users once media queries start being added
  const initialLon = isFirstTimeVisitor ? -122.11 : -122.3275;
  const initialLat = isFirstTimeVisitor ? 47.36 : 47.5505;
  const initialZoom = isFirstTimeVisitor ? 8.88 : 11.73;
  const initialPitch = 62.50;
  const initialBearing = isFirstTimeVisitor ? -64.50 : 5.00;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [formVisibility, setFormVisibility] = useState(true);
  const [directionsLoaded, setAreDirectionsLoaded] = useState(false);
  const [aboutVisibility, setAboutVisibility] = useState(false);

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

    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    }));

    const directionsControl = new MapboxDirections({
      flyTo: false,
      profile: "mapbox/cycling",
      alternatives: true,
      accessToken: token,
      interactive: false,
      exclude: "ferry",
      controls: {
        profileSwitcher: false
      },
    });
    map.current.addControl(directionsControl, "top-left");
    map.current._directions = directionsControl;
    map.current._directions.on('loading', (e) => {
      console.log('loading fired');
    })
    map.current._directions.on('route', (e) => {
      // Automatically hide the instructions once the "route" event fires
      const selector = ".mapbox-directions-instructions";
      const directionsEl = document.querySelector(selector);
      if (!directionsEl) return;

      directionsEl.classList.add('m-fadeOut');
      directionsEl.classList.add('m-instructions');
      setAreDirectionsLoaded(true);
    });

    toggleDestinationUI(false);

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
      <DirectionsToggle areDirectionsLoaded={directionsLoaded} isAboutVisible={aboutVisibility}/>
      <JourneyForm map={map} isVisible={formVisibility} isAboutVisible={aboutVisibility}/>
      <MenuButtons
        map={map}
        isFormVisible={formVisibility}
        visibilityHook={setFormVisibility}
        isAboutVisible={aboutVisibility}
        aboutHook={setAboutVisibility}
      />
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default App;
