/**
 * Leaflet Draw Plugin Example
 */ 

var map = L.map('mapid').setView([51.505, -0.09], 13);

const layerURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
const drawnItems = new L.FeatureGroup();
const drawControl = new L.Control.Draw({
    draw: {
        polygon: true,
        marker: false,
        polyline: false,
        rectangle: false,
        circle: false,
        circlemarker: false
    },
    edit: {
        featureGroup: drawnItems,                
    }
});

L.tileLayer(layerURL, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
}).addTo(map);


map.addLayer(drawnItems);
map.addControl(drawControl);

// Leaflet Draw Events - Create
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    var polygonQuantity = drawnItems.toGeoJSON().features.length;

    if ((polygonQuantity) >= 2) {
        return
    }

    // Recive feature or initialize them
    feature = layer.feature = layer.feature || {}; // Initialize feature
    feature.type = feature.type || "Feature"; // Initialize feature.type
    var props = feature.properties = feature.properties || {}; // Initialize feature.properties

    if (polygonQuantity === 1) {
        let outerPolygon = drawnItems.toGeoJSON().features[0].properties.landfill.type

        document.querySelector('.leaflet-draw-toolbar.leaflet-bar.leaflet-draw-toolbar-top').style.display = "none";

        if (outerPolygon === 'landfill') {
            return createLandfillLayer(drawnItems, layer, props, 'Fila', 'waiting', 'green', 'green');
        }

        if (outerPolygon === 'waiting') {
            return createLandfillLayer(drawnItems, layer, props, 'Aterro', 'landfill', 'DodgerBlue', 'DodgerBlue');
        }
    }

    createLandfillLayer(drawnItems, layer, props, 'Aterro', 'landfill', 'DodgerBlue', 'DodgerBlue');
});

// Leaflet Draw Events - Deleted
map.on(L.Draw.Event.DELETED, function (event) {
    var polygonQuantity = drawnItems.toGeoJSON().features.length;

    if (polygonQuantity < 2) {
        document.querySelector('.leaflet-draw-toolbar.leaflet-bar.leaflet-draw-toolbar-top').style.display = "block";
    }
});

function createLandfillLayer(drawnItems, layer, props, text, type, fillcolor, color) {
    props.landfill = {
        "type": type
    };
    layer.setStyle({fillColor: fillcolor, color: color})
    layer.bindPopup(text);
    layer.bindTooltip(text,
        {permanent: true, direction:"center"}
    ).openTooltip();
    drawnItems.addLayer(layer);
}

function getGeoJson() {
    var json = drawnItems.toGeoJSON();
    var shape_for_db = JSON.stringify(json);
    console.log(shape_for_db);
}