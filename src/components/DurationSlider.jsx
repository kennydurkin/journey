const DurationSlider = ({onChange, value}) => {
    return (
        <label>
            <input
                type="range"
                value={value}
                onChange={onChange}
                min="15"
                max="60"
            />
            &nbsp;{value} minute ride
        </label>
    );
}

export default DurationSlider;