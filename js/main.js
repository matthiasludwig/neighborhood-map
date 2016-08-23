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
            "$limit" : 100,
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
        var category = crimeData[i].category;
        var address = crimeData[i].address;
        var pddistrict = crimeData[i].pddistrict;
        var resolution = crimeData[i].resolution;
        var time = formatTime(crimeData[i].time);
        var dayofweek = crimeData[i].dayofweek;
        var date = formatDate(crimeData[i].date);
        var icon = makeMarkerIcon(crimeData[i].resolution);
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            category: category,
            address: address,
            pddistrict: pddistrict,
            resolution: resolution,
            dayofweek: dayofweek,
            time: time,
            date: date,
            map: map,
            icon: icon,
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
      InfoWindow.setContent(
        '<p class="markerTitle">' + marker.category + '</p><p>' + marker.title + '</p>' +
        '<p><span>When: </span>'+ marker.dayofweek + ', ' + marker.date + ' at ' + marker.time + '</p>' +
        '<p><span>Address: </span>' + marker.address + '</p>' +
        '<p><span>Police District: </span>' + marker.pddistrict + '</p>' +
        '<p><span>Resolution: </span>' + marker.resolution + '</p>'
        );
      InfoWindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      InfoWindow.addListener('closeclick', function() {
        InfoWindow.marker = null;
      });
    }
}

function makeMarkerIcon(type) {
    var markerImage = {
      url: 'icons/' + type + '.png',
      size: new google.maps.Size(32, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 32),
    //   scaledSize: new google.maps.Size(25, 25)
    };
  return markerImage;
}

function formatTime(time) {
    var hour = parseInt(time[0] + time[1]);
    var minute = time[3] + time[4];
    if (hour > 12) {
        return (hour%12) + ':' + minute + ' PM';
    }
    else {
        return hour + ':' + minute + ' AM';
    }
}

function formatDate(date) {
    var day = date[8] + date[9];
    var month = date[5] + date[6];
    var year = date[0] + date[1] + date[2] + date[3];
    return month + '/' + day + '/' + year;
}

// Knockout.js applyBindings for the View
ko.applyBindings();
