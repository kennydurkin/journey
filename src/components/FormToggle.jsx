const FormToggle = ({isFormVisible, visibilityHook}) => {
    return (
        <button className="menu-button" onClick={() => visibilityHook(!isFormVisible)}>
            <svg viewBox="-48 0 200 90" width="50" height="50">
                <rect y="00" width="100" height="20" rx="8" fill="#3291c1"/>
                <rect y="30" width="100" height="20" rx="8" fill="#3291c1"/>
                <rect y="60" width="100" height="20" rx="8" fill="#3291c1"/>
            </svg>
        </button>
    )
}

export default FormToggle;