import { timeout } from "../util/helpers";

async function zoomToCity(map) {
    await timeout(3000);
    map.current.flyTo({
        // TODO: -122.2685 for desktop users once media queries start being added
        center: [-122.3085, 47.5505],
        // TODO: 11.00 for desktop users once media queries start being added
        zoom: 11.00,
        curve: 1.0,
    });
}
  
async function rotateToBearing(map) {
    await timeout(8000);
    map.current.rotateTo(5, {
        duration: 2000,
        // TODO: 11.73 for desktop users once media queries start being added
        zoom: 10.50,
        pitch: 62.50,
        easing: (t) => t,
    });
}

async function introAnimation(map) {
    await Promise.all([
        zoomToCity(map),
        rotateToBearing(map),
        timeout(11000)
    ]);
}

export { introAnimation };