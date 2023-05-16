export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
};

const pluginPosition = "initial-plugin-position";
const getPluginEl = () => {
    const pluginSelector = ".mapboxgl-ctrl-directions";
    return document.querySelector(pluginSelector);
}

export function cleanupPluginPosition() {
    const pluginEl = getPluginEl();
    pluginEl.classList.remove(pluginPosition);

    const bottomLeftEl = document.querySelector(".mapboxgl-ctrl-bottom-left");
    if (pluginEl.parentNode === bottomLeftEl) {
        const topLeftEl = document.querySelector(".mapboxgl-ctrl-top-left");
        topLeftEl.appendChild(pluginEl);
        pluginEl.style.bottom = '';
    }
}

export function initializePluginPosition() {
    const pluginEl = getPluginEl();
    if (!pluginEl) return;

    // Address bar height needs to be calculated and figured into the bottom offset for this element
    // Necessary on mobile devices because the sidebar el, for some reason, uses the viewport bottom
    // when set to bottom: 0 rather than the true bottom zero point which is offset by address bars
    const addressBarHeight = document.querySelector('.map-container').offsetHeight - window.innerHeight;
    console.log('addressbar height', addressBarHeight);
    const sidebarElHeight = document.querySelector('.journey-sidebar').offsetHeight;
    const bottomOffset = addressBarHeight + sidebarElHeight;

    pluginEl.style.bottom = `${bottomOffset}px`;
    pluginEl.classList.add(pluginPosition);
}

// Cosmetic, though it'd be nice if there were a cleaner way to do this
export function toggleDestinationUI(shouldShow) {
    const destination = document.querySelector('.mapbox-directions-destination')
    destination.style.display = shouldShow ? 'block' : 'none';
    const reverseSymbol = document.querySelector('.directions-icon-reverse')
    reverseSymbol.style.display = shouldShow ? 'block' : 'none';
  }