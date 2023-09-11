export function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
};

const pluginPosition = "initial-plugin-position";
const getPluginEl = () : HTMLElement|null => {
    const pluginSelector = ".mapboxgl-ctrl-directions";
    return document.querySelector(pluginSelector);
}

export function cleanupPluginPosition() {
    const pluginEl = getPluginEl();
    if (!pluginEl) {
        return;
    }
    pluginEl.classList.remove(pluginPosition);

    const bottomLeftEl = document.querySelector(".mapboxgl-ctrl-bottom-left");
    if (pluginEl.parentNode === bottomLeftEl) {
        const topLeftEl = document.querySelector(".mapboxgl-ctrl-top-left");
        if (!topLeftEl) {
            return;
        }
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
    const addressBar: HTMLElement|null = document.querySelector('.map-container');
    const sidebarEl: HTMLElement|null = document.querySelector('.journey-sidebar');
    if (!addressBar || !sidebarEl) {
        return;
    }

    const addressBarHeight = addressBar.offsetHeight - window.innerHeight;
    const sidebarElHeight = sidebarEl.offsetHeight;
    const bottomOffset = addressBarHeight + sidebarElHeight;

    pluginEl.style.bottom = `${bottomOffset}px`;
    pluginEl.classList.add(pluginPosition);
}

// Cosmetic, though it'd be nice if there were a cleaner way to do this
export function toggleDestinationUI(shouldShow: boolean) {
    const destination: HTMLElement|null = document.querySelector('.mapbox-directions-destination')
    const reverseSymbol: HTMLElement|null = document.querySelector('.directions-icon-reverse')
    if (!destination || !reverseSymbol) {
        return;
    }
    destination.style.display = shouldShow ? 'block' : 'none';
    reverseSymbol.style.display = shouldShow ? 'block' : 'none';
  }