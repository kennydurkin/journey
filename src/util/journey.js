import fetchIsochrone from "../network/fetch-isochrone";
import fetchGeocoding from "../network/fetch-geocoding";
import circle from "@turf/circle";
import bbox from "@turf/bbox";

export default class Journey {
    // These get determined in the constructor
    originPoint; // [Lon, lat]
    isOneWay; // true/false
    idealDuration; // Number, in minutes
    idealRange; // Number, in minutes
    poiType; // String
    
    // These get determined later on
    contours = []; // GeoJSON Feature[]
    bearingPoint = []; // [Lon, lat]
    pois = []; // GeoJSON Feature[]
    destinationPoi = []; // GeoJSON Feature
    destinationPoint = []; // [Lon, lat]

    constructor(originPoint, isOneWay, idealDuration, poiType) {
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
            this.idealRange
        );
        return results.features;
    }

    async getPois() {
        const testBbox = bbox(
            circle(this.bearingPoint, 1, {
            units:'miles'
            })
        );

        if (import.meta.env.DEV) {
            console.debug(`Bbox debugging: (${testBbox.join(',')})`);
        }

        const results = await fetchGeocoding(
            this.poiType,
            testBbox,
            this.bearingPoint,
        );
        return results.features;
    }

    /**
     * @returns [Lon, Lat]
     */
    pickCoordinate() {
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
    verifyCoordinate(coordinate) {
        return true;
    }

    pickAddress() {
        // Step one: polygonize the contour LineStrings
        // Step two: use `mask` to treat the smaller LineString as a hole in the target LineString
        // Step three: filter the array to only those that pass pointsWithinPolygon
        // Step four: pick one at random if there are multiple left over
        const filtered = this.pois.filter(poi=> {
          return true;
        });
      
        // If there were none that survived the filter....we can just return the first result for now
        if (!filtered.length) {
          return pointsOfInterest[0];
        }
      
        const randomIndex = Math.floor(Math.random() * (filtered.length - 1));
        // console.log('Randomly selecting element #', randomIndex, 'of this array', filtered);
        this.destinationPoi = filtered[randomIndex];
        return this.destinationPoi.geometry.coordinates;
    }
}