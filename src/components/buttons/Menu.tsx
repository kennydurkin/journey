import "./Menu.css";
import RotateToggle from "./RotateToggle";
import FormToggle from "./FormToggle";
import AboutButton from "./AboutButton";
import type { Map } from "mapbox-gl";

interface MenuButtonsProps {
    map: React.RefObject<Map>,
    isFormVisible: boolean,
    visibilityHook: React.Dispatch<React.SetStateAction<boolean>>,
    isAboutVisible: boolean,
    aboutHook: React.Dispatch<React.SetStateAction<boolean>>,
}

const MenuButtons = ({map, isFormVisible, visibilityHook, isAboutVisible, aboutHook}: MenuButtonsProps) => {
    return (
        <div className="menu-buttons">
            <FormToggle isFormVisible={isFormVisible} visibilityHook={visibilityHook}/>
            <RotateToggle map={map}/>
            <AboutButton isAboutVisible={isAboutVisible} aboutHook={aboutHook} />
        </div>
    )
}

export default MenuButtons