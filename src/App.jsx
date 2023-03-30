import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import './App.css';
import fetchIsochrone from "./fetch-isochrone";
import fetchGeocoding from "./fetch-geocoding";
import bbox from "@turf/bbox";
import circle from "@turf/circle";
// import pointsWithinPolygon from "@turf/points-within-polygon";
// import polygonize from "@turf/polygonize";

const token = import.meta.env.VITE_MAPBOX_KEY;
mapboxgl.accessToken = token;

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function zoomToCity(map) {
  await timeout(3000);
  map.current.flyTo({
    center: [-122.2685, 47.5505],
    zoom: 11.73,
    curve: 0.5,
  });
}

async function rotateToBearing(map) {
  await timeout(7000);
  map.current.rotateTo(5, {
    duration: 2000,
    easing: (t) => t,
  });
}

async function jumpToCity(map) {
  await timeout(2000);
  map.current.jumpTo({
    center: [-122.2685, 47.5505],
    zoom: 11.73,
    curve: 0.5,
    bearing: 5
  });
}

async function doCameraAnimations(map) {
  const firstTimeVisitor = true;
  if (firstTimeVisitor) {
    await Promise.all([
      zoomToCity(map),
      rotateToBearing(map),
      timeout(10000)
    ]);
  } else {
    // Users who have the cookie will execute this code instead
    // On second thought, should probably just have them init the map zoomed in and forget the jumpTo call
    await jumpToCity(map);
    await timeout(5000);
  }
}

function isRoundTrip() {
  return false; // TODO: get this from user input
}

function getUserDuration(isRoundTrip = false) {
  let duration = 30; // minutes, TODO: get this from user input
  if (isRoundTrip) duration /= 2;
  return Math.ceil(duration);
}

function getUserOrigin() {
  return [-122.3178, 47.6150]; // TODO: get this from user input
}

async function getIso(originCoordinates) {
  const testCoordinates = originCoordinates;
  const testDuration = getUserDuration(isRoundTrip());
  const results = await fetchIsochrone(
    testCoordinates,
    testDuration
  );
  return results.features;
}

function pickCoordinate(contours) {
  console.debug('The contours returned', contours);
  const targetContour = contours[0];
  const ringCoords = targetContour.geometry.coordinates;


  const randomIndex = Math.floor(Math.random() * ringCoords.length-1);
  let coordinate;
  let candidate = ringCoords[randomIndex];

  // while (!coordinate) {
  //    const randomIndex = Math.floor(Math.random() * ringCoords.length-1);
  //    verifyCoordinate(candidate) && coordinate = candidate
  // }

  // Remove this line once the above is implemented
  coordinate = candidate;
  return coordinate;
}

/**
 * TODO: implement two checks:
 *    - is greater than X meters away from next smallest linestring contour
 *    - square/circle around candidate points consists of at least Y% points within the target contour
 * @param {number[]} coordinate 
 */
function verifyCoordinate(coordinate) {
  return;
}

function addCoordinateToMap(map, randomCoordinate, isOrigin = false) {
  // const popUps = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */
  // if (popUps[0]) popUps[0].remove();

  const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(randomCoordinate)
      .setHTML(`<h3>${isOrigin ? 'Origin' : 'Chosen'} Point</h3><i>${randomCoordinate.join(',')}</i>`)
      .addTo(map.current);
}

function getUserQuery() {
  return 'coffee';
}

/**
 * @param {number[]} coordinate 
 * @returns number
 */
async function getGeocoding(coordinate) {
  const testQuery = getUserQuery();
  const testBbox = bbox(
    circle(coordinate, 1, {
      units:'miles'
    })
  );
  console.debug(`Bbox debugging: (${testBbox.join(',')})`);

  const testProximity = coordinate;
  const results = await fetchGeocoding(
    testQuery,
    testBbox,
    testProximity,
  );
  return results.features;
}

function pickAddress(pointsOfInterest) {
  // Step one: polygonize the contour LineStrings
  // Step two: use `mask` to treat the smaller LineString as a hole in the target LineString
  // Step three: filter the array to only those that pass pointsWithinPolygon
  // Step four: pick one at random if there are multiple left over
  const filtered = pointsOfInterest.filter(poi=> {
    return true;
  });

  // If there were none that survived the filter....we can just return the first result for now
  if (!filtered.length) {
    return pointsOfInterest[0];
  }

  const randomIndex = Math.floor(Math.random() * (filtered.length - 1));
  console.log('Randomly selecting element #', randomIndex, 'of this array', filtered);
  return filtered[randomIndex];
}

function addPointsOfInterestToMap(map, pointsOfInterest) {
  pointsOfInterest.forEach((poi) => {
    const coords = poi.geometry.coordinates;
    const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(coords)
        .setHTML(`<h3>${poi.text}</h3><i>${coords.join(',')}</i>`)
        .addTo(map.current);
  })
}

async function doBehavior(map) {
  const directions = map.current._directions;
  // const origin = directions.getOrigin().geometry.coordinates;
  const origin = getUserOrigin();
  console.debug('Origin point', origin); // LngLatLike
  directions.setOrigin(getUserOrigin());
  addCoordinateToMap(map, origin, true);

  const contours = await getIso(origin);
  const randomCoordinate = pickCoordinate(contours);
  addCoordinateToMap(map, randomCoordinate);

  const pointsOfInterest = await getGeocoding(randomCoordinate);
  console.debug('Geocoding results', pointsOfInterest);
  const randomAddress = pickAddress(pointsOfInterest);
  console.log('Selected address', randomAddress);
  addPointsOfInterestToMap(map, [randomAddress]);

  directions.setDestination(randomAddress.geometry.coordinates);
}

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lon, setLon] = useState(-122.11);
  const [lat, setLat] = useState(47.36);
  const [zoom, setZoom] = useState(8.88);
  const [pitch, setPitch] = useState(62.50);
  const [bearing, setBearing] = useState(-64.50);

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

    map.current.on('load', () => {
      map.current.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.current.setTerrain({'source': 'mapbox-dem', 'exaggeration': 4});

      doCameraAnimations(map).then(() => {
        doBehavior(map);
      });
    });

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
        Longitude: {lon} | Latitude: {lat}<br/>
        Zoom: {zoom} | Pitch: {pitch} | Bearing: {bearing}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default App;
