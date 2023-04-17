const FormToggle = ({isFormVisible, visibilityHook}) => {
    return (
        <button className="menu-button" onClick={() => visibilityHook(!isFormVisible)}>🌟</button>
    )
}

export default FormToggle;