import { timeout } from "../util/helpers";

async function zoomToCity(map) {
    await timeout(3000);
    map.current.flyTo({
        center: [-122.2685, 47.5505],
        zoom: 11.73,
        curve: 0.5,
    });
}
  
async function rotateToBearing(map) {
    await timeout(7000);
    map.current.rotateTo(5, {
        duration: 2000,
        easing: (t) => t,
    });
}

async function introAnimation(map) {
    await Promise.all([
        zoomToCity(map),
        rotateToBearing(map),
        timeout(10000)
    ]);
}

export { introAnimation };