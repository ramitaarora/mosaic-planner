import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
// import CalendarClick from './CalendarClick';

export default function CalendarCard() {
    const [events, setEvents] = useState('');

    const clickDay = async (event, value) => {
        const fullDateArray = String(event).split(' ');
        let month = fullDateArray[1];
        let day = fullDateArray[2];
        let year = fullDateArray[3];
        let monthNum = 0;

        console.log(value.target)
        const el = document.querySelector(`[aria-label="${value.target.ariaLabel}"]`);
        el.setAttribute('class', 'active')

        if (month === 'Jan') monthNum = 1;
        if (month === 'Feb') monthNum = 2;
        if (month === 'Mar') monthNum = 3;
        if (month === 'Apr') monthNum = 4;
        if (month === 'May') monthNum = 5;
        if (month === 'Jun') monthNum = 6;
        if (month === 'Jul') monthNum = 7;
        if (month === 'Aug') monthNum = 8;
        if (month === 'Sep') monthNum = 9;
        if (month === 'Oct') monthNum = 10;
        if (month === 'Nov') monthNum = 11;
        if (month === 'Dec') monthNum = 12;
        
        const response = await fetch('/api/data/event', {
            method: 'POST',
            body: JSON.stringify({
                month: monthNum,
                day: day,
                year: year
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // console.log(response);
            return response.json(); // or response.text() for text data
          })
          .then((data) => {
            setEvents(data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
    }

    return (
        <div id="calendar">
            <div id="card-header">
                <h2>Calendar</h2>
            </div>
             <Calendar className="react-calendar" defaultView="month" onClickDay={clickDay}/>
        </div>
    )
}