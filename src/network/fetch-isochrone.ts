import { LngLatLike } from "mapbox-gl";
import { FeatureCollection, LineString } from "geojson";

const token = import.meta.env.VITE_MAPBOX_KEY;

//https://api.mapbox.com/isochrone/v1/{profile}/{coordinates}?{contours_minutes|contours_meters}
export default async (position: LngLatLike, duration: string): Promise<FeatureCollection<LineString>> => {
    const urlBase = 'https://api.mapbox.com/isochrone/v1/';
    const generalization = 200;
    const isochroneUrl =
        urlBase +
        `mapbox/cycling/` +
        (position as Array<number>).join(',') + // Position is of the form "-123.4, 56.7"
        `?contours_minutes=${duration}` +
        `&generalize=${generalization}` +
        `&polygons=false&access_token=${token}`;
    const result = await fetch(isochroneUrl);
    const parsed = await result.json();
    return parsed;
}