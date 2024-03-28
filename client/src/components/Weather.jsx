import { useState, useEffect } from 'react';
import { css } from '@emotion/css';

export default function Weather({ location }) {
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState();
    const [forecast, setForecast] = useState();
    const [temp, setTemp] = useState();
    const [icon, setIcon] = useState();

    useEffect(() => {
        setLoading(true);
        fetch(`/api/data/weather/${location}`)
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
                setIcon(`https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`)
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [location]);

    return (
        <div id="weather" className={css` width: 33%;`}>
            {loading ? (
                <img src="/svgs/loading.gif" alt="loading" height="60px" width="60px" />
            ) : (
                <div className={css`display: flex; justify-content: center; align-items: center; flex-direction: column;`}>
                    <div id="weather-1" className={css`width: 100%; display: flex; justify-content: center; align-items: center;`}>
                        <p>Weather for {city}</p>
                        <img src={icon} alt={forecast} height="50px" width="50px" />
                    </div>
                    <div id="weather-2" className={css` width: 50%; display: flex; justify-content: space-evenly; align-items: center;`}>
                        <p>{(Math.trunc((temp - 273.15) * (9 / 5) + 32))}° F</p>
                        <p>{forecast}</p>
                    </div>
                </div>
            )}
        </div>
    )
}