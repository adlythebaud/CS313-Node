var map;
var service;
var infowindow;


function initMap() {
    if (navigator.geolocation) {
        console.log(navigator.geolocation.getCurrentPosition(successFunction, errorFunction));
    } else {
        alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
    }

    function errorFunction(position) {
        console.log("unable to access latitude and longitude");
    }

    function successFunction(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        console.log('Your latitude is :' + lat + ' and longitude is ' + long);
        return "test";
    }


    var sydney = new google.maps.LatLng(-33.867, 151.195);


    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(
        document.getElementById('map'), {
            center: sydney,
            zoom: 15
        });

    var request = {
        query: 'chik fil a lake mary fl',
        fields: ['name', 'geometry', 'formatted_address', 'place_id']
    };

    var service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                // service.createMarker(results[i]);
            }
            map.setCenter(results[0].geometry.location);
            console.log(results);

        }
    });
}