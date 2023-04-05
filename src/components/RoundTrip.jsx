const RoundTripCheckbox = ({value, onChange}) => {
    return (
        <label>
            <input 
                type="checkbox"
                checked={value}
                onChange={onChange}
            />
            One way trip?
        </label>
    )
}

export default RoundTripCheckbox;