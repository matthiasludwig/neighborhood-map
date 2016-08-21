// Global Variables declared
var map;
var startingLoc = {lat: 37.77493, lng: -122.419416};

var crimeData = ko.observableArray(["Test", "Test", "Test", "Test", "Test"]);

console.log(new Date());

function init() {
    console.log("init() has been called");
    // Get a Map
    map = new google.maps.Map(document.getElementById('map'), {
    center: startingLoc,
    zoom: 13,
    mapTypeControl: false
  });
  testMarker();
  getData();
 }

 function getData() {
    console.log("getData() has been called");
    $.ajax({
        url: "https://data.sfgov.org/resource/cuks-n6tp.json",
        type: "GET",
        data: {
            "$limit" : 5000,
            "$where" : "date between '2016-08-01T00:00:00' and '2016-08-20T14:00:00'",
            "$order" : "date DESC",
            "$$app_token" : "FOWqIJ6wgZFV3PBnSg7DKip6V"
        },
        beforeSend: function(){
            $('#loadingData').show();
        },
        success: function(data){
            console.log("Retrieved " + data.length + " records from the dataset!");
            console.log(data);
        },
        complete: function(){
          $('#loadingData').hide();
        }
    });
}

function saveData(data) {
    console.log("Retrieved " + data.length + " records from the dataset!");
    // $('#loadingData').hide();
    console.log(data);
}
function testMarker() {

     var marker = new google.maps.Marker({
         position: {"lat": 37.709473, "lng": -122.431657},
         title:"Hello World!"
     });
      marker.setMap(map);
      console.log("Marker set to 'map'");
 }

ko.applyBindings();
