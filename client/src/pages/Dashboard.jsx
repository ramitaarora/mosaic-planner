import { useEffect, useState } from 'react';
import { css } from '@emotion/css'

// Tabs
import DashTab from '../components/tabs/DashTab.jsx';
import Projects from '../components/tabs/Projects.jsx';
import NotesTab from '../components/tabs/NotesTab.jsx';

// Components
import ProfileForm from '../components/modals/ProfileForm.jsx';
import Header from '../components/Header.jsx';
import MobileDash from '../components/mobile/MobileDash.jsx';

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
  // Data variable
  const [data, setData] = useState()
  // User data
  const [name, setName] = useState('name');
  const [location, setLocation] = useState('Pasadena');
  const [visibility, setVisibility] = useState('hidden');
  const [colourTheme, setColourTheme] = useState();
  const [temperature, setTemperature] = useState('');
  // Loading for dashboard
  const [loading, setLoading] = useState(true);
  // If Demo Mode
  const [demo, setDemo] = useState(false);
  // Tab navigation
  const [currentTab, setCurrentTab] = useState('dash-tab');

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
        window.location.replace('/')
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

  const changeTab = (event) => {
    // Remove active mode on all tabs
    const allTabs = document.getElementById('tab-slots').childNodes;
    for (let i = 0; i < allTabs.length; i++) {
      document.getElementById(`${allTabs[i].id}`).setAttribute('class', 'inactive-tab');
    }
    // Set active tab to changed tab
    document.getElementById(event.target.id).setAttribute('class', 'active-tab');

    // Set current tab to id of clicked tab
    setCurrentTab(event.target.id);
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

            <div id="tabs">
              <div id="tab-slots">
                <span id="dash-tab" className="active-tab" onClick={changeTab}>Dash</span>
                <span id="projects-tab" onClick={changeTab}>Projects</span>
                <span id="notes-tab" onClick={changeTab}>Notes</span>
              </div>
                {currentTab === 'dash-tab' && <DashTab data={data} fullDate={fullDate} timezone={timezone} today={today} getData={getData} />}
                {currentTab === 'projects-tab' && <Projects />}    
                {currentTab === 'notes-tab' && <NotesTab />}         
            </div>
          </div>
            <div id="mobile">
              <Header name={name} location={location} visibility={visibility} setVisibility={setVisibility} fullDate={fullDate} time={time} hour={hour} />
              <MobileDash data={data} getData={getData} today={today} fullDate={fullDate} timezone={timezone} location={location} temperature={temperature} />
            </div>
        </div>
      )
      }
    </div>
  )
}