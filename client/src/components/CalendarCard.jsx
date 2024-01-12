import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import CalendarClick from './CalendarClick';

export default function CalendarCard() {
    const [value, setValue] = useState(new Date())

    const clickDay = (event, value) => {
        console.log(event)
    }

    return (
        <div id="calendar">
            <div id="card-header">
                <h2>Calendar</h2>
            </div>
             <Calendar className="react-calendar" defaultView="month" onClickDay={clickDay}/>
             <CalendarClick />
        </div>
    )
}