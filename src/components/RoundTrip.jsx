import "./RoundTrip.css";

const RoundTripCheckbox = ({value, onChange}) => {
    return (
        <div className="toggle">
            <input 
                type="checkbox"
                checked={value}
                onChange={onChange}
                className="toggle-input"
                id="one-way-input"
            />
            <label className="toggle-label" for="one-way-input"/>
            <p className="toggle-text">&nbsp;{ value ? "One way trip" : "Round trip"}</p>
        </div>
    )
}

export default RoundTripCheckbox;