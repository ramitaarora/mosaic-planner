function formatDate(fullDate) {
    let monthNum = new Date().getMonth();
    let dayNum = new Date().getDay();
    let dateNum = new Date().getDate();
    let hours;
    let month;
    let day;

    if (monthNum === 0) month = 'January';
    if (monthNum === 1) month = 'February';
    if (monthNum === 2) month = 'March';
    if (monthNum === 3) month = 'April';
    if (monthNum === 4) month = 'May';
    if (monthNum === 5) month = 'June';
    if (monthNum === 6) month = 'July';
    if (monthNum === 7) month = 'August';
    if (monthNum === 8) month = 'September';
    if (monthNum === 9) month = 'October';
    if (monthNum === 10) month = 'November';
    if (monthNum === 11) month = 'December';

    if (dayNum === 0) day = 'Sunday';
    if (dayNum === 1) day = 'Monday';
    if (dayNum === 2) day = 'Tuesday';
    if (dayNum === 3) day = 'Wednesday';
    if (dayNum === 4) day = 'Thursday';
    if (dayNum === 5) day = 'Friday';
    if (dayNum === 6) day = 'Saturday';

    if ((String(dateNum)).endsWith('1')) setDate(new Date().getDate() + 'st');
    if ((String(dateNum)).endsWith('2')) setDate(new Date().getDate() + 'nd');
    if ((String(dateNum)).endsWith('3')) setDate(new Date().getDate() + 'rd');
    if (!(String(dateNum)).endsWith('1') && !(String(dateNum)).endsWith('2') && !(String(dateNum)).endsWith('3')) setDate(new Date().getDate() + 'th');

    return;
}; 

module.exports = formatDate;