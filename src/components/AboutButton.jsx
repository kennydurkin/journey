import "./AboutButton.css";

const AboutPopup = () => {
    return (
        <div className="about-popup">
            <p>Journey is a small side project I made for cyclists like me who want to enjoy a local bike ride without spending time deciding where to go.</p>
            <br/>
            <p>Add your starting point, destination type, time preferences, and you're on your way.&nbsp;But remember: it's not about the destination!</p>
            <br/>
            <p>Feel free to check out the source code <a target="_blank" href="https://github.com/kennydurkin/journey">over on Github</a>.👋🏼</p>
        </div>
    )
}

const AboutButton = ({isAboutVisible, aboutHook}) => {
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