/*
* In here is only a small helper function to correctly display the time in the
* infowindow for each marker. The date is handled by the momentjs plugin
*/
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
