import { useEffect, useState } from 'react';
import { css } from '@emotion/css'

import Header from '../components/Header.jsx';
import Goals from '../components/Goals.jsx';
import DailyChecks from '../components/DailyChecks.jsx';
import Notes from '../components/Notes.jsx';
import Schedule from '../components/Schedule.jsx';
import ProfileForm from '../components/modals/ProfileForm.jsx';
import Tasks from '../components/Tasks.jsx';
import TasksInProgress from '../components/TasksInProgress.jsx';
import MobileNav from '../components/MobileNav.jsx';
import MobileCard from '../components/MobileCard.jsx';
import MobileWeather from '../components/MobileWeather.jsx';
// import MobileProfileForm from '../components/MobileProfileForm.jsx';

import changeColour from '../utils/changeColour.js';
import loggedIn from '../utils/loggedIn.js';
import getTime from '../utils/getTime.js';
import getDateTimezone from '../utils/getDateTimezone.js';

export default function Dashboard() {
  // Date in format: 2024/04/23
  const [today, setToday] = useState('');
  const [time, setTime] = useState('');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  // Date in format: Tuesday, April 23, 2024
  const [fullDate, setFullDate] = useState('');
  const [hour, setHour] = useState('');
  // Data variables
  const [data, setData] = useState()
  // User data
  const [name, setName] = useState('name');
  const [location, setLocation] = useState('Pasadena');
  const [visibility, setVisibility] = useState('hidden');
  const [colourTheme, setColourTheme] = useState();
  const [temperature, setTemperature] = useState('');
  // Loading for dashboard
  const [loading, setLoading] = useState(true);
  // Mobile navigation
  const [mobileCard, setMobileCard] = useState();
  // If Demo Mode
  const [demo, setDemo] = useState(false);

  const getTimezone = () => {
    // Set date according to timezone
    const fetchedTime = getDateTimezone(timezone);
    setToday(`${fetchedTime.year}-${fetchedTime.month}-${fetchedTime.day}`);
    setTime(fetchedTime.timeZoneTime)
    setFullDate(fetchedTime.timeZoneDate);
    setHour(fetchedTime.timeZoneHour);
  }

  const getData = () => {
    fetch(`/api/data/allData/${today}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // console.log(response);
        return response.json(); // or response.text() for text data
      })
      .then((data) => {
        // console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  const getUser = async () => {
    try {
      const response = await fetch('/api/users/getUser');
      if (response.ok) {
        const data = await response.json();
        // Set User Preferences
        setName(data.user.map(user => user.name));
        setLocation(data.user.map(user => user.location));
        setColourTheme(data.user[0].colour);
        setTimezone(data.user[0].timezone);
        setTemperature(data.user[0].temperature);
        if (data.user[0].id === '1') setDemo(true);
      }
    } catch (err) {
      console.error('Error fetching data', err);
    }
  }

  useEffect(() => {
    // Check if logged in
    // Redirect to login page if not logged in
    // Get time through timezone info if logged in
    setLoading(true);
    loggedIn().then((data) => {
      if (data.loggedIn) {
        getTimezone();
      } else {
        window.location.replace('/login')
      }
    })
  }, []);

  useEffect(() => {
    // Fetch data if date changes
    if (today) {
      getData();
      getUser();
      setLoading(false);
    }

    if (timezone) {
      getTimezone();
    }
  }, [today, timezone])

  setTimeout(() => {
    // Set time every minute
    const time = getTime(timezone);
    setTime(time.timeZoneTime);
    setHour(time.timeZoneHour);
  }, 60000)

  useEffect(() => {
    // If user has a colourTheme, change to that colourTheme
    if (colourTheme) {
      setLoading(true)
      changeColour(colourTheme);
      setLoading(false);
    }
  }, [colourTheme])

  const navigate = (id) => {
    setMobileCard(id.split('-')[1]);
  }

  return (
    <div>
      {loading ? (
        <div className={css`width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;`}>
          <img src="/svgs/loading.gif" alt="loading" height="60px" width="60px" />
        </div>
      ) : (
        <div>
          <div id="desktop">
            <Header name={name} location={location} visibility={visibility} setVisibility={setVisibility} fullDate={fullDate} time={time} hour={hour} temperature={temperature} />
            <ProfileForm visibility={visibility} setVisibility={setVisibility} colourTheme={colourTheme} setColourTheme={setColourTheme} getUser={getUser} demo={demo} />

            <main className={css`display: flex; width: 100vw; min-height: 80vh;`}>
              <section id="left" className={css`width: 25%; min-height: 100%;`}>
                <Schedule data={data} fullDate={fullDate} timezone={timezone} today={today} getData={getData} />
              </section>

              <section id="middle" className={css`width: 50%; min-height: 100%;`}>
                <TasksInProgress data={data} getData={getData}today={today} />
                <Tasks data={data} getData={getData} />
              </section>

              <section id="right" className={css`width: 25%; min-height: 100%;`}>
                  <DailyChecks data={data} fullDate={fullDate} today={today} timezone={timezone} getData={getData} />
                  <Goals data={data} goalType="Yearly" getData={getData} />
                  <Notes data={data} getData={getData} />
              </section>
            </main>
          </div>

          <div id="mobile">
            <Header name={name} location={location} visibility={visibility} setVisibility={setVisibility} fullDate={fullDate} time={time} hour={hour} />
            {/*<MobileProfileForm visibility={visibility} setVisibility={setVisibility} colourTheme={colourTheme} setColourTheme={setColourTheme} getData={getData} demo={demo} />*/}
            <div id="mobile-component">
              {mobileCard === '' || mobileCard === 'home' || !mobileCard ? (
                <MobileCard navigate={navigate} />
              ) : null}
              {mobileCard === 'tasks' ? (
                <div>
                  <TasksInProgress data={data} getData={getData} today={today} />
                  <Tasks data={data} getData={getData} />
                </div>
              ) : null}
              {mobileCard === 'checks' ? (
                <div>
                  <DailyChecks data={data} fullDate={fullDate} today={today} timezone={timezone} getData={getData} />
                </div>
              ) : null}
              {mobileCard === 'schedule' ? (
                <div>
                  <Schedule data={data} fullDate={fullDate} timezone={timezone} today={today} getData={getData} />
                </div>
              ) : null}
              {mobileCard === 'goals' ? (
                <div>
                  <Goals data={data} goalType="Weekly" getData={getData} />
                  <Goals data={data} goalType="Monthly" getData={getData} />
                  <Goals data={data} goalType="Yearly" getData={getData} />
                </div>
              ) : null}
              {mobileCard === 'notes' ? (
                <div>
                  <Notes data={data} getData={getData} />
                </div>
              ) : null}
              {mobileCard === 'weather' ? (
                <div>
                  <MobileWeather location={location} temperature={temperature} />
                </div>
              ) : null}
            </div>
            <MobileNav navigate={navigate} />
          </div>
        </div>
      )
      }
    </div>
  )
}