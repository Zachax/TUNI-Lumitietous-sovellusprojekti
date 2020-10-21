
/*
 * Kannasta saatu data käsitellään taulukoksi, jossa alkioina segmentin id ja koordinaatit sisältävä taulukko
 *
 */
function segmentDataToArray(data) {
    console.log(data);

    const coordsForSegments = data.map((item) => {
        return [item.Segmentti, item.Sijainti];
    });

    console.log(coordsForSegments);
    console.log(coordsForSegments[0][1]);

    let dataArray = [];
    let coordsArray = [];
    let segment;
    for (let i = 0; i < coordsForSegments.length; i++) {
        if (i < coordsForSegments.length - 1) {
            if (coordsForSegments[i][0] == coordsForSegments[i+1][0]) {
                coordsArray.push({lat: coordsForSegments[i][1].x, lng: coordsForSegments[i][1].y});
                console.log(coordsArray);
            } else {
                coordsArray.push({lat: coordsForSegments[i][1].x, lng: coordsForSegments[i][1].y});
                segment = coordsForSegments[i][0]
                dataArray.push([{segment}, {coordsArray}]);
                coordsArray = [];
            }     
        } else {
            coordsArray.push({lat: coordsForSegments[i][1].x, lng: coordsForSegments[i][1].y});
            segment = coordsForSegments[i][0]
            dataArray.push([{segment}, {coordsArray}]);
            console.log(coordsArray);
            coordsArray = [];    
        }
    }

    console.log(dataArray);
    return dataArray;
}

// Segmenttien tiedot json-muodossa kannasta
function getSegments() {
    return fetch('http://localhost:3000/points')
        .then((response) => { 
            return response.json().then((data) => {
                console.log(data);
                return data;
            }).catch((err) => {
                console.log(err);
            }) 
        });
}

function initMap() {
    // Pallakesen keskuksen koordinaatit
    const pallas = { lat: 68.045721, lng: 24.062813 };
    // Kartta, keskitetty pallakselle
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: pallas,
      mapTypeId: "terrain",
    });

    // Piirtää segmentin kannasta haettujen koordinaattien mukaisesti.
    function drawSegmentsFromData(map) {
        let coordsJson;
        getSegments().then((data) => {
            coordsJson = data;

            const dataArray = segmentDataToArray(coordsJson);

            for (let i = 0; i < dataArray.length; i++) {
                let segment;
                segment = new google.maps.Polygon({
                    paths: dataArray[i][1].coordsArray,
                    strokeColor: "#0000FF",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#0000FF",
                    fillOpacity: 0.15,
                });

                segment.setMap(map);
    
                segment.addListener("mouseover", () => {
                    segment.setOptions({fillOpacity: 0.8});
                });
            
                segment.addListener("mouseout", () => {
                    segment.setOptions({fillOpacity: 0.15});
                });
            
                segment.addListener("click", () => {
                    infoDiv = document.getElementById("segment_info");
                    infoDiv.innerHTML = "<p>Segmentin " + dataArray[i][0].segment + " tietoja</p>";
                });
            }     
        });   
    };
    drawSegmentsFromData(map);
}
