import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import getMonth from '../utils/getMonth';

export default function MobileWeather({ location, temperature }) {
    // Loading variable
    const [loading, setLoading] = useState(false);
    // Variables to set current weather
    const [city, setCity] = useState();
    const [forecast, setForecast] = useState();
    const [temp, setTemp] = useState();
    const [icon, setIcon] = useState();
    // Variable to set the next days' forecast
    const [nextWeatherData, setNextWeatherData] = useState([])

    const getWeather = () => {
        // Fetch weather data from Open Weather API using user's location and set data to variables
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
                getWeatherForecast(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    const getWeatherForecast = (data) => {
        // Search through the data for the weather at 3pm and use this to set the forecast for the following days
        setNextWeatherData([]);
        for (let i = 1; i < data.list.length; i++) {
            if (data.list[i].dt_txt.split(' ')[1] === '15:00:00') {

                let currentDate = data.list[i].dt_txt.split(' ')[0];
                let dayNum = new Date(currentDate).getDay();

                setNextWeatherData((prev) => [...prev, {
                    day: getMonth(dayNum),
                    temp: data.list[i].main.temp,
                    weather: data.list[i].weather[0].main,
                    icon: `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`
                }])
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        // Fetch weather data and set loading states accordingly
        setLoading(true);
        getWeather();
    }, []);

    return (
        <div id="mobile-weather-div" className="card">
            {loading ? (
                <img src="/svgs/loading.gif" alt="loading" height="60px" width="60px" />
            ) : (
                <div className={css`display: flex; justify-content: center; align-items: center; flex-direction: column;`}>
                    <div id="weather-1" className={css`width: 100%; display: flex; justify-content: center; align-items: center;`}>
                        <h2>Weather for {city}</h2>
                    </div>
                    <div id="weather-2" className={css` width: fit-content; display: flex; justify-content: space-evenly; align-items: center;`}>
                        <img src={icon} alt={forecast} height="100px" width="100px" />
                        <div className={css`text-align: left;`}>
                            {temperature === 'F' ? <p>{(Math.trunc((temp - 273.15) * (9 / 5) + 32))}°F</p> : <p>{(Math.trunc((temp - 273.15)))}°C</p>}
                            <p>{forecast}</p>
                        </div>
                    </div>
                    {nextWeatherData.length &&
                        nextWeatherData.map((data, index) => (
                            <div className="weather-line" key={index}>
                                <div className="weather-line-item">
                                    <p>{data.day}</p>
                                </div>
                                <div className="weather-line-item">
                                    <img src={data.icon} alt={data.weather} />
                                    <div className={css`display: flex; flex-wrap: wrap; align-items: center; justify-content: space-evenly; width: 50%; flex-direction: column;`}>
                                        <p>{data.weather}</p>
                                        {temperature === 'F' ? <p>{(Math.trunc((temp - 273.15) * (9 / 5) + 32))}°F</p> : <p>{(Math.trunc((temp - 273.15)))}°C</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    )
}