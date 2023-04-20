import "./MenuButtons.css";
import DirectionsToggle from "./DirectionsToggle";
import RotateToggle from "./RotateToggle";
import FormToggle from "./FormToggle";
import AboutButton from "./AboutButton";

const MenuButtons = ({map, isFormVisible, visibilityHook}) => {
    return (
        <div className="menu-buttons">
            <FormToggle isFormVisible={isFormVisible} visibilityHook={visibilityHook} />
            <DirectionsToggle/>
            <RotateToggle map={map}/>
            <AboutButton formVisibilityHook={visibilityHook}/>
        </div>
    )
}

export default MenuButtons