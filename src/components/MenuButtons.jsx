import "./MenuButtons.css";
import DirectionsToggle from "./DirectionsToggle";
import FormToggle from "./FormToggle";

const MenuButtons = ({isFormVisible, visibilityHook}) => {
    return (
        <div className="menu-buttons">
            <DirectionsToggle/>
            <FormToggle isFormVisible={isFormVisible} visibilityHook={visibilityHook} />
        </div>
    )
}

export default MenuButtons