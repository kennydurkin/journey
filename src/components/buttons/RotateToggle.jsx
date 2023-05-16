import { useState, useEffect, useRef } from "react";

const RotateToggle = ({map}) => {
    const [isRotationOn, setRotation] = useState(false);
    const animationFrameId = useRef(undefined);

    function rotateCamera(timestamp) {
        map.current.rotateTo((map.current.getBearing() + 0.2) % 360, { duration: 0 });
        animationFrameId.current = requestAnimationFrame(rotateCamera);
    }

    useEffect(() => {
        if (isRotationOn) {
            animationFrameId.current = requestAnimationFrame(rotateCamera);
        };

        // Returning a method here is called "cleanup", invoked as the
        // very first thing executed the *next* time this useEffect fires
        return () => cancelAnimationFrame(animationFrameId.current);
    }, [isRotationOn]);

    return (
        <button className="menu-button" onClick={() => {setRotation(!isRotationOn)}}>🔄</button>
    )
}

export default RotateToggle;