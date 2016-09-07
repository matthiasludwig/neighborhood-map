function getData() {
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
           // console.log(data);
           createMarker(data);
       },
       complete: function(data){
           // Hiding the loading animation
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
