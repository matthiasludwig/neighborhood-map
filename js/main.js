// Global Variables declared
// var map;
var startingLoc = {lat: 37.77493, lng: -122.419416}; // Lat/Lng for San Francisco, CA
var crimeData = ko.observableArray();

function init() {
    console.log("init() has been called");
    // Get a Map
    map = new google.maps.Map(document.getElementById('map'), {
    center: startingLoc,
    zoom: 13,
    mapTypeControl: false
  });
  var marker = new google.maps.Marker({
      position: startingLoc,
      map: map,
      animation: google.maps.Animation.DROP,
      title: 'Hello World!'
    });
  getData();
 }

 function getData() {
    console.log("getData() has been called");
    $.ajax({
        url: "https://data.sfgov.org/resource/cuks-n6tp.json",
        type: "GET",
        data: {
            "$limit" : 50,
            "$where" : "date between '2016-08-01T00:00:00' and '2016-08-20T14:00:00'",
            "$order" : "date DESC",
            "$$app_token" : "FOWqIJ6wgZFV3PBnSg7DKip6V"
        },
        beforeSend: function(){
            $('#loadingData').show();
        },
        success: function(data){
            // TODO: DELETE. Just for debugging
            console.log("Retrieved " + data.length + " records from the dataset!");
            console.log(data);

            for (var i = 0, j = data.length; i < j; i++){
                crimeData.push(data[i]);

                var marker = new google.maps.Marker({
                    position: {lat: parseFloat(data[i].y), lng: parseFloat(data[i].x)},
                    title: data[i].descript,
                    map: map,
                });
            }
        },
        complete: function(){
          $('#loadingData').hide();
        }
    });
}

ko.applyBindings();
