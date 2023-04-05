import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
// import polygonize from "@turf/polygonize";
// import pointsWithinPolygon from "@turf/points-within-polygon";
import { introAnimation } from "../animations/intro";
import RoundTripCheckbox from "./RoundTrip";
import Journey from "../journey";
import './App.css';

const token = import.meta.env.VITE_MAPBOX_KEY;
mapboxgl.accessToken = token;

function getUserDuration(isRoundTrip = false) {
  return 30;
}

function getUserOrigin() {
  return [-122.3178, 47.6150]; // TODO: get this from user input
}

function getUserQuery() {
  return 'coffee';
}

function addCoordinateToMap(map, randomCoordinate, descriptor) {
  const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(randomCoordinate)
      .setHTML(`<h3>${descriptor} Point</h3><i>${randomCoordinate.join(',')}</i>`)
      .addTo(map.current);
}

// Useful method for debugging nearby locations
// function addPointsOfInterestToMap(map, pointsOfInterest) {
//   pointsOfInterest.forEach((poi) => {
//     const coords = poi.geometry.coordinates;
//     const popup = new mapboxgl.Popup({ closeOnClick: false })
//         .setLngLat(coords)
//         .setHTML(`<h3>${poi.text}</h3><i>${coords.join(',')}</i>`)
//         .addTo(map.current);
//   })
// }

async function createAndPlotRoute(map, isOneWay) {
  // Journey instantiation
  const journey = new Journey(
    getUserOrigin(),
    isOneWay,
    getUserDuration(),
    getUserQuery()
  );
  await journey.generateJourney();
  console.log(journey);
  
  // Map interfacing
  addCoordinateToMap(map, journey.originPoint, 'Origin');
  addCoordinateToMap(map, journey.bearingPoint, 'Bearing');
  addCoordinateToMap(map, journey.destinationPoint, 'Destination');
  map.current._directions.setOrigin(journey.originPoint);
  map.current._directions.setDestination(journey.destinationPoint);
}

function App() {
  const [isOneWay, setIsOneWay] = useState(true);
  const handleCheckbox = () => { setIsOneWay(!isOneWay)};

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

    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    }));
    map.current.addControl(new mapboxgl.FullscreenControl());

    const directionsControl = new MapboxDirections({
      flyTo: false,
      profile: "mapbox/cycling",
      alternatives: true,
      accessToken: token,
      interactive: false,
      controls: {
        profileSwitcher: false
      },
      // exclude: "ferry",
    });
    map.current.addControl(directionsControl, "top-left");
    map.current._directions = directionsControl;

    map.current.on('load', () => {
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.current.setTerrain({'source': 'mapbox-dem', 'exaggeration': 4});

      if (isFirstTimeVisitor) {
        introAnimation(map).then(() => {
          createAndPlotRoute(map);
        });
      } else {
        // timeout(2000).then(() => {

          // createAndPlotRoute(map);
        // });
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
      <div className="sidebar">
        <div>Longitude: {lon} | Latitude: {lat}</div>
        <div>Zoom: {zoom} | Pitch: {pitch} | Bearing: {bearing}</div>
        <div className="journey-sidebar">
          <div className="journey-inputs">
            <RoundTripCheckbox label=" One way trip?" value={isOneWay} onChange={handleCheckbox}/>
          </div>
          <button onClick={() => {
            createAndPlotRoute(map, isOneWay);
          }}>
            Click me!!
          </button>
        </div>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default App;
