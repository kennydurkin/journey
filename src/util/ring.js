/**
 * Inspired by https://docs.mapbox.com/mapbox-gl-js/example/animate-ant-path/
 * @param {*} map The map instance
 * @param {*} contourRing An array of [lon, lat] pairs
 * @param {string|null} color
 */
export default function addRingToMap(map, contourRing, color = null) {
    const ringColor = color ?? '#1338BE';
    const geojson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'coordinates': contourRing,
                    'type': 'LineString'
                }
            }
        ]
    };
       
    map.current.addSource('ring-coords', {
        type: 'geojson',
        data: geojson
    });
       
    // add a line layer without line-dasharray defined to fill the gaps in the dashed line
    map.current.addLayer({
        type: 'line',
        source: 'ring-coords',
        id: 'ring-background',
        paint: {
            'line-color': ringColor,
            'line-width': 6,
            'line-opacity': 0.4
        }
    });
       
      // add a line layer with line-dasharray set to the first value in dashArraySequence
    map.current.addLayer({
        type: 'line',
        source: 'ring-coords',
        id: 'ring-dashes',
        paint: {
            'line-color': ringColor,
            'line-width': 6,
            'line-dasharray': [0, 4, 3]
        }
    });
       
    // technique based on https://jsfiddle.net/2mws8y3q/
    // an array of valid line-dasharray values, specifying the lengths of the alternating dashes and gaps that form the dash pattern
    const dashArraySequence = [
        [0, 4, 3],
        [0.5, 4, 2.5],
        [1, 4, 2],
        [1.5, 4, 1.5],
        [2, 4, 1],
        [2.5, 4, 0.5],
        [3, 4, 0],
        [0, 0.5, 3, 3.5],
        [0, 1, 3, 3],
        [0, 1.5, 3, 2.5],
        [0, 2, 3, 2],
        [0, 2.5, 3, 1.5],
        [0, 3, 3, 1],
        [0, 3.5, 3, 0.5]
    ];
       
    let step = 0;
       
    function animateDashArray(timestamp) {
        // Update line-dasharray using the next value in dashArraySequence. The
        // divisor in the expression `timestamp / 50` controls the animation speed.
        const newStep = parseInt(
            (timestamp / 50) % dashArraySequence.length
        );
        
        if (newStep !== step && map.current.getLayer('ring-dashes')) {
            map.current.setPaintProperty(
                'ring-dashes',
                'line-dasharray',
                dashArraySequence[step]
            );
            step = newStep;
        }
        
        // Request the next frame of the animation.
        if (map.current.getLayer('ring-dashes')) {
            requestAnimationFrame(animateDashArray);
        }
    }
       
    // start the animation
    animateDashArray(0);
}