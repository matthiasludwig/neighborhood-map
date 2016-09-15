/*
Global Variables
*/
var map;

function init() {
    console.log("init() has been called");
    // Get a Map
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.77493, lng: -122.419416}, // Lat/Lng for San Francisco, CA
    zoom: 13,
    mapTypeControl: false
  });
}

var Marker = function(data) {
    // Create a marker per location, and put into markers array.
    this.marker = new google.maps.Marker({
         position: {lat: parseFloat(data.y), lng: parseFloat(data.x)},
         title: data.category,
         category: data.category,
         address: data.address,
         pddistrict: data.pddistrict,
         pdid: data.pdid,
         resolution: data.resolution,
         dayofweek: data.dayofweek,
         time: data.time,
         map: map,
         date: data.date,
         icon: data.icon,
         animation: google.maps.Animation.DROP,
         id: data.i
    });
    this.marker.addListener('click', function() {
        // populateInfoWindow(this, largeInfowindow);
        // highlightListItem(this, true);
        console.log(this.category);
    });
}

var ViewModel = function() {
    var self = this;

    this.crimeData = ko.observableArray();


    this.getData = function() {
       console.log("getData() has been called");
       $.ajax({
           url: "https://data.sfgov.org/resource/cuks-n6tp.json",
           type: "GET",
           data: {
               "$limit" : 100,
               "$where" : "date between '2016-08-08T00:00:00' and '2016-08-09T00:00:00'",
               "$order" : "date DESC",
               "$$app_token" : "FOWqIJ6wgZFV3PBnSg7DKip6V"
           },
           // Loading animation
           beforeSend: function(){
               $('.menu').toggle();
               $('#loadingData').show();
               $('body').css("cursor", "progress");
           },
           success: function(data){
               // TODO: DELETE. Just for debugging
               console.log("Retrieved " + data.length + " records from the dataset!");
               console.log(data);
               data.forEach(function(data){
                   self.crimeData.push(new Marker(data));
               });
           },
           // Hiding the loading animation
           complete: function(data){
               $('#loadingData').hide();
               $('.menu').toggle();
               $('body').css("cursor", "default");
           },
           error: function(){
               // TODO Implement Error Handling for failing of ajax Request
               console.log("API could not be loaded");
           }
       });
    }
    this.getData();
}

// Knockout.js applyBindings for the View
ko.applyBindings(new ViewModel());





/*
Notepad for code
To be used later!
*/




// var largeInfowindow;

    // Fill Variable for InfoWindow (used later)

    // largeInfowindow = new google.maps.InfoWindow();


    // function populateInfoWindow(marker, InfoWindow) {
    //     if (InfoWindow.marker != marker) {
    //       InfoWindow.marker = marker;
    //       InfoWindow.setContent(
    //         '<p class="markerTitle">' + marker.category + '</p><p style="text-align:center;">' + marker.title + '</p>' +
    //         '<p><span>When: </span>'+ marker.dayofweek + ', ' + marker.date + ' at ' + marker.time + '</p>' +
    //         '<p><span>Address: </span>' + marker.address + '</p>' +
    //         '<p><span>Police District: </span>' + marker.pddistrict + '</p>' +
    //         '<p><span>Resolution: </span>' + marker.resolution + '</p>'
    //         );
    //       InfoWindow.open(map, marker);
    //       // Make sure the marker property is cleared if the infowindow is closed.
    //       InfoWindow.addListener('closeclick', function() {
    //         InfoWindow.marker = null;
    //       });
    //     }
    // }

    // function makeMarkerIcon(type) {
    //     var markerImage = {
    //       url: 'icons/' + type + '.png',
    //       size: new google.maps.Size(32, 32),
    //       origin: new google.maps.Point(0, 0),
    //       anchor: new google.maps.Point(0, 32),
    //     };
    //   return markerImage;
    // }
    //
    // function mouseOver(listItem) {
    //     var highlighted = "active";
    //     listItem.icon = makeMarkerIcon(highlighted);
    //     listItem.setMap(map);
    // }
    //
    // function mouseOut(listItem) {
    //     listItem.icon = makeMarkerIcon(listItem.resolution);
    //     listItem.setMap(map);
    // }
    //
    // function clickItem(listItem) {
    //     highlightListItem(listItem, false);
    //     map.setZoom(15);
    //     map.panTo(listItem.position);
    //     populateInfoWindow(listItem, largeInfowindow);
    // }
    //
    // function highlightListItem(marker, scrollIntoView) {
    //     selectedItem(marker.pdid);
    //     $('#resultList').show();
    //     if (scrollIntoView) {
    //         var loc = document.getElementsByClassName('itemSelect');
    //         loc[0].scrollIntoView(true);
    //     }
    // }
