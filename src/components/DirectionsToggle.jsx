import "./DirectionsToggle.css";
const DirectionsToggle = ({areDirectionsVisible}) => {
    const handleClick = () => {
        const selector = ".mapbox-directions-instructions";
        const directionsEl = document.querySelector(selector);
        if (!directionsEl) return;

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

        directionsEl.classList.toggle("m-fadeOut");
        directionsEl.classList.toggle("m-fadeIn");
    }

    return (
        <button
            className={`directions-toggle ${areDirectionsVisible ? 'display-block' : ''}`}
            onClick={handleClick}
        >⤵️</button>
    )
}

export default DirectionsToggle;