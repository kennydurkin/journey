const DirectionsToggle = () => {
    const handleClick = () => {
        const selector = ".directions-control-directions";
        const directionsEl = document.querySelector(selector);
        if (!directionsEl) return;

        // Edge case that can happen when an alternate route is selected
        if (
            !directionsEl.classList.contains("m-fadeIn") &&
            !directionsEl.classList.contains("m-fadeOut")
        ) {
            directionsEl.classList.add("m-fadeOut");
            return;
        }

        directionsEl.classList.toggle("m-fadeOut");
        directionsEl.classList.toggle("m-fadeIn");
    }

    return (
        <button className="menu-button" onClick={handleClick}>⤴️</button>
    )
}

export default DirectionsToggle;