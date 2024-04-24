import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Weather from './Weather';
import { css } from '@emotion/css';

export default function Header({ name, location, visibility, setVisibility, fullDate, time, hour }) {
    const [greeting, setGreeting] = useState('Hello');

    useEffect(() => {
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
        <header className={css`width: 100%; display: flex; justify-content: center; align-items: center; padding: 10px; text-align: center; `}>

            <Weather location={location} />

            <div id="today" className={css`width: 34%; height: 80px; display: flex; justify-content: space-evenly; align-items: center; flex-direction: column;`}>
                <h1 id="today">{greeting}, {name}</h1>
                <p id="current-day">{fullDate} • {time}</p>
            </div>

            <Navigation visibility={visibility} setVisibility={setVisibility} />
        </header>
    );
}