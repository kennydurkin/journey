import mapboxgl, { LngLatLike } from "mapbox-gl";

export function addCoordinateToMap(
    map: React.RefObject<mapboxgl.Map>,
    coordinates: LngLatLike,
    placeName: string,
    description: string,
    link: string
) {
    if (!map.current) return; // Refs will become null when the app unmounts
    const popup = new mapboxgl.Popup({ closeOnClick: false, offset: 6 })
        .setLngLat(coordinates)
        .setHTML(`
          <h3>${placeName}</h3>
          ${description ? `<i>${description}</i><br>` : ''}
          ${link ? `<a target="_blank" href=${link}>See on Google Maps</a>`: ''}
        `)
        .addTo(map.current);
}