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
