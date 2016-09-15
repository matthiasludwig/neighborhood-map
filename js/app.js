/*
Global Variables
*/
var map;
var largeInfowindow;
var selectedItem = ko.observable();


function init() {
    console.log("init() has been called");
    // Get a Map
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.77493, lng: -122.419416}, // Lat/Lng for San Francisco, CA
    zoom: 13,
    mapTypeControl: false
    });
    //Declare largeInfowindow here for later use
    largeInfowindow = new google.maps.InfoWindow();
}

var Marker = function(data) {
    // Create a marker per location, and put into markers array.
    this.marker = new google.maps.Marker({
         position: {lat: parseFloat(data.y), lng: parseFloat(data.x)},
         title: data.descript,
         category: data.category,
         address: data.address,
         pddistrict: data.pddistrict,
         pdid: data.pdid,
         resolution: data.resolution,
         dayofweek: data.dayofweek,
         time: formatTime(data.time),
         map: map,
         date: formatDate(data.date),
         icon: makeMarkerIcon(data.resolution),
         animation: google.maps.Animation.DROP,
         id: data.i
    });
    this.marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
        highlightListItem(this, true);
    });
}

var ViewModel = function(){
    var self = this;

    this.crimeData = ko.observableArray();
    this.policeDistricts = ko.observableArray([
        "All", "BAYVIEW", "CENTRAL", "INGLESIDE", "MISSION", "NORTHERN", "PARK", "RICHMOND", "SOUTHERN", "TARAVAL", "TENDERLOIN"
    ]);
    this.filter = ko.observable("All");
    this.filteredData = this.crimeData.filter(function(x) {
        if (self.filter() == "All") {
            x.marker.setMap(map);
            return x;
        }
        else {
            if (x.marker.pddistrict != self.filter()) {
                x.marker.setMap(null);
            }
            else if (x.marker.pddistrict === self.filter()) {
                x.marker.setMap(map);
                return x.marker
            }
        }
    });

    // this.setMap = function(map) {
    //      for (var i = 0; i < self.filteredData.length; i++) {
    //          self.filteredData[i].setMap(map);
    //      }
    //  }

    this.getData = function() {
       console.log("getData() has been called");
       $.ajax({
           url: "https://data.sfgov.org/resource/cuks-n6tp.json",
           type: "GET",
           data: {
               "$limit" : 1000,
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

    this.mouseOver = function(listItem) {
        var highlighted = "active";
        listItem.marker.icon = makeMarkerIcon(highlighted);
        listItem.marker.setMap(map);
    }

    this.mouseOut = function(listItem) {
        listItem.marker.icon = makeMarkerIcon(listItem.marker.resolution);
        listItem.marker.setMap(map);
    }

    this.clickItem = function(listItem) {
        highlightListItem(listItem.marker, false);
        map.setZoom(15);
        map.panTo(listItem.marker.position);
        populateInfoWindow(listItem.marker, largeInfowindow);
    }

    //Get the party started!
    this.getData();
}

// Knockout.js applyBindings for the View
ko.applyBindings(new ViewModel());
