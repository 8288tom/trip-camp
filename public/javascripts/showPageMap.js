mapboxgl.accessToken = mapToken;

const campgroundJson = JSON.parse(campgroundString);


const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campgroundJson.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campgroundJson.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campgroundJson.title}</h3><p>${campgroundJson.location}</p>`
            )
    )
    .addTo(map)

map.addControl(new mapboxgl.NavigationControl());
