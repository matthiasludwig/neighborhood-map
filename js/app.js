// Global Variables declared
var map;
var largeInfowindow;
var selectedItem = ko.observable();
var loadingState = ko.observable(false);
var fromDate = ko.observable(moment().subtract(16, 'days').format('YYYY[-]MM[-]DD'));
var toDate = ko.observable(moment().subtract(16, 'days').format('YYYY[-]MM[-]DD'));
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
};

// ViewModel is defined here
var ViewModel = function(){
    var self = this;

    this.crimeData = ko.observableArray(); // This is the array that contains ALL markers that came from the server
    this.policeDistricts = ko.observableArray([
        "All", "BAYVIEW", "CENTRAL", "INGLESIDE", "MISSION", "NORTHERN", "PARK", "RICHMOND", "SOUTHERN", "TARAVAL", "TENDERLOIN" // The Police Districts are hard coded
    ]);
    this.filter = ko.observable("All"); // By default the filter shows all police districts with its incidents
    this.filteredData = this.crimeData.filter(function(x) {
        if (self.filter() === "All") {
            x.marker.setMap(map); // Sets all markers on the map
            return x; // Returns all the markers
        }
        else {
            if (x.marker.pddistrict !== self.filter()) {
                x.marker.setMap(null); // If the marker is from a police district that is not selected, the marker is taken from the map
            }
            else {
                x.marker.setMap(map); // Only marker where the police district equals the current selection is return to the list...
                return x.marker // ... AND put on the map
            }
        }
    });
    /* The following two computed observable are merely giving some granular "stastic" about the number of incidents for the selected police district
    as well as the percentage of the total incidents*/
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
                   console.log("It takes unusually long to get data from the API.");
                   mixpanel.track("AJAX Data Request takes longer than 7sec");
               }, 7000);
           },
           success: function(data){
               mixpanel.track("AJAX Data Request success");
               // Error handling if start date is after end date AND/OR the selection does not return any data
               if (data.length === 0) {
                   window.alert("An Error has occurred! Please check your date Settings. Be aware that the available data is trailing the current day by approx. 10 days.");
                   return;
               }
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
               //Error logging to the console and depending on the thrown error a different alert is shown to the user
               console.log("### ERROR LOGGING ###");
               console.log("jqXHR is " + jqXHR);
               console.log("textStatus is " + textStatus);
               console.log("errorThrown is " + errorThrown);
               switch (errorThrown) {
                   case "Bad Request":
                       // window.alert("An Error has occurred. Please check your values in the Settings menu!");
                       window.alert("The City of San Francisco has temporarily disabled the crime data API. As soon as the API is functional again Crimemap.org will be updated.");
                       mixpanel.track("AJAX Data Request Error: Bad Request");
                       break;
                   case "":
                        window.alert("The SF Open Data API is not accesible right now. Please try again later!")
                        mixpanel.track("AJAX Data Request Error: Not accesible now");
                        break;
                   default:
                    window.alert("An unknown Error with the SF Open Data API has occured.");
                    mixpanel.track("AJAX Data Request Error: Default Error");
               }
           }
       });
    }
    // this function is called when the "Update" button under settings is pressed
    this.newData = function() {
        // This is a fallback of sorts, since mobile Safari is not respecting the min/max attribute of the html input field
        if (apiLimit < 0 || apiLimit > 3500)
        {
            mixpanel.track("Number over 3500 OR under 0 selected by user");
            window.alert("Please choose a value between 0 and 3500 for the API Limit in the Settings view");
        }
        self.clearData(self.crimeData);
        self.getData(fromDate, toDate, apiLimit);
    }
    // If the time frame is updated in the settings view, the former array is emptied and all markers are taken off the map
    this.clearData = function(data) {
        self.filteredData().forEach(function(data){
            data.marker.setMap(null);
        });
        data([]);
    }
    // Animates a marker when the mouse cursor hovers of the list item
    this.mouseOver = function(listItem) {
        var highlighted = "active";
        listItem.marker.icon = makeMarkerIcon(highlighted);
        listItem.marker.setMap(map);
    }
    // If the mouse cursor leaves the list item the marker is set to its default icon
    this.mouseOut = function(listItem) {
        listItem.marker.icon = makeMarkerIcon(listItem.marker.resolution);
        listItem.marker.setMap(map);
    }
    // When a marker is clicked the list item is highlighted and zommed to on the map
    this.clickItem = function(listItem) {
        mixpanel.track("Marker OR List item was clicked");
        highlightListItem(listItem.marker, false); // false means it does not scroll the selected list item into view
        map.setZoom(15);
        map.panTo(listItem.marker.position);
        populateInfoWindow(listItem.marker, largeInfowindow);
    }
    // Start the app
    this.getData(fromDate, toDate, apiLimit);
}
