import { useEffect, useState } from 'react';
import './App.css'
import Header from './components/Header.jsx';

export default function App() {
  const [yearGoals, setYearGoals] = useState([]);
  const [monthGoals, setMonthGoals] = useState([]);
  const [weekGoals, setWeekGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [checks, setChecks] = useState([]);
 
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
      <Header />

      <main>

        <section id="left">
          <div id="yearly-goals" className="card">
            <h2>Yearly Goals</h2>
            <div id="yearly-goals-list">
              <ol>
                {yearGoals.map(((goal, index) => 
                  <div key={index} id="goal-line">
                    <div>
                      <li >{goal}</li>
                    </div>
                    <div id="edit-buttons">
                      <img src="./svgs/edit.svg" alt="edit"/>
                      <img src="./svgs/delete.svg" alt="edit"/>
                    </div>  
                </div>
                ))}
              </ol>
            </div>
          </div>
          <div id="monthly-goals" className="card">
            <h2>Monthly Goals</h2>
            <div id="monthly-goals-list">
              <ol>
                {monthGoals.map(((goal, index) => 
                  <div key={index} id="goal-line">
                    <div>
                      <li >{goal}</li>
                    </div>
                    <div id="edit-buttons">
                      <img src="./svgs/edit.svg" alt="edit"/>
                      <img src="./svgs/delete.svg" alt="edit"/>
                    </div>  
                </div>
                ))}
              </ol>
            </div>
          </div>
          <div id="weekly-goals" className="card">
            <h2>Weekly Goals</h2>
            <div id="weekly-goals-list">
              <ol>
                {weekGoals.map(((goal, index) => 
                  <div key={index} id="goal-line">
                    <div>
                      <li >{goal}</li>
                    </div>
                    <div id="edit-buttons">
                      <img src="./svgs/edit.svg" alt="edit"/>
                      <img src="./svgs/delete.svg" alt="edit"/>
                    </div>  
                </div>
                  ))}
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
                {checks.map((check, index) => 
                  <div id="goal-line" key={index}>
                    <div id="checks-list">
                      <input type="checkbox"/>
                      <label id="check-line">{check}</label>
                    </div>
                    <div id="edit-buttons">
                      <img src="./svgs/edit.svg" alt="edit"/>
                      <img src="./svgs/delete.svg" alt="edit"/>
                    </div> 
                  </div>
            )}
          </div>
        </section>

        <section id="right">
          <div id="notes" className="card">
            <h2>Notes & Reminders</h2>
            <div id="daily-checks-list">
              <ol>
                {notes.map((note, index) => 
                  <div key={index} id="goal-line">
                    <div>
                      <li >{note}</li>
                    </div>
                    <div id="edit-buttons">
                      <img src="./svgs/edit.svg" alt="edit"/>
                      <img src="./svgs/delete.svg" alt="edit"/>
                    </div>  
                  </div>
                )}
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