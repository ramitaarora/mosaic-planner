import { useEffect, useState } from 'react';
import './App.css'

export default function App() {
  const [message, setMessage] = useState('test')

  useEffect(() => {
    fetch('/api/users/test')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // or response.text() for text data
      })
      .then((data) => {
        setMessage(data.message);
        console.log(message)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // Handle the error as needed
      });
  }, []);
  

  return (
    <div>
      <header>
        <h1 id="today">Today</h1>
        <p id="current-day">Current Day</p>
        <p id="current-time">Current Time</p>
      </header>

      <main>

        <section id="left">
          <div id="yearly-goals" className="card">
            <h2>Yearly Goals</h2>
            <div id="yearly-goals-list">
              <ol>
                <li><p>{message}</p></li>
              </ol>
            </div>
          </div>
          <div id="monthly-goals" className="card">
            <h2>Monthly Goals</h2>
            <div id="monthly-goals-list">

            </div>
          </div>
          <div id="weekly-goals" className="card">
            <h2>Weekly Goals</h2>
            <div id="weekly-goals-list">

            </div>
          </div>
        </section>

        <section id="middle">
          <div id="schedule">
            <h2>Schedule</h2>
          </div>
          <div id="daily-checks">
            <h2>Daily Checks</h2>
          </div>
        </section>

        <section id="right">
          <div id="notes" className="card">
            <h2>Notes & Reminders</h2>
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