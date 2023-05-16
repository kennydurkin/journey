export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
};

const getPluginEl = () => {
    const pluginSelector = ".mapboxgl-ctrl-directions";
    return document.querySelector(pluginSelector);
}

const pluginPosition = "initial-plugin-position";
export function cleanupPluginPosition() {
    const pluginEl = getPluginEl();
    pluginEl.classList.remove(pluginPosition);

    const bottomLeftEl = document.querySelector(".mapboxgl-ctrl-bottom-left");
    if (pluginEl.parentNode === bottomLeftEl) {
        const topLeftEl = document.querySelector(".mapboxgl-ctrl-top-left");
        topLeftEl.appendChild(pluginEl);
    }
}

export function initializePluginPosition() {
    const pluginEl = getPluginEl();
    if (!pluginEl) return;
    pluginEl.classList.add(pluginPosition);
}

// Cosmetic, though it'd be nice if there were a cleaner way to do this
export function toggleDestinationUI(shouldShow) {
    const destination = document.querySelector('.mapbox-directions-destination')
    destination.style.display = shouldShow ? 'block' : 'none';
    const reverseSymbol = document.querySelector('.directions-icon-reverse')
    reverseSymbol.style.display = shouldShow ? 'block' : 'none';
  }