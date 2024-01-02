import { useEffect, useState } from 'react';
import './App.css'

export default function App() {
  const [yearGoals, setYearGoals] = useState([]);
  const [monthGoals, setMonthGoals] = useState([]);
  const [weekGoals, setWeekGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [checks, setChecks] = useState([]);

  const [hours, setHours] = useState(new Date().getHours());
  const [minutes, setMinutes] = useState(new Date().getMinutes());
  const [seconds, setSeconds] = useState(new Date().getSeconds());

  const [month, setMonth] = useState(new Date().getMonth())
  const [day, setDay] = useState(new Date().getDay());
  const [date, setDate] = useState(new Date().getDate());
  const [year, setYear] = useState(new Date().getFullYear());

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
    setHours(new Date().getHours());
    setMinutes(new Date().getMinutes());

    if (eachSecond < 10) {
      setSeconds('0' + new Date().getSeconds())
    } else if (eachSecond > 9) {
      setSeconds(new Date().getSeconds());
    }
    
  }, 1000)
 
  useEffect(() => {
    fetch('/api/data/allgoals')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // or response.text() for text data
      })
      .then((data) => {
        // console.log(data);
        setYearGoals(data.yearlyGoals.map(goal => goal.yearly_goal));
        setMonthGoals(data.monthlyGoals.map(goal => goal.monthly_goal));
        setWeekGoals(data.weeklyGoals.map(goal => goal.weekly_goal));
        setNotes(data.notes.map(note => note.note));
        setChecks(data.dailyChecks.map(check => check.daily_check));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


  return (
    <div>
      <header>
        <h1 id="today">Today</h1>
        <p id="current-day">{day}, {month} {date}, {year}</p>
        <p id="current-time">{hours}:{minutes}:{seconds}</p>
      </header>

      <main>

        <section id="left">
          <div id="yearly-goals" className="card">
            <h2>Yearly Goals</h2>
            <div id="yearly-goals-list">
              <ol>
                {yearGoals.map(((goal, index) => <li key={index}>{goal}</li>))}
              </ol>
            </div>
          </div>
          <div id="monthly-goals" className="card">
            <h2>Monthly Goals</h2>
            <div id="monthly-goals-list">
              <ol>
                {monthGoals.map(((goal, index) => <li key={index}>{goal}</li>))}
              </ol>
            </div>
          </div>
          <div id="weekly-goals" className="card">
            <h2>Weekly Goals</h2>
            <div id="weekly-goals-list">
              <ol>
                {weekGoals.map(((goal, index) => <li key={index}>{goal}</li>))}
              </ol>
            </div>
          </div>
        </section>

        <section id="middle">
          <div id="schedule">
            <h2>Schedule</h2>
          </div>
          <div id="daily-checks">
            <h2>Daily Checks</h2>
            <div id="daily-checks-list">
              <ol>
                {checks.map((check, index) => <li key={index}>{check}</li>)}
              </ol>
            </div>
          </div>
        </section>

        <section id="right">
          <div id="notes" className="card">
            <h2>Notes & Reminders</h2>
            <div id="daily-checks-list">
              <ol>
                {notes.map((note, index) => <li key={index}>{note}</li>)}
              </ol>
            </div>
          </div>
          <div id="calendar" className="card">
            <h2>Calendar</h2>
          </div>
          <div id="calendar-render" className="card">
            <h2>Calendar onClick</h2>
          </div>
        </section>
      </main>
    </div>
  )
};