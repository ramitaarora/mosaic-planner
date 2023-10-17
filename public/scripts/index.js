// Today's Date and Time

var currentDay = document.querySelector('#current-day');
var currentTime = document.querySelector('#current-time');
var today = dayjs().format('dddd, MMMM D');
var time = Number(dayjs().format('HH:MM A'));

function setOrdinal() {
    if (today.slice(-1) == 1) {
        currentDay.append('st');
    } else if (today.slice(-1) == 2) {
        currentDay.append('nd');
    } else if (today.slice(-1) == 3) {
        currentDay.append('rd');
    } else {
        currentDay.append('th');
    }
} 

currentDay.innerHTML = today;
currentTime.innerHTML = time;
setOrdinal();