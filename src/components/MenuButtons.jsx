import "./MenuButtons.css";
import DirectionsToggle from "./DirectionsToggle";
import RotateToggle from "./RotateToggle";
import FormToggle from "./FormToggle";

const MenuButtons = ({map, isFormVisible, visibilityHook}) => {
    return (
        <div className="menu-buttons">
            <DirectionsToggle/>
            <FormToggle isFormVisible={isFormVisible} visibilityHook={visibilityHook} />
            <RotateToggle map={map}/>
        </div>
    )
}

export default MenuButtons