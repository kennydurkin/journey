import { useState, useEffect } from "react";
import "./Toggle.css";

const directionsSelector = ".mapbox-directions-instructions";
const handleIfElementExists = (cb: (el: HTMLElement) => void) => {
    const directionsElement: HTMLElement|null = document.querySelector(directionsSelector);
    directionsElement && cb(directionsElement);
}
const toggleFadeClasses = (el: HTMLElement) => {
    el.classList.toggle("m-fadeOut");
    el.classList.toggle("m-fadeIn");
}

interface DirectionsToggleProps {
    areDirectionsLoaded: boolean,
    isAboutVisible: boolean
}

const DirectionsToggle = ({areDirectionsLoaded, isAboutVisible}: DirectionsToggleProps) => {
    const [toggleIsHidingDirections, setShouldToggleHideDirections] = useState(true);
    const handleClick = () => handleIfElementExists((directionsEl: HTMLElement) => {
        setShouldToggleHideDirections(!toggleIsHidingDirections);
        // Edge case that can happen when an alternate route is selected
        // The Mapbox Directions plugin creates a fresh DOM element so we have to re-add our initial classes
        if (
            !directionsEl.classList.contains("m-fadeIn") &&
            !directionsEl.classList.contains("m-fadeOut")
        ) {
            directionsEl.classList.add("m-fadeOut");
            directionsEl.classList.add("m-instructions");
            return;
        }
    
        toggleFadeClasses(directionsEl);
    });

    // Tries to monitor the AboutToggle state and react to it by appropriately hiding/showing the directions element
    useEffect(() => {
        handleIfElementExists((directionsEl: HTMLElement) => {
            if (isAboutVisible) {
                if (directionsEl.classList.contains("m-fadeOut")) return;
                toggleFadeClasses(directionsEl);
            } else if (areDirectionsLoaded && !toggleIsHidingDirections) {
                if (directionsEl.classList.contains("m-fadeIn")) return;
                toggleFadeClasses(directionsEl);
            }
        })
    }, [isAboutVisible]);


    const visibilityClass = areDirectionsLoaded ? 'display-block' : '';
    return (
        <button
            className={`directions-toggle ${visibilityClass} ${toggleIsHidingDirections ? "" : "directions-icon-rotate"}`}
            onClick={handleClick}
        >➜</button>
    )
}

export default DirectionsToggle;