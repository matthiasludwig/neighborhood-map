/*
Global Variables
*/
var map;
// var largeInfowindow;

function init() {
    console.log("init() has been called");
    // Fill Variable for InfoWindow (used later)
    // largeInfowindow = new google.maps.InfoWindow();
    // Get a Map
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.77493, lng: -122.419416}, // Lat/Lng for San Francisco, CA
    zoom: 13,
    mapTypeControl: false
  });
 }

var ViewModel = function() {
    var self = this;

    this.getData = function() {
       console.log("getData() has been called with these parameters: ");
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

    function createMarker(crimeData) {
        for (var i = 0, j = crimeData.length; i < j; i++) {
            this.position = {lat: parseFloat(crimeData[i].y), lng: parseFloat(crimeData[i].x)};
            this.title = crimeData[i].descript;
            this.category = crimeData[i].category;
            this.address = crimeData[i].address;
            this.pddistrict = crimeData[i].pddistrict;
            this.resolution = crimeData[i].resolution;
            this.time = formatTime(crimeData[i].time);
            this.dayofweek = crimeData[i].dayofweek;
            this.date = formatDate(crimeData[i].date);
            this.icon = makeMarkerIcon(crimeData[i].resolution);
            this.pdid = crimeData[i].pdid;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: this.position,
                title: this.title,
                category: this.category,
                address: this.address,
                pddistrict: this.pddistrict,
                pdid: this.pdid,
                resolution: this.resolution,
                dayofweek: this.dayofweek,
                time: this.time,
                map: this.map,
                date: this.date,
                icon: this.icon,
                animation: google.maps.Animation.DROP,
                id: this.i
            });
            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfowindow);
                highlightListItem(this, true);
            });
            sourceData.push(marker);
        }
    }

    function populateInfoWindow(marker, InfoWindow) {
        if (InfoWindow.marker != marker) {
          InfoWindow.marker = marker;
          InfoWindow.setContent(
            '<p class="markerTitle">' + marker.category + '</p><p style="text-align:center;">' + marker.title + '</p>' +
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
        };
      return markerImage;
    }

    function mouseOver(listItem) {
        var highlighted = "active";
        listItem.icon = makeMarkerIcon(highlighted);
        listItem.setMap(map);
    }

    function mouseOut(listItem) {
        listItem.icon = makeMarkerIcon(listItem.resolution);
        listItem.setMap(map);
    }

    function clickItem(listItem) {
        highlightListItem(listItem, false);
        map.setZoom(15);
        map.panTo(listItem.position);
        populateInfoWindow(listItem, largeInfowindow);
    }

    function highlightListItem(marker, scrollIntoView) {
        selectedItem(marker.pdid);
        $('#resultList').show();
        if (scrollIntoView) {
            var loc = document.getElementsByClassName('itemSelect');
            loc[0].scrollIntoView(true);
        }
    }

}

// Knockout.js applyBindings for the View
ko.applyBindings(new ViewModel());
