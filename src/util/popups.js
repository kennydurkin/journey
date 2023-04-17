import mapboxgl from "mapbox-gl";

export function addCoordinateToMap(map, randomCoordinate, descriptor, placeName) {
    const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(randomCoordinate)
        .setHTML(`
          <h3>${descriptor} Point</h3>
          ${placeName ? `<i>${placeName}</i>` : ''}
          <i>${randomCoordinate.join(',')}</i>
        `).addTo(map.current);
  }