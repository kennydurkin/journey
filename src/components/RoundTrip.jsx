import "./RoundTrip.css";

const toggleText = (duration, isOneWay) => {
    const tripType = isOneWay ? 'One way' : 'Round trip'
    const segmentDuration = isOneWay ? duration : Math.ceil(duration / 2);
    return `${tripType} (${segmentDuration}min to destination)`;
}

const RoundTripCheckbox = ({value, onChange, duration}) => {
    return (
        <div className="toggle">
            <input 
                type="checkbox"
                checked={value}
                onChange={onChange}
                className="toggle-input"
                id="one-way-input"
            />
            <label className="toggle-label" htmlFor="one-way-input"/>
            <p className="toggle-text">&nbsp;{toggleText(duration, value)}</p>
        </div>
    )
}

export default RoundTripCheckbox;