export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
};

// Cosmetic, though it'd be nice if there were a cleaner way to do this
export function toggleDestinationUI(shouldShow) {
    const destination = document.querySelector('.mapbox-directions-destination')
    destination.style.display = shouldShow ? 'block' : 'none';
    const reverseSymbol = document.querySelector('.directions-icon-reverse')
    reverseSymbol.style.display = shouldShow ? 'block' : 'none';
  }