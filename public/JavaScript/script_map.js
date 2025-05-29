let map;

const { lat, lng } = window.mapCoordinates;

console.log(`Latitude: ${lat}, Longitude: ${lng}`);

async function initMap() {

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // The map, centered at Uluru
    map = new Map(document.getElementById("map"), {
        zoom: 9,
        center: { lat, lng },
        mapId: "DEMO_MAP_ID",
    });

    // The marker, positioned at Uluru
    const marker = new AdvancedMarkerElement({
        map: map,
        position: { lat, lng },
        title: "Uluru",
    });
}