import { useState, useEffect } from 'react';

export default function Schedule({ events, setEvents }) {

    return (
        <div id="schedule">
            <div id="card-header">
                <h2>Today's Schedule</h2>
            </div>
            <div>
                <ul>
                {events.map((event, index) =>
                    <li key={index}>{event.event} {event.date} {event.start_time} {event.end_time}</li>
                )}
                </ul>
            </div>
        </div>
    )
}