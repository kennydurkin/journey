import "./DirectionsToggle.css";

const DirectionsToggle = () => {
    const handleClick = () => {
        const selector = ".directions-control-directions";
        const directionsEl = document.querySelector(selector);
        if (!directionsEl) return;

        const opacity = directionsEl.style.opacity;
        directionsEl.style.opacity = Number(opacity) ? 0 : 1;
    }

    return (
        <button className="directions-toggle" onClick={handleClick}>⤴️</button>
    )
}

export default DirectionsToggle