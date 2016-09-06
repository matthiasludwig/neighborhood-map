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
        var pdid = crimeData[i].pdid;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            category: category,
            address: address,
            pddistrict: pddistrict,
            pdid: pdid,
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
            highlightListItem(this, true);
        });
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
