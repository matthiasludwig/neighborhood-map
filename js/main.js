// Global Variables declared
var map;
var largeInfowindow;
var startingLoc = {lat: 37.77493, lng: -122.419416}; // Lat/Lng for San Francisco, CA
var sourceData = ko.observableArray();
var displayData = ko.observableArray();
var selectedItem = ko.observable();

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
// Knockout.js applyBindings for the View
ko.applyBindings();
