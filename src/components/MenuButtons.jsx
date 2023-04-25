import "./MenuButtons.css";
import RotateToggle from "./RotateToggle";
import FormToggle from "./FormToggle";
import AboutButton from "./AboutButton";

const MenuButtons = ({map, isFormVisible, visibilityHook}) => {
    return (
        <div className="menu-buttons">
            <FormToggle isFormVisible={isFormVisible} visibilityHook={visibilityHook} />
            <RotateToggle map={map}/>
            <AboutButton formVisibilityHook={visibilityHook}/>
        </div>
    )
}

export default MenuButtons