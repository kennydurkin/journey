import { useState, useEffect, useRef } from "react";
import type { Map } from "mapbox-gl";

interface RotateProps {
    map: React.RefObject<Map>,
}

const RotateToggle = ({map}: RotateProps) => {
    const [isRotationOn, setRotation] = useState(false);
    const animationFrameId: React.MutableRefObject<number> = useRef(0);

    function rotateCamera(timestamp: number) {
        if (!map.current) return;
        map.current.rotateTo(
            (map.current.getBearing() + 0.2) % 360,
            { duration: 0 }
        );
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