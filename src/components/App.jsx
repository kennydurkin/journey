import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
// import polygonize from "@turf/polygonize";
// import pointsWithinPolygon from "@turf/points-within-polygon";
import { introAnimation } from "../animations/intro";
import { toggleDestinationUI } from "../util/helpers";
import JourneyForm from "./JourneyForm";
import MenuButtons from "./MenuButtons";
import './App.css';

const token = import.meta.env.VITE_MAPBOX_KEY;
mapboxgl.accessToken = token;

function App() {
  const isFirstTimeVisitor = false;
  const initialLon = isFirstTimeVisitor ? -122.11 : -122.2685;
  const initialLat = isFirstTimeVisitor ? 47.36 : 47.5505;
  const initialZoom = isFirstTimeVisitor ? 8.88 : 11.73;
  const initialPitch = 62.50;
  const initialBearing = isFirstTimeVisitor ? -64.50 : 5.00;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lon, setLon] = useState(initialLon);
  const [lat, setLat] = useState(initialLat);
  const [zoom, setZoom] = useState(initialZoom);
  const [pitch, setPitch] = useState(initialPitch);
  const [bearing, setBearing] = useState(initialBearing);
  const [formVisibility, setFormVisibility] = useState(true);

  useEffect(() => {
    if (map.current) return; // initialize the map only once
  
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lon, lat],
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
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
    map.current._directions.on('route', (e) => {
      // Automatically hide the instructions once the "route" event fires
      const selector = ".directions-control-directions";
      const directionsEl = document.querySelector(selector);
      if (!directionsEl) return;
      document.querySelector(selector).classList.add('m-fadeOut');
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

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLon(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
      setPitch(map.current.getPitch().toFixed(2));
      setBearing(map.current.getBearing().toFixed(2));
    });
  })

  return (
    <div className="App">
      {/* <div className="sidebar">
        <div>Longitude: {lon} | Latitude: {lat}</div>
        <div>Zoom: {zoom} | Pitch: {pitch} | Bearing: {bearing}</div>
      </div> */}
      <JourneyForm map={map} isVisible={formVisibility}/>
      <MenuButtons isFormVisible={formVisibility} visibilityHook={setFormVisibility}/>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default App;
