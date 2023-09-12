import { BBox, FeatureCollection, Point, Position } from "geojson";

const token = import.meta.env.VITE_MAPBOX_KEY;

//https://api.mapbox.com/geocoding/v5/{endpoint}/{search_text}.json
export default async (search_text: string, bbox: BBox, coordinate: Position): Promise<FeatureCollection<Point>> => {
    const urlBase = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    const geocodingUrl =
        urlBase +
        `${search_text}.json` +
        `?autocomplete=false` +
        `&bbox=${bbox}` +
        `&limit=10` +
        `&proximity=${coordinate.join(',')}` +
        `&types=poi` +
        `&access_token=${token}`;
    const result = await fetch(geocodingUrl);
    const parsed = await result.json();
    return parsed;
}