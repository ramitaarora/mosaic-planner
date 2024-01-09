import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

export default function CalendarCard() {
    const [value, setValue] = useState(new Date())

    const clickDay = (event, value) => {
        console.log(event)
    }

    return (
        <div id="calendar" className="card">
            <div id="card-header">
                <h2>Calendar</h2>
            </div>
             <Calendar className="react-calendar" defaultView="month" onClickDay={clickDay}/>
        </div>
    )
}