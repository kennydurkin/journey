import { useState } from "react";
import { toggleDestinationUI } from "../util/helpers";
import { addCoordinateToMap } from "../util/popups";
import addRingToMap from "../util/ring";

import DurationSlider from "./DurationSlider";
import DestinationType from "./DestinationType";
import RoundTripCheckbox from "./RoundTrip";
import Journey from "../journey";
import "./JourneyForm.css";

async function createAndPlotRoute(map, isOneWay, duration, destinationType) {
  const journey = await createRoute(map, isOneWay, duration, destinationType);
  plotRoute(map, journey);
}

async function createRoute(map, isOneWay, duration, destinationType) {
  // Journey instantiation
  const origin = map.current._directions.getOrigin();
  const journey = new Journey(
    origin.geometry.coordinates,
    isOneWay,
    parseInt(duration, 10),
    destinationType
  );
  await journey.generateJourney();

  if (import.meta.env.DEV) {
    console.log(journey);
  }

  return journey;
}

function plotRoute(map, journey) {
  if (import.meta.env.DEV) {
    addCoordinateToMap(map, journey.originPoint, 'Origin Point');
    addCoordinateToMap(map, journey.bearingPoint, 'Bearing Point');
  }
  
  // Place name and full mailing address
  const place = journey.destinationPoi.place_name;
  // First entry from the array of context values
  const neighborhood = journey.destinationPoi.context[0].text;
  // Keep the name and street address, replace whitespace with '+' for URL input
  const mapsQuery = place.split(',').slice(0,2).join(',').replaceAll(' ','+');
  const mapsLink = `https://www.google.com/maps/search/${mapsQuery}`;
  // Keeps the name only
  const destinationShortName = place.split(',')[0];

  addRingToMap(map, journey.contourRing);
  addCoordinateToMap(map, journey.destinationPoint, destinationShortName, neighborhood, mapsLink);
  map.current._directions.setDestination(journey.destinationPoint);
  toggleDestinationUI(true);
}

const JourneyForm = ({map, isVisible, isAboutVisible}) => {
  const [isOneWay, setIsOneWay] = useState(true);
  const handleCheckbox = () => { setIsOneWay(!isOneWay)};
  const [duration, setDuration] = useState(30);
  const handleSlider = (event) => { setDuration(event.target.value); };
  const [destinationType, setDestinationType] = useState("coffee");
  const handleRadio = (event) => { setDestinationType(event.target.value); };
  const handleSubmit = (map) => (event) => {
    if(!Object.keys(map.current._directions.getOrigin()).length) return;

    // Clean up any layers and popups we may have had on the map
    map.current.getLayer('ring-background') && map.current.removeLayer('ring-background');
    map.current.getLayer('ring-dashes') && map.current.removeLayer('ring-dashes');
    map.current.getSource('ring-coords') && map.current.removeSource('ring-coords');
    document.querySelectorAll('.mapboxgl-popup').forEach((el) => { el.remove() });

    createAndPlotRoute(map, isOneWay, duration, destinationType);
  }
  const visibilityClass = isVisible && !isAboutVisible ? '' : 'hide-journey-form';
  return (
    <div className={`journey-sidebar ${visibilityClass}`}>
      <div className="journey-inputs">
        <DestinationType value={destinationType} onChange={handleRadio} />
        <DurationSlider value={duration} onChange={handleSlider} /><br/>
        <RoundTripCheckbox value={isOneWay} onChange={handleCheckbox} duration={duration}/>
      </div>
      <br/>
      <button className="journey-button" onClick={handleSubmit(map)}><p>Go on a journey!</p></button>
    </div>
  )
}

export default JourneyForm;