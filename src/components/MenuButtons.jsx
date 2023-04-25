import "./MenuButtons.css";
import RotateToggle from "./RotateToggle";
import FormToggle from "./FormToggle";
import AboutButton from "./AboutButton";

const MenuButtons = ({map, isFormVisible, visibilityHook, isAboutVisible, aboutHook}) => {
    return (
        <div className="menu-buttons">
            <FormToggle isFormVisible={isFormVisible} visibilityHook={visibilityHook}/>
            <RotateToggle map={map}/>
            <AboutButton isAboutVisible={isAboutVisible} aboutHook={aboutHook} />
        </div>
    )
}

export default MenuButtons