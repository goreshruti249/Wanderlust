mapboxgl.accessToken = mapToken;
 const map = new mapboxgl.Map({
  container: 'map', // container ID
  style:"mapbox://style/mapbox/streets-v12",
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
 zoom: 9 // starting zoom
  });

 console.log(coordinates);
//  const marker = new mapboxgl.Marker()
    const marker = new mapboxgl.Marker({ color: "red" })

        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML("<h6>Exact location will be Provided after booking.</h6>"))
        .addTo(map);