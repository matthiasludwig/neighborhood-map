/*
Global Variables
*/
var map;
var largeInfowindow;
var selectedItem = ko.observable();
var loadingState = ko.observable(false);
var fromDate = ko.observable(moment().subtract(14, 'days').format('YYYY[-]MM[-]DD'));
var toDate = ko.observable(moment().subtract(14, 'days').format('YYYY[-]MM[-]DD'));
var apiLimit = 500;
var apiLoadingTime;

function init() {
    // Get a Map
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.77493, lng: -122.419416}, // Lat/Lng for San Francisco, CA
    zoom: 13,
    mapTypeControl: false
    });
    // Declare largeInfowindow here for later use
    largeInfowindow = new google.maps.InfoWindow();
    // Knockout applyBindings here to make sure Google Maps API is loaded when invoked
    ko.applyBindings(new ViewModel());
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
         date: moment(data.date).format("MMMM Do YYYY"),
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
            else {
                x.marker.setMap(map);
                return x.marker
            }
        }
    });
    this.numberIncidents = ko.computed(function() {
        return ("has " + self.filteredData().length + " incidents.");
    });
    this.percentageIncidents = ko.computed(function() {
        var temp = (self.filteredData().length) / (self.crimeData().length) * 100;
        return "That is " + temp.toFixed(2) + "% of total incidents.";
    });


    this.getData = function(fromDate, toDate, limit) {
       $.ajax({
           url: "https://data.sfgov.org/resource/cuks-n6tp.json",
           type: "GET",
           data: {
               "$limit" : limit,
               "$where" : "date between '"+ fromDate() +"T00:00:00' and '" + toDate() + "T00:00:00'",
               "$order" : "date DESC",
               "$$app_token" : "FOWqIJ6wgZFV3PBnSg7DKip6V"
           },
           // Loading animation
           beforeSend: function(){
               loadingState(true);
               apiLoadingTime = setTimeout(function(){
                   console.log("It takes unusally long to get data from the API."); }, 7000);
           },
           success: function(data){
               console.log(data);
               data.forEach(function(data){
                   self.crimeData.push(new Marker(data));
               });
           },
           // Hiding the loading animation
           complete: function(data){
               loadingState(false);
               clearTimeout(apiLoadingTime);
           },
           error: function(jqXHR, textStatus, errorThrown){
               console.log("jqXHR is " + jqXHR);
               console.log("textStatus is " + textStatus);
               console.log("errorThrown is " + errorThrown);

               alert("SF Open Data API is can not be reached. Please try again later!")
               console.log("SF Open Data API could not be loaded");
           }
       });
    }
    this.newData = function() {
        console.log("FROM is " + fromDate());
        console.log("TO is " + toDate());
        self.clearData(self.crimeData);
        self.getData(fromDate, toDate, apiLimit);
    }

    this.clearData = function(data) {
        self.filteredData().forEach(function(data){
            data.marker.setMap(null);
        });
        data([]);
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

    // Start the app
    this.getData(fromDate, toDate, apiLimit);
}
