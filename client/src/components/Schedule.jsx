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
                    <div key={index} id="line">
                            <div id="each-event">
                                <li>{event.event}</li>
                                <p>{event.start_time}-{event.end_time}</p>
                            </div>
                            <div id="edit-buttons">
                                <img src="./svgs/edit.svg" alt="edit" />
                                <img src="./svgs/delete.svg" alt="edit" />
                            </div>
                    </div>
                )}
                </ul>
            </div>
        </div>
    )
}