import "./AboutButton.css";

interface AboutButtonProps {
    isAboutVisible: boolean,
    aboutHook: React.Dispatch<React.SetStateAction<boolean>>
}

const AboutPopup = () => {
    const isMobile = true;
    const pitchText = isMobile ? "press two fingers down and move them up or down" : "right-click and drag the map upwards or downwards";
    return (
        <div className="about-popup">
            <p>Journey is a small side project I made for cyclists like me who want to enjoy a local bike ride without spending time deciding where to go.</p>
            <br/>
            <p>Add your starting place, destination type, time preferences, and you're on your way.&nbsp;And remember: it's not about the destination!</p>
            <br/>
            <p>Feel free to check out the source code <a target="_blank" href="https://github.com/kennydurkin/journey">over on Github</a>.👋🏼</p>
            <br/>
            <p>Hint: Journey will also tell you about elevation gain across your route.&nbsp;While exploring, {pitchText} to get a sense for terrain.</p>
        </div>
    )
}

const AboutButton = ({isAboutVisible, aboutHook}: AboutButtonProps) => {
    const handleClick = () => {
        aboutHook(!isAboutVisible);
    }

    return (
        <div>
            <button className="menu-button" onClick={handleClick}>ℹ️</button>
            {isAboutVisible && <AboutPopup/>}
        </div>
    )
}

export default AboutButton;