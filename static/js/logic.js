// GeoJSON url
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';

// Create the map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Depth function
function getFillColor(depth) {
    if (depth >= 90) {
        return '#c6c6a9'
    } else {
        if (depth > 80) {
            return '#9fb8a1'
        }
        else {
            if (depth > 70) {
                return '#83a69a'
            }
            else {
                if (depth > 60) {
                    return '#6e9393'
                } else {
                    if (depth > 50) {
                        return '#5d7f8c'
                    } else {
                        if (depth > 40) {
                            return '#506b85'
                        } else {
                            if (depth > 30) {
                                return '#45577e'
                            } else {
                                if (depth > 20) {
                                    return '#3b4377'
                                } else {
                                    if (depth > 10) {
                                        return '#312f70'
                                    } else {
                                        return '#261969'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

// Get Data
d3.json(url).then(function (data) {
    console.log(data);
    L.geoJSON(data, {
        onEachFeature: onEachFeature,
        // Create circle marker
        pointToLayer: function (feature, latlng) {
            console.log('Creatin marker');
            return new L.CircleMarker(latlng, {
                // Define circle radius
                radius: feature.properties.mag * 4,
                fillColor: getFillColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.6,
                weight: 0
            }).addTo(myMap);
        }
    });
});

// Pop up layers
function onEachFeature(feature, layer) {
    // console.log('Creating pop up'),
    // Time format
    var format = d3.timeFormat('%d-%b-%Y at %H:%M');
    //Pop up layer using title, title and magnitude
    var popupText = (layer.bindPopup('<h2>' + 'Location : ' + '<br>' + feature.properties.title + '</h2>' + '<hr>' + '<h3>' + 'Time : ' + (format(new Date(feature.properties.time))) + '</h3>' + '<h3>' + 'Type : ' + feature.properties.type + '</h3>' + '<h3>' + 'Magnitude (Richter): ' + feature.properties.mag + '</h3>' + '<h3>' + 'Depth (Km): ' + feature.geometry.coordinates[2] + '</h3>'
    )).addTo(myMap)
};

// Legend
var legend = L.control({ position: 'bottomleft' });
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    var depth = [-10, 10, 20, 30, 40, 50, 60, 70, 80, 90];
    var colors = ['#261969', '#312f70', '#3b4377', '#45577e', '#506b85', '#5d7f8c', '#6e9393', '#83a69a', '#9fb8a1', '#c6c6a9']
    var labels = [];
    div.innerHTML = '<h2>Depth</h2>' + '<div class="labels"><div class="min">' + depth[0] + '</div> \
    <div class="max">' + depth[depth.length - 1] + '</div></div>';
    depth.forEach(function (depth, index) {
        labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })
    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
};
legend.addTo(myMap)