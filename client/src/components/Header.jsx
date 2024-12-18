import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Weather from './Weather';
import { css } from '@emotion/css';

export default function Header({ name, location, visibility, setVisibility, fullDate, time, hour, temperature }) {
    // State variable for greeting at the top of the header
    const [greeting, setGreeting] = useState('Hello');

    useEffect(() => {
        // Set the greeting based on the time of day
        let theHour = hour.split(':')[0];

        if (theHour < 12) {
            setGreeting('Good morning');
        }

        if (theHour >= 12 && theHour < 17) {
            setGreeting('Good afternoon');
        }

        if (theHour >= 17) {
            setGreeting('Good evening')
        }

    }, [])

    return (
        <header className={css`width: 100%; display: flex; justify-content: center; align-items: center; text-align: center; height: 10vh;`}>

            <Weather location={location} temperature={temperature} />

            <div id="today" className={css`width: 34%; height: 80px; display: flex; justify-content: space-evenly; align-items: center; flex-direction: column;`}>
                <h1 id="today">{greeting}, {name}</h1>
                <p id="current-day">{fullDate} • {time}</p>
            </div>

            <Navigation visibility={visibility} setVisibility={setVisibility} />
        </header>
    );
}