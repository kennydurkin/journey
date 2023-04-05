const RoundTripCheckbox = ({label, value, onChange}) => {
    return (
        <label>
            <input 
                type="checkbox"
                checked={value}
                onChange={onChange}
            />
            {label}
        </label>
    )
}

export default RoundTripCheckbox;