// Global Variables declared
var map;
var largeInfowindow;
var startingLoc = {lat: 37.77493, lng: -122.419416}; // Lat/Lng for San Francisco, CA
var crimeData = [];
var displayData = ko.observableArray();

function init() {
    console.log("init() has been called");
    // Fill Variable for InfoWindow (used later)
    largeInfowindow = new google.maps.InfoWindow();
    // Get a Map
    map = new google.maps.Map(document.getElementById('map'), {
    center: startingLoc,
    zoom: 13,
    mapTypeControl: false
  });
  getData();
 }

 function getData() {
    console.log("getData() has been called");
    $.ajax({
        url: "https://data.sfgov.org/resource/cuks-n6tp.json",
        type: "GET",
        data: {
            "$limit" : 10,
            "$where" : "date between '2016-08-01T00:00:00' and '2016-08-20T14:00:00'",
            "$order" : "date DESC",
            "$$app_token" : "FOWqIJ6wgZFV3PBnSg7DKip6V"
        },
        // Loading animation
        beforeSend: function(){
            $('#loadingData').show();
        },
        success: function(data){
            // TODO: DELETE. Just for debugging
            console.log("Retrieved " + data.length + " records from the dataset!");
            console.log(data);
            for (var i = 0, j = data.length; i < j; i++){
                crimeData.push(data[i]);
            }
        },
        complete: function(){
            // Hiding the loading animation
            $('#loadingData').hide();
            createMarker(crimeData);
        },
        error: function(){
            // TODO Implement Error Handling for failing of ajax Request
            console.log("API could not be loaded");
        }
    });
}

function createMarker(crimeData) {
    console.log("createMarker() has been called"); //TODO JUST FOR DEBUGGING DELETE BEFORE LIVE
    for (var i = 0, j = crimeData.length; i < j; i++) {
        var position = {lat: parseFloat(crimeData[i].y), lng: parseFloat(crimeData[i].x)};
        var title = crimeData[i].descript;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            map: map,
            animation: google.maps.Animation.DROP,
            id: i
        });
        displayData.push(marker);
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
    }
}

function populateInfoWindow(marker, InfoWindow) {
    if (InfoWindow.marker != marker) {
      InfoWindow.marker = marker;
      InfoWindow.setContent('<div>' + marker.title + '</div>');
      InfoWindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      InfoWindow.addListener('closeclick', function() {
        InfoWindow.marker = null;
      });
    }
}

// Knockout.js applyBindings for the View
ko.applyBindings();
