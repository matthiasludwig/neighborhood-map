// Gloabl Variables declared
var map;
var startingLoc = {lat: 37.77493, lng: -122.419416};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: startingLoc,
    zoom: 12
  });
}

function googleError() {
    window.alert("Google Maps could not be loaded! PANIC!");
}
