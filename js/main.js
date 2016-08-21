// Global Variables declared
var map;
var startingLoc = {lat: 37.77493, lng: -122.419416};
var locations = [];

var crimeData = ko.observableArray();


function init() {
    // Get a Map
    map = new google.maps.Map(document.getElementById('map'), {
    center: startingLoc,
    zoom: 13,
    mapTypeControl: false
  });

 

ko.applyBindings();
