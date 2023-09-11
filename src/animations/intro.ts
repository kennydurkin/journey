import type { Map } from "mapbox-gl";
import { timeout } from "../util/helpers";

async function zoomToCity(map: React.RefObject<Map>) {
    if (!map.current) return; // Refs will become null when the app unmounts

    await timeout(2000);
    map.current.flyTo({
        // TODO: -122.2685 for desktop users once media queries start being added
        center: [-122.3085, 47.5505],
        // TODO: 11.00 for desktop users once media queries start being added
        zoom: 11.00,
        curve: 1.0,
    });
}
  
async function rotateToBearing(map: React.RefObject<Map>) {
    if (!map.current) return; // Refs will become null when the app unmounts

    await timeout(7000);
    map.current.rotateTo(5, {
        duration: 2000,
        // TODO: 11.73 for desktop users once media queries start being added
        zoom: 10.50,
        pitch: 62.50,
        easing: (t) => t,
    });
}

async function introAnimation(map: React.RefObject<Map>) {
    if (!map.current) return; // Refs will become null when the app unmounts

    if (!localStorage.getItem("hasVisited")) {
        localStorage.setItem("hasVisited", "true");
    }
    await Promise.all([
        zoomToCity(map),
        rotateToBearing(map),
        timeout(10000)
    ]);
}

export { introAnimation };