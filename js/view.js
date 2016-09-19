/*
In view.js all functions are declared that have to be handled outside the KO ViewModel
This is mainly anything that will be displayed in the Google Maps portion of the page
*/

function populateInfoWindow(marker, InfoWindow) {
    if (InfoWindow.marker != marker) {
      InfoWindow.marker = marker;
      InfoWindow.setContent(
        '<p class="markerTitle">' + marker.category + '</p><p style="text-align:center;">' + marker.title + '</p>' +
        '<p><span>When: </span>'+ marker.dayofweek + ', ' + marker.date + ' at ' + marker.time +'</p>' +
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
    // Checks if the icon is available and falls back to an icon if it is not available
    switch (type) {
        case "ARREST, BOOKED":
            break;
        case "ARREST, CITED":
            break;
        case "JUVENILE, BOOKED":
            break;
        case "ARREST, BOOKED":
            break;
        case "NONE":
            break;
        case "active":
            break;
        default:
        // This is due to the fact that the API has not a complete list of possible resolutions
            mixpanel.track("Marker Icon was not defined: " + type);
            type = "NOT AVAILABLE";
    }
    var markerImage = {
      url: 'icons/' + type + '.png',
      size: new google.maps.Size(32, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 32),
    };
  return markerImage;
}

function highlightListItem(marker, scrollIntoView) {
    selectedItem(marker.pdid);
    $('#resultList').show();
    $('.sidebar').toggleClass('open');
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
        marker.setAnimation(null);}, 2300);
    if (scrollIntoView) {
        var loc = document.getElementsByClassName('itemSelect');
        loc[0].scrollIntoView(true);
    }
}
// Error handling in case the Goolge Maps api can not be reached
function googleError() {
    mixpanel.track("Google Maps Data Request Error: Google Maps not accesible");
    window.alert("The Google Maps API could not be loaded. Please try again later!");
}
