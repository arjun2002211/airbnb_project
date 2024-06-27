mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [longitude, latitude], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// console.log(longitude, latitude);
// console.log(coordinates);

const marker = new mapboxgl.Marker({ color: 'red' }).setLngLat([longitude, latitude]).setPopup(new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat([-96, 37.8])
    .setHTML(`<h5>${position}</h5> <br> <p>exact location will be provided on booking</p>`))
    .addTo(map);
