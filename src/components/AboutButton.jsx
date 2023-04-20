import { useState } from "react"
import "./AboutButton.css";

const AboutPopup = () => {
    return (
        <div className="about-popup">
            <p>Journey is a small side project I made for cyclists like me who want to enjoy a local bike ride without having to spend lots of time deciding where to go.</p>
            <br/>
            <p>Simply add your starting point, destination type, and time preferences, and you're on your way.&nbsp;While you're out there, remember: it's not about the destination!</p>
            <br/>
            <p>Feel free to check out the source code <a href="https://github.com/kennydurkin/journey">over on Github</a>.👋🏼</p>
        </div>
    )
}

const AboutButton = ({formVisibilityHook}) => {
    const [isAboutShowing, setShowAbout] = useState(false);
    const handleClick = () => {
        setShowAbout(!isAboutShowing);
        formVisibilityHook(isAboutShowing);
    }

    return (
        <div>
            <button className="menu-button" onClick={handleClick}>ℹ️</button>
            {isAboutShowing && <AboutPopup/>}
        </div>
    )
}

export default AboutButton;