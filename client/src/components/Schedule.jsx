import { useState, useEffect } from 'react';
import { gapi } from "gapi-script";

export default function Schedule() {
    const calendarID = process.env.REACT_APP_CALENDAR_ID;
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const accessToken = process.env.REACT_APP_GOOGLE_ACCESS_TOKEN;
    
    return (
        <div id="schedule">
            <div id="card-header"><h2>Schedule</h2></div>
            
            
        </div>
    )
}