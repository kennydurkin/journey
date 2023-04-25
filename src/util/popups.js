import mapboxgl from "mapbox-gl";

export function addCoordinateToMap(map, coordinates, placeName, description, link) {
    const popup = new mapboxgl.Popup({ closeOnClick: false, offset: 6 })
        .setLngLat(coordinates)
        .setHTML(`
          <h3>${placeName}</h3>
          ${description ? `<i>${description}</i><br>` : ''}
          ${link ? `<a target="_blank" href=${link}>See on Google Maps</a>`: ''}
          `).addTo(map.current);
}