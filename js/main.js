// Global Variables declared
var map;
var startingLoc = {lat: 37.77493, lng: -122.419416};
var locations = [];

function init() {
    //Get a Map
    map = new google.maps.Map(document.getElementById('map'), {
    center: startingLoc,
    zoom: 13,
    mapTypeControl: false
  });

  //Google Maps Places Request to get all Parks in the vicinity of 7.5 km
  var request = {
      location: startingLoc,
      radius: 7500,
      type: ['park']
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, googlePlaces);
}

//Callback from Google Maps Places Request. Puts all parks found at the location in the locations Array
function googlePlaces(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            locations.push(results[i]);
        }
    }
    else {
        console.log("Places API could not be reached. Update View accordingly > TODO");
    }
    findPictures();
}

function findPictures() {
    for (var i = 0; i < locations.length; i++) {
        createMarker(locations[i]);
    }
}

function createMarker(place) {

    var markerInfoWindow = new google.maps.InfoWindow();

    //Credit: Google Maps API class on Udacity.
    var defaultMarker = markerColor('2E7D32'); //Default marker is green
    var highlightMarker = markerColor('E65100'); //If mouseover marker changes to orange

    var marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name,
      icon: defaultMarker,
      animation: google.maps.Animation.DROP
      });
    //Add Event Listeners to change the color of the markers
    marker.addListener('mouseover', function() {
        this.setIcon(highlightMarker);
      });
    marker.addListener('mouseout', function() {
        this.setIcon(defaultMarker);
      });
      //Open InfoWindow
    marker.addListener('click', function() {
        populateInfoWindow(this, markerInfoWindow);
      });
}

function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
    //   infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.setContent('<div>' + marker.position + '</div>');
      infowindow.open(map, marker);
      // Clear Content when infowindow is closed. All credit to Project 4 P2 Google Maps API Class on Udacity
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
}

//Credit: Google Maps API Class on Udacity. Changes to color of the Marker with the color HEX codes declared above
function markerColor(color) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ color +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}


//Error Handling
function googleError() {
    console.log("Google Maps could not be loaded. Update View accordingly > TODO");
}
