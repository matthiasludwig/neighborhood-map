// Global Variables declared
var map;
var startingLoc = {lat: 37.77493, lng: -122.419416}; // Lat/Lng for San Francisco, CA
var crimeData = [];
var displayData = ko.observableArray();

function init() {
    console.log("init() has been called");
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
    console.log("createMarker() has been called");
    for (var i = 0, j = crimeData.length; i < j; i++) {
        console.log("Marker" + i + "has been created.");
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
    console.log(displayData()[1]);
}

function populateInfoWindow(marker, InfoWindow) {
    console.log("populateInfoWindow() has been called");
}
ko.applyBindings();
