
function initMap() {
    // The location of Pallas
    const pallas = { lat: 68.089608, lng: 24.013561 };
    // The map, centered at Pallas
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: pallas,
      mapTypeId: "terrain",
    });
    // The marker, positioned at Pallas
    // const marker = new google.maps.Marker({
    //   position: pallas,
    //   map: map,
    // });

    const triangle1Coords = [
        { lat: 68.089608, lng: 24.013561 },
        { lat: 68.081471, lng: 24.018539 },
        { lat: 68.084355, lng: 24.037594 },
        { lat: 68.089608, lng: 24.013561 },
    ];

    const triangle2Coords = [
        { lat: 68.079974, lng: 24.062758 },
        { lat: 68.079654, lng: 24.084902 },
        { lat: 68.072027, lng: 24.069453 },
        { lat: 68.079974, lng: 24.062758 },
    ];
    
    const segment1Triangle = new google.maps.Polygon({
        paths: triangle1Coords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.15,
    });
    segment1Triangle.setMap(map);

    const segment2Triangle = new google.maps.Polygon({
        paths: triangle2Coords,
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#00FF00",
        fillOpacity: 0.15,
    });
    segment2Triangle.setMap(map);

}
