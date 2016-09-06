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

function formatDate(date) {
    var day = date[8] + date[9];
    var month = date[5] + date[6];
    var year = date[0] + date[1] + date[2] + date[3];
    return month + '/' + day + '/' + year;
}
