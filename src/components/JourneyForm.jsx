import { useState } from "react";
import { toggleDestinationUI } from "../util/helpers";
import { addCoordinateToMap } from "../util/popups";
import addRingToMap from "../util/ring";

import DurationSlider from "./DurationSlider";
import DestinationType from "./DestinationType";
import RoundTripCheckbox from "./RoundTrip";
import Journey from "../journey";
import "./MenuButtons.css";

async function createAndPlotRoute(map, isOneWay, duration, destinationType) {
  // Journey instantiation
  const directionsControl = map.current._directions;
  const origin = directionsControl.getOrigin();
  const journey = new Journey(
    origin.geometry.coordinates,
    isOneWay,
    parseInt(duration, 10),
    destinationType
  );
  await journey.generateJourney();
  console.log(journey);
  
  // Map interfacing
  addCoordinateToMap(map, journey.originPoint, 'Origin');
  addRingToMap(map, journey.contourRing);
  addCoordinateToMap(map, journey.bearingPoint, 'Bearing');
  addCoordinateToMap(map, journey.destinationPoint, 'Destination', journey.destinationPoi.place_name);
  directionsControl.setOrigin(journey.originPoint);
  directionsControl.setDestination(journey.destinationPoint);
  toggleDestinationUI(true);
}

const JourneyForm = ({map}) => {
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

  return (
    <div className="journey-sidebar">
      <div className="journey-inputs">
        <DestinationType value={destinationType} onChange={handleRadio} />
        <DurationSlider value={duration} onChange={handleSlider} /><br/>
        <RoundTripCheckbox value={isOneWay} onChange={handleCheckbox} duration={duration}/>
      </div>
      <br/>
      <button onClick={handleSubmit(map)}>Go on a journey!</button>
    </div>
  )
}

export default JourneyForm;