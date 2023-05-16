import mapboxgl from "mapbox-gl";
import { toggleDestinationUI, initializePluginPosition } from "../../util/helpers";
import DirectionsToggle from "./Toggle";
import "./Plugin.css";

export function initializeDirectionsPlugin(map, setAreDirectionsLoaded) {
    const directionsControl = new MapboxDirections({
        flyTo: false,
        profile: "mapbox/cycling",
        alternatives: true,
        accessToken: mapboxgl.accessToken,
        interactive: false,
        exclude: "ferry",
        controls: {
        profileSwitcher: false
        },
    });
    map.current.addControl(directionsControl, "bottom-left");
    map.current._directions = directionsControl;

    /**
     * Every time a route is calculated, hide the instructions so it doesn't obscure the page for mobile users
     * A stateful toggle is presented to the user instead that will be in charge of displaying the instructions.
     */
    map.current._directions.on('route', (e) => {
        // Automatically hide the instructions once the "route" event fires
        const selector = ".mapbox-directions-instructions";
        const directionsEl = document.querySelector(selector);
        if (!directionsEl) return;

        directionsEl.classList.add('m-fadeOut');
        directionsEl.classList.add('m-instructions');
        setAreDirectionsLoaded(true);
    });

    /**
     * Make sure that when an event is cleared that the custom directions toggle is hidden
     */
    map.current._directions.on('clear', (e) => {
        setAreDirectionsLoaded(false);
    });

    /**
     * When the Directions plugin successfully sets a destination, it fits the route within a rectangular boundary.
     * Sadly, the plugin allows pitch to default back to 0 degrees when it calls the "fitBounds" method to do this.
     * Since an angulated pitch is a particular highlight of my app, I must override the method to prevent this.
     *
     * This is one of the glaring reasons why this app must stop leaning on the Directions plugin in the future.
     */
    mapboxgl.Map.prototype.originalFitBounds = mapboxgl.Map.prototype.fitBounds;
    // Basing this off the definition here https://docs.mapbox.com/mapbox-gl-js/api/map/#map#fitbounds
    mapboxgl.Map.prototype.fitBounds = function(bounds, options = {}, eventData = {}) {
        const myOptions = {...options, pitch: this.getPitch()};
        this.originalFitBounds(bounds, myOptions, eventData);
    };

    // Lets the plugin live toward the bottom of the page on first use, next to the input form
    initializePluginPosition();
    // Hides the destination input field for now since it will be populated automatically
    toggleDestinationUI(false);
}

export default function DirectionsPlugin({directionsLoaded, isAboutVisible}) {
    // This parent component only appends behavior and styles to the already-loaded Directions plugin HTML
    // The custom toggle is its own stateful React component that is separate from the Directions plugin.
    return (
        <DirectionsToggle areDirectionsLoaded={directionsLoaded} isAboutVisible={isAboutVisible}/>
    );
}