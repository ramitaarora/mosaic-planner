import { useState, useEffect } from 'react';

export default function Header({ name, location }) { 
    const [hours, setHours] = useState(new Date().getHours() % 12 || 12);
    const [minutes, setMinutes] = useState(new Date().getMinutes());
    const [seconds, setSeconds] = useState(new Date().getSeconds());

    const [month, setMonth] = useState(new Date().getMonth())
    const [day, setDay] = useState(new Date().getDay());
    const [date, setDate] = useState(new Date().getDate());
    const [year, setYear] = useState(new Date().getFullYear());

    const [city, setCity] = useState();
    const [forecast, setForecast] = useState();
    const [temp, setTemp] = useState();
    const [icon, setIcon] = useState();

    useEffect(() => {
        let monthNum = new Date().getMonth();
        let dayNum = new Date().getDay();
        let dateNum = new Date().getDate();

        if (monthNum === 0) setMonth('January');
        if (monthNum === 1) setMonth('February');
        if (monthNum === 2) setMonth('March');
        if (monthNum === 3) setMonth('April');
        if (monthNum === 4) setMonth('May');
        if (monthNum === 5) setMonth('June');
        if (monthNum === 6) setMonth('July');
        if (monthNum === 7) setMonth('August');
        if (monthNum === 8) setMonth('September');
        if (monthNum === 9) setMonth('October');
        if (monthNum === 10) setMonth('November');
        if (monthNum === 11) setMonth('December');

        if (dayNum === 0) setDay('Sunday');
        if (dayNum === 1) setDay('Monday');
        if (dayNum === 2) setDay('Tuesday');
        if (dayNum === 3) setDay('Wednesday');
        if (dayNum === 4) setDay('Thursday');
        if (dayNum === 5) setDay('Friday');
        if (dayNum === 6) setDay('Saturday');

        if ((String(dateNum)).endsWith('1')) setDate(new Date().getDate() + 'st');
        if ((String(dateNum)).endsWith('2')) setDate(new Date().getDate() + 'nd');
        if ((String(dateNum)).endsWith('3')) setDate(new Date().getDate() + 'rd');
        if (!(String(dateNum)).endsWith('1') && !(String(dateNum)).endsWith('2') && !(String(dateNum)).endsWith('3')) setDate(new Date().getDate() + 'th');

    }, [])

    setTimeout(() => {
        let eachSecond = new Date().getSeconds();
        let eachMinute = new Date().getMinutes()
        setHours(new Date().getHours() % 12 || 12);

        if (eachSecond < 10) {
            setSeconds('0' + new Date().getSeconds())
        } else if (eachSecond > 9) {
            setSeconds(new Date().getSeconds());
        }

        if (eachMinute < 10) {
            setMinutes('0' + new Date().getMinutes());
        } else if (eachMinute > 9) {
            setMinutes(new Date().getMinutes());
        }

    }, 1000)

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=f2e334424bc1375278888844b225e7a5`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // or response.text() for text data
          })
          .then((data) => {
            // console.log(data);
            setCity(data.city.name);
            setTemp(data.list[0].main.temp);
            setForecast(data.list[0].weather[0].description)
            setIcon(`http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`)
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, []);

    const logout = async () => {
        const response = await fetch('/api/users/logout', {
            method: 'POST',
        })
        if (response.ok) {
            window.location.replace('/');
        } else {
            console.error(response.statusText);
        }
    }

    return (
        <header>
            <div id="navigation">
                <ul>
                    <li onClick={logout}>Logout</li>
                </ul>
            </div>

            <div id="today">
                <h1 id="today">Good Morning, {name}</h1>
                <p id="current-day">{day}, {month} {date}, {year}</p>
                <p id="current-time">{hours}:{minutes}:{seconds}</p>
            </div>
            
            <div id="weather">
                <div id="weather-1">
                    <p>Weather for {location}</p> 
                    <img src={icon} alt={forecast} height="50px" width="50px"/> 
                </div>
                <div id="weather-2">
                    <p>{(Math.trunc((temp - 273.15) * (9/5) + 32))}° F</p>
                    <p>{forecast}</p>
                </div>
            </div>
        </header>
    );
}