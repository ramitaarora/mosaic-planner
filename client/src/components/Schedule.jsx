import { useState, useEffect } from 'react';

export default function Schedule() {
    const accessToken = process.env.REACT_APP_GOOGLE_ACCESS_TOKEN;
    const calID = process.env.REACT_APP_CALENDAR_ID;

    useEffect(() => {
        const response = fetch(`https://www.googleapis.com/calendar/v3/calendars/${calID}/events`, {
            method: 'GET',
            Host: 'www.googleapis.com',
            Authorization: 'Bearer ' + accessToken,
            headers: { 
                'Content-Type': 'application/json',
                'Content-Length': 0
            },
        })

        if (response.ok) {
            console.log(response)
        } else {
            console.log(response)
        }
        
    }, [])

    return (
        <div id="schedule">
            <div id="card-header">
                <h2>Schedule</h2>
            </div>
        </div>
    )
}