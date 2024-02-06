import { useEffect, useState } from 'react';
import { css } from '@emotion/css'

import Header from '../components/Header.jsx';
import Goals from '../components/Goals.jsx';
import DailyChecks from '../components/DailyChecks.jsx';
import Notes from '../components/Notes.jsx';
import Schedule from '../components/Schedule.jsx';
import ProfileForm from '../components/ProfileForm.jsx';

export default function Dashboard() {
  const [yearGoals, setYearGoals] = useState([]);
  const [monthGoals, setMonthGoals] = useState([]);
  const [weekGoals, setWeekGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [checks, setChecks] = useState([]);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('name')
  const [location, setLocation] = useState('Pasadena')
  const [visibility, setVisibility] = useState('hidden');
  const [colourTheme, setColourTheme] = useState();

  const getData = () => {
    fetch('/api/data/allData')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // console.log(response);
        return response.json(); // or response.text() for text data
      })
      .then((data) => {
        // console.log(data);
        setYearGoals(data.goals.filter(goal => goal.goal_type === 'Yearly'));
        setMonthGoals(data.goals.filter(goal => goal.goal_type === 'Monthly'));
        setWeekGoals(data.goals.filter(goal => goal.goal_type === 'Weekly'));
        setNotes(data.notes.map(note => note));
        setChecks(data.dailyChecks.map(check => check));
        setName(data.user.map(user => user.name));
        setLocation(data.user.map(user => user.location));
        setEvents(data.events.map(event => event));
        setColourTheme(data.user[0].colour);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
    fetch('/api/home')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // console.log(response);
        return response.json();
      })
      .then((data) => {
        if (data.loggedIn) {
          // console.log(data);
          getData();
        } else {
          window.location.replace('/login')
        }
      })
      .catch((error) => {
        console.error(error)
      });
  }, []);

  const changeColour = (theme) => {
    const rootEl = document.querySelector(':root');

    if (theme === 'dark') {
      rootEl.style.setProperty('--text', '#000f08');
      rootEl.style.setProperty('--background', '#1c3738');
      rootEl.style.setProperty('--card-background', '#8baaad');
      rootEl.style.setProperty('--line-background', '#f4fff8');
    }
    if (theme === 'light') {
      rootEl.style.setProperty('--text', '#395C6B');
      rootEl.style.setProperty('--background', '#B8CCF5');
      rootEl.style.setProperty('--card-background', '#DDE9F8');
      rootEl.style.setProperty('--line-background', '#FFFFFF');
    }
    if (theme === 'blue') {
      rootEl.style.setProperty('--text', '#001B2E');
      rootEl.style.setProperty('--background', '#294C60');
      rootEl.style.setProperty('--card-background', '#BFCFE8');
      rootEl.style.setProperty('--line-background', '#FDF9F1');
    }
    if (theme === 'purple') {
      rootEl.style.setProperty('--text', '#2C1320');
      rootEl.style.setProperty('--background', '#5F4B66');
      rootEl.style.setProperty('--card-background', '#AC8EB6');
      rootEl.style.setProperty('--line-background', '#FFFFFF');
    }
    if (theme === 'forest') {
      rootEl.style.setProperty('--text', '#3B322C');
      rootEl.style.setProperty('--background', '#3B322C');
      rootEl.style.setProperty('--card-background', '#5E8C61');
      rootEl.style.setProperty('--line-background', '#EBF6EF');
    }
    if (theme === 'misty') {
      rootEl.style.setProperty('--text', '#061826');
      rootEl.style.setProperty('--background', '#3685B5');
      rootEl.style.setProperty('--card-background', '#89AAE6');
      rootEl.style.setProperty('--line-background', '#E7DAE3');
    }
    if (theme === 'classy') {
      rootEl.style.setProperty('--text', '#424242');
      rootEl.style.setProperty('--background', '#424242');
      rootEl.style.setProperty('--card-background', '#A3A3A3');
      rootEl.style.setProperty('--line-background', '#FEFFEA');
    }
    if (theme === 'saffron') {
      rootEl.style.setProperty('--text', '#264653');
      rootEl.style.setProperty('--background', '#2A9D8F');
      rootEl.style.setProperty('--card-background', '#E9C46A');
      rootEl.style.setProperty('--line-background', '#FDF4EC');
    }
    if (theme === 'pink') {
      rootEl.style.setProperty('--text', '#565857');
      rootEl.style.setProperty('--background', '#734B5E');
      rootEl.style.setProperty('--card-background', '#D7C1CB');
      rootEl.style.setProperty('--line-background', '#FFFFFF');
    }
    if (theme === 'gold') {
      rootEl.style.setProperty('--text', '#7A4419');
      rootEl.style.setProperty('--background', '#400406');
      rootEl.style.setProperty('--card-background', '#B9953C');
      rootEl.style.setProperty('--line-background', '#EBEDE8');
    }
  }

  useEffect(() => {
    if (colourTheme) {
      changeColour(colourTheme);
    }
  }, [colourTheme])

  return (
    <div>

      <Header name={name} location={location} visibility={visibility} setVisibility={setVisibility} />
      <ProfileForm visibility={visibility} setVisibility={setVisibility} colourTheme={colourTheme} setColourTheme={setColourTheme} getData={getData}/>

      <main className={css`display: flex; width: 100vw;`}>
        <section id="left" className={css`width: 33%; max-height: 100vh; display: flex; flex-direction: column;`}>
          <DailyChecks checks={checks} setChecks={setChecks} getData={getData}/>
          <Goals goals={weekGoals} setGoals={setWeekGoals} goalType="Weekly" getData={getData}/>
        </section>

        <section id="middle" className={css`width: 34%; max-height: 100vh; display: flex; flex-direction: column;`}>
          <Schedule events={events} setEvents={setEvents} getData={getData}/>
          <Goals goals={monthGoals} setGoals={setMonthGoals} goalType="Monthly" getData={getData}/>
        </section>

        <section id="right" className={css`width: 33%; max-height: 100vh; display: flex; flex-direction: column;`}>
          <Notes notes={notes} setNotes={setNotes} getData={getData}/>
          <Goals goals={yearGoals} setGoals={setYearGoals} goalType="Yearly" getData={getData}/>
        </section>
      </main>

    </div>
  )
}