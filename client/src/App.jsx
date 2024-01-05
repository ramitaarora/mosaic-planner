import { useEffect, useState } from 'react';
import './App.css'
import Header from './components/Header.jsx';

export default function App() {
  const [yearGoals, setYearGoals] = useState([]);
  const [monthGoals, setMonthGoals] = useState([]);
  const [weekGoals, setWeekGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [checks, setChecks] = useState([]);
  const [inputValue, setInputValue] = useState('');
 
  useEffect(() => {
    fetch('/api/data/allGoals')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // or response.text() for text data
      })
      .then((data) => {
        // console.log(data);
        setYearGoals(data.yearlyGoals.map(goal => goal));
        setMonthGoals(data.monthlyGoals.map(goal => goal));
        setWeekGoals(data.weeklyGoals.map(goal => goal));
        setNotes(data.notes.map(note => note));
        setChecks(data.dailyChecks.map(check => check.daily_check));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const editYearlyGoal = (event) => {
    const yearlyGoalID = event.target.attributes[2].nodeValue;
    const yearlyGoalValue = event.target.attributes[3].nodeValue;

    const formID = document.getElementById(`yearlyForm-${yearlyGoalID}`);
    formID.setAttribute('class', 'form-visible');

    const inputField = document.getElementById(`yearlyInput-${yearlyGoalID}`);
    inputField.setAttribute('value', yearlyGoalValue);
  }

  const deleteYearlyGoal = async (event) => {
    const yearlyGoalID = event.target.attributes[2].nodeValue;

    if (window.confirm("Are you sure you want to delete this goal?")) {
      const response = await fetch('/api/data/deleteYearly', {
        method: 'DELETE',
        body: JSON.stringify({
          id: yearlyGoalID,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        // console.log(response.statusText);
        fetch('/api/data/allgoals')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // or response.text() for text data
        })
        .then((data) => {
          // console.log(data);
          setYearGoals(data.yearlyGoals.map(goal => goal));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      } else {
        alert(response.statusText);
      }
    }
  }

  const submitYearlyEdit = async (event) => {
    event.preventDefault();
    const yearlyFormID = event.target.id;
    const yearlyGoalID = event.target.parentElement.parentElement.attributes[1].value;
    const formInput = event.target[0].value;

    const response = await fetch('/api/data/editYearly', {
      method: 'POST',
      body: JSON.stringify({ 
        id: yearlyGoalID,
        yearlyGoal: formInput
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // console.log(response.statusText);
      fetch('/api/data/allgoals')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // or response.text() for text data
      })
      .then((data) => {
        // console.log(data);
        setYearGoals(data.yearlyGoals.map(goal => goal));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    } else {
      alert(response.statusText);
    }

    document.getElementById(yearlyFormID).setAttribute('class', 'form-hidden');
    setInputValue('');
  }

  const cancelYearlyEdit = (event) => {
    event.preventDefault();
    const yearlyFormID = event.target.form.id;

    const formID = document.getElementById(yearlyFormID);
    formID.setAttribute('class', 'form-hidden');
    setInputValue('');
  }

  const editMonthlyGoal = (event) => {
    const monthlyGoalID = event.target.attributes[2].nodeValue;
    const monthlyGoalValue = event.target.attributes[3].nodeValue;

    const formID = document.getElementById(`monthlyForm-${monthlyGoalID}`);
    formID.setAttribute('class', 'form-visible');

    const inputField = document.getElementById(`monthlyInput-${monthlyGoalID}`);
    inputField.setAttribute('value', monthlyGoalValue);
  }

  const deleteMonthlyGoal = async (event) => {
    const monthlyGoalID = event.target.attributes[2].nodeValue;

    if (window.confirm("Are you sure you want to delete this goal?")) {
      const response = await fetch('/api/data/deleteMonthly', {
        method: 'DELETE',
        body: JSON.stringify({
          id: monthlyGoalID,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        // console.log(response.statusText);
        fetch('/api/data/allgoals')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // or response.text() for text data
        })
        .then((data) => {
          // console.log(data);
          setMonthGoals(data.monthlyGoals.map(goal => goal));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      } else {
        alert(response.statusText);
      }
    }
  }

  const submitMonthlyEdit = async (event) => {
    event.preventDefault();
    const monthlyFormID = event.target.id;
    const monthlyGoalID = event.target.parentElement.parentElement.attributes[1].value;
    const formInput = event.target[0].value;

    const response = await fetch('/api/data/editMonthly', {
      method: 'POST',
      body: JSON.stringify({ 
        id: monthlyGoalID,
        monthlyGoal: formInput
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // console.log(response.statusText);
      fetch('/api/data/allgoals')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // or response.text() for text data
      })
      .then((data) => {
        // console.log(data);
        setMonthGoals(data.monthlyGoals.map(goal => goal));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    } else {
      alert(response.statusText);
    }

    document.getElementById(monthlyFormID).setAttribute('class', 'form-hidden');
    setInputValue('');
  }

  const cancelMonthlyEdit = (event) => {
    event.preventDefault();
    const monthlyFormID = event.target.form.id;

    const formID = document.getElementById(monthlyFormID);
    formID.setAttribute('class', 'form-hidden');
    setInputValue('');
  }

  const editWeeklyGoal = (event) => {
    const weeklyGoalID = event.target.attributes[2].nodeValue;
    const weeklyGoalValue = event.target.attributes[3].nodeValue;

    const formID = document.getElementById(`weeklyForm-${weeklyGoalID}`);
    formID.setAttribute('class', 'form-visible');

    const inputField = document.getElementById(`weeklyInput-${weeklyGoalID}`);
    inputField.setAttribute('value', weeklyGoalValue);
  }

  const deleteWeeklyGoal = async (event) => {
    const weeklyGoalID = event.target.attributes[2].nodeValue;

    if (window.confirm("Are you sure you want to delete this goal?")) {
      const response = await fetch('/api/data/deleteWeekly', {
        method: 'DELETE',
        body: JSON.stringify({
          id: weeklyGoalID,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        // console.log(response.statusText);
        fetch('/api/data/allgoals')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // or response.text() for text data
        })
        .then((data) => {
          // console.log(data);
          setWeekGoals(data.weeklyGoals.map(goal => goal));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      } else {
        alert(response.statusText);
      }
    }
  }

  const submitWeeklyEdit = async (event) => {
    event.preventDefault();
    const weeklyFormID = event.target.id;
    const weeklyGoalID = event.target.parentElement.parentElement.attributes[1].value;
    const formInput = event.target[0].value;

    const response = await fetch('/api/data/editWeekly', {
      method: 'POST',
      body: JSON.stringify({ 
        id: weeklyGoalID,
        weeklyGoal: formInput
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // console.log(response.statusText);
      fetch('/api/data/allgoals')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // or response.text() for text data
      })
      .then((data) => {
        // console.log(data);
        setWeekGoals(data.weeklyGoals.map(goal => goal));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    } else {
      alert(response.statusText);
    }

    document.getElementById(weeklyFormID).setAttribute('class', 'form-hidden');
    setInputValue('');
  }

  const cancelWeeklyEdit = (event) => {
    event.preventDefault();
    const weeklyFormID = event.target.form.id;

    const formID = document.getElementById(weeklyFormID);
    formID.setAttribute('class', 'form-hidden');
    setInputValue('');
  }

  const editNote = (event) => {
    const noteID = event.target.attributes[2].nodeValue;
    const noteValue = event.target.attributes[3].nodeValue;

    const formID = document.getElementById(`noteForm-${noteID}`);
    formID.setAttribute('class', 'form-visible');

    const inputField = document.getElementById(`noteInput-${noteID}`);
    inputField.setAttribute('value', noteValue);
  }

  const deleteNote = async (event) => {
    const noteID = event.target.attributes[2].nodeValue;

    if (window.confirm("Are you sure you want to delete this goal?")) {
      const response = await fetch('/api/data/deleteNote', {
        method: 'DELETE',
        body: JSON.stringify({
          id: noteID,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        // console.log(response.statusText);
        fetch('/api/data/allgoals')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // or response.text() for text data
        })
        .then((data) => {
          // console.log(data);
          setNotes(data.notes.map(note => note));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      } else {
        alert(response.statusText);
      }
    }
  }

  const submitNoteEdit = async (event) => {
    event.preventDefault();
    const noteFormID = event.target.id;
    const noteID = event.target.parentElement.parentElement.attributes[1].value;
    const formInput = event.target[0].value;

    const response = await fetch('/api/data/editNote', {
      method: 'POST',
      body: JSON.stringify({ 
        id: noteID,
        note: formInput
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // console.log(response.statusText);
      fetch('/api/data/allgoals')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // or response.text() for text data
      })
      .then((data) => {
        // console.log(data);
        setNotes(data.notes.map(note => note));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    } else {
      alert(response.statusText);
    }

    document.getElementById(noteFormID).setAttribute('class', 'form-hidden');
    setInputValue('');
  }

  const cancelNoteEdit = (event) => {
    event.preventDefault();
    const noteFormID = event.target.form.id;

    const formID = document.getElementById(noteFormID);
    formID.setAttribute('class', 'form-hidden');
    setInputValue('');
  }


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
                  <div key={index} id="goal-line" value={goal.id}>
                    <div id={'yearlyGoal-' + goal.id} className="each-goal">
                      <li>{goal.yearly_goal}</li>
                      <form id={'yearlyForm-' + goal.id} className="form-hidden" onSubmit={submitYearlyEdit}>
                        <input id={'yearlyInput-' + goal.id} onChange={(event) => setInputValue(event.target.value)} />
                        <input type="submit" />
                        <button id="cancel-edit" onClick={cancelYearlyEdit}>Cancel</button>
                      </form>
                    </div>
                    <div id="edit-buttons">
                      <img src="./svgs/edit.svg" alt="edit" onClick={editYearlyGoal} id={goal.id} value={goal.yearly_goal} />
                      <img src="./svgs/delete.svg" alt="edit" onClick={deleteYearlyGoal} id={goal.id} />
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
                  <div key={index} id="goal-line" value={goal.id}>
                    <div id={'monthlyGoal-' + goal.id} className="each-goal">
                      <li>{goal.monthly_goal}</li>
                      <form id={'monthlyForm-' + goal.id} className="form-hidden" onSubmit={submitMonthlyEdit}>
                        <input id={'monthlyInput-' + goal.id} onChange={(event) => setInputValue(event.target.value)} />
                        <input type="submit" />
                        <button id="cancel-edit" onClick={cancelMonthlyEdit}>Cancel</button>
                      </form>
                    </div>
                    <div id="edit-buttons">
                      <img src="./svgs/edit.svg" alt="edit" onClick={editMonthlyGoal} id={goal.id} value={goal.monthly_goal} />
                      <img src="./svgs/delete.svg" alt="edit" onClick={deleteMonthlyGoal} id={goal.id} />
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
                  <div key={index} id="goal-line" value={goal.id}>
                    <div id={'weeklyGoal-' + goal.id} className="each-goal">
                      <li>{goal.weekly_goal}</li>
                      <form id={'weeklyForm-' + goal.id} className="form-hidden" onSubmit={submitWeeklyEdit}>
                        <input id={'weeklyInput-' + goal.id} onChange={(event) => setInputValue(event.target.value)} />
                        <input type="submit" />
                        <button id="cancel-edit" onClick={cancelWeeklyEdit}>Cancel</button>
                      </form>
                    </div>
                    <div id="edit-buttons">
                      <img src="./svgs/edit.svg" alt="edit" onClick={editWeeklyGoal} id={goal.id} value={goal.weekly_goal} />
                      <img src="./svgs/delete.svg" alt="edit" onClick={deleteWeeklyGoal} id={goal.id} />
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
                  <div key={index} id="goal-line" value={note.id}>
                    <div id={'note-' + note.id} className="each-goal">
                      <li>{note.note}</li>
                      <form id={'noteForm-' + note.id} className="form-hidden" onSubmit={submitNoteEdit}>
                        <input id={'noteInput-' + note.id} onChange={(event) => setInputValue(event.target.value)} />
                        <input type="submit" />
                        <button id="cancel-edit" onClick={cancelNoteEdit}>Cancel</button>
                      </form>
                    </div>
                    <div id="edit-buttons">
                      <img src="./svgs/edit.svg" alt="edit" onClick={editNote} id={note.id} value={note.note} />
                      <img src="./svgs/delete.svg" alt="edit" onClick={deleteNote} id={note.id} />
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