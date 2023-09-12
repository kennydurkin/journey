import fetchIsochrone from "../network/fetch-isochrone";
import fetchGeocoding from "../network/fetch-geocoding";
import circle from "@turf/circle";
import bbox from "@turf/bbox";
import { LngLatLike } from "mapbox-gl";
import { Feature, LineString, Position, Point } from "geojson";

export default class Journey {
    originPoint: LngLatLike;
    isOneWay: boolean;
    idealDuration: number;
    idealRange: number;
    poiType: string;
    
    // These get determined later on
    contours?: Feature<LineString>[]; // GeoJSON Feature[]
    contourRing?: Position[];
    bearingPoint?: Position; // [Lon, lat]
    pois?: Feature<Point>[]; // GeoJSON Feature[]
    destinationPoi?: Feature<Point>; // GeoJSON Feature
    destinationPoint?: Position; // [Lon, lat]


    constructor(originPoint: LngLatLike, isOneWay: boolean, idealDuration: number, poiType: string) {
        this.originPoint = originPoint;
        this.isOneWay = isOneWay;
        this.idealDuration = idealDuration;
        this.poiType = poiType;
        this.idealRange = this.isOneWay
            ? this.idealDuration
            : Math.ceil(this.idealDuration / 2);
    }

    // Generate a user journey!
    async generateJourney() {
        this.contours = await this.getContours();
        const targetContour = this.contours[0]; // TODO: grab the element with a properties.contour value of this.idealRange
        this.contourRing = targetContour.geometry.coordinates;
        this.bearingPoint = this.pickCoordinate();
        this.pois = await this.getPois();
        this.destinationPoint = this.pickAddress();
    }

    // Call the network helper and return our result
    async getContours() {
        const results = await fetchIsochrone(
            this.originPoint,
            this.idealRange.toString()
        );

        return results.features;
    }

    async getPois() {
        if (!this.bearingPoint) return;
        const boundingBox = bbox(
            circle(this.bearingPoint, 1, {
            units:'miles'
            })
        );

        if (import.meta.env.DEV) {
            console.debug(`Bbox debugging: (${boundingBox.join(',')})`);
        }

        const results = await fetchGeocoding(
            this.poiType,
            boundingBox,
            this.bearingPoint,
        );

        return results.features;
    }

    /**
     * @returns [Lon, Lat]
     */
    pickCoordinate() {
        if (!this.contours) return; // hm
        let coordinate;
        const targetContour = this.contours[0]; // TODO: grab the element with a properties.contour value of this.idealRange
        const ringCoords = targetContour.geometry.coordinates; // Array of [Lon,Lat]s
        const randomIndex = Math.floor(Math.random() * ringCoords.length-1); // TODO: make this a "generate random index" helper

        let candidate = ringCoords[randomIndex];    
        // while (!coordinate) {
        //    const randomIndex = Math.floor(Math.random() * ringCoords.length-1);
        //    verifyCoordinate(candidate) && coordinate = candidate
        // }
    
        // Remove this line once the above is implemented
        coordinate = candidate;
        return coordinate;
    }
  
    /**
     * TODO: implement two checks:
     *    - is greater than X meters away from next smallest linestring contour
     *    - square/circle around candidate points consists of at least Y% points within the target contour
     * @param {number[]} coordinate 
     */
    verifyCoordinate(coordinate: number[]) {
        return true;
    }

    pickAddress() {
        if (!this.pois) return;
        // Step one: polygonize the contour LineStrings
        // Step two: use `mask` to treat the smaller LineString as a hole in the target LineString
        // Step three: filter the array to only those that pass pointsWithinPolygon
        // Step four: pick one at random if there are multiple left over
        const filtered = this.pois.filter(poi=> {
          return true;
        });
      
        // If there were none that survived the filter....we can just return the first result for now
        if (!filtered.length) {
          return this.pois[0].geometry.coordinates;
        }
      
        const randomIndex = Math.floor(Math.random() * (filtered.length - 1));
        this.destinationPoi = filtered[randomIndex];

        return this.destinationPoi.geometry.coordinates;
    }
}