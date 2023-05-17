# Readme

<img src="https://github.com/kennydurkin/journey/assets/5722340/ef207bbb-5ff0-4894-a898-2ecaa10c1e36" alt="A Chrome DevTools screenshot of Journey" width=280 align="right"/>

Journey is a clientside map-based web app meant to help empower me to cycle for fun and fitness. 

The main motivation came from my desire to explore Seattle’s bicycle network and trail system.

My motivations were threefold:
1. Lower the activation energy needed to set out on a bike ride by picking a new point of interest

2. Manage time constraints by using [*isochrones*](https://wiki.openstreetmap.org/wiki/Isochrone) to gauge how far away my destination should be

3. Improve perceptions of terrain by exaggerating elevations and not using a top-down perspective

> **The web app is currently live over at [https://kennydurk.in/journey](https://kennydurk.in/journey).**

<hr/>

## Design Guidelines

- Journey uses the Mapbox developer ecosystem as its foundation. Reasons being:
    - I wanted to learn a programmatic way to work with maps, and MapboxGL JS is well-maintained.
    - They have great [developer relations](https://www.mapbox.com/developers), APIs, and  documentation.


<img alt="A pitch of ~62.5° and terrain exaggeration of 4.0" src="https://github.com/kennydurkin/journey/assets/5722340/9bf9a285-5eb0-41fa-a06f-2a447fce5cfb" align="right" width=250/>

- The app uses exaggerated terrain and an angulated pitch so as to highlight the surrounding elevation

- It’s a single page app that takes up the entire screen for simplicity

- Should be responsive and designed from a mobile-first perspective

- On first visit, a camera animation is displayed to showcase the 3D aspect of the map and its terrain

- User supplies their origin point, how long they would like to cycle, and the type of destination they would like to discover


>*Pictured at right: A pitch of ~62.5° and terrain exaggeration of 4.0*

<img alt="A sample isochrone showing all points a 30 min bike ride away from the Capitol Hill neighborhood" src="https://github.com/kennydurkin/journey/assets/5722340/a739ebdc-66ee-4379-9d9a-72b5728090aa" align="right" width=250/>


- Utilizes the concept of an [*isochrone*](https://wiki.openstreetmap.org/wiki/Isochrone), a ring around a given point that will convey the ideal range of the ride based on the user’s time constraints

- Randomly selects a point along the ring and searches for destinations of the specified type in proximity to that point

- Selects the first result and supplies routing instructions and depicts them on the map

>*Pictured at right: A sample isochrone showing all points a 30 min bike ride away from the Capitol Hill neighborhood.*

<br/>

<p align="center">
    <img alt="A successful lookup and bike route to a nearby café in the Denver, CO metropolitan area" src="https://github.com/kennydurkin/journey/assets/5722340/0bdd2e7e-be09-4984-9551-e97257cb366f" height=600/>
    <p align="center"><i>A successful lookup and bike route to a nearby café in the Denver, CO metropolitan area.</i></p>
</p>

## Technical Stack

| Tool | Notes |
| --- | --- |
| Mapbox GL JS | Core JavaScript library for creating a WebGL based interactive map |
| Isochrone API | Supplies the ring of points based on desired time commitment |
| Geocoding API | Searches in proximity to a point for destinations of the desired type |
| Directions Plugin | Mapbox-provided plugin, supplies routing results and instructions UI |
| React JS | View layer, provides interactivity based on UI changes (e.g. toggles) |
| Vite Bundler | Package manager that handles bundle minification and other build tasks |
| Github Pages | Free web hosting for rapid prototyping and deployment |

## User Experience Flow

![*A rough outline of the core user flow of the current web app.*](https://github.com/kennydurkin/journey/assets/5722340/24f0a1f7-5d54-4130-af5e-d63e66c7fdbf)

*A rough outline of the core user flow of the current web app.*

## Future Improvements

- [ ]  Refactoring the codebase to TypeScript
- [ ]  Add unit testing for helper methods and React components
- [ ]  Let the user determine their point along the ring
- [ ]  Add more destination types (possibly switch a better geocoding API)
- [ ]  Add handling for sparse regions where no results are discovered
- [ ]  Improve the “point along a ring” approach, as this can be interfered with by shorelines
- [ ]  Improve the “radius surrounding a point” search for points-of-interest
- [ ]  Allow the user to specify region and show a camera animation showing their region’s terrain
- [ ]  Add a gradient in the route line that shows terrain intensity
- [ ]  Add a chart graphing elevation gain throughout the route

## Development

This is not an actively-maintained project, but PRs are nonetheless welcome 🙂

1. Sign up for a [Mapbox Developer API key](https://account.mapbox.com/access-tokens/) and copy the key.
2. Clone the repository onto your machine
3. Create a file at the root level called `.env` and add the following:
    - `VITE_MAPBOX_KEY=yourApiKeyStringGoesHere`
4. Run `npm install` to obtain all the required dependencies
5. Run `npm run dev` and Vite will generate a port for you to visit locally

[Back to top](#)
