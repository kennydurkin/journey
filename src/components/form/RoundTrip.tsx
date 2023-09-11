import "./RoundTrip.css";

type onChangeEvent = (e: React.FormEvent<HTMLInputElement>) => void;
interface FormComponentProps {
    onChange: onChangeEvent,
    value: boolean
}

interface RoundTripProps extends FormComponentProps {
    duration: string
}

const toggleText = (duration: string, isOneWay: boolean) => {
    const tripType = isOneWay ? 'One way' : 'Round trip';
    const segmentDuration = isOneWay ? duration : Math.ceil(Number(duration) / 2);
    return `${tripType} (${segmentDuration}min each way)`;
}

const RoundTripCheckbox = ({value, onChange, duration}: RoundTripProps) => {
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