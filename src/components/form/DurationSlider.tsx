type onChangeEvent = (e: React.FormEvent<HTMLInputElement>) => void;
interface FormComponentProps {
    onChange: onChangeEvent,
    value: string
}

const DurationSlider = ({onChange, value}: FormComponentProps) => {
    return (
        <label>
            <input
                type="range"
                value={value}
                onChange={onChange}
                min="15"
                max="60"
            />
            &nbsp;~{value} minute ride
        </label>
    );
}

export default DurationSlider;