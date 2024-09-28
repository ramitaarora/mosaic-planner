import { useState, useEffect } from 'react';
import DailyChecksForm from './DailyChecksForm';
import { css } from '@emotion/css';

export default function DailyChecks({ dailyChecks, setDailyChecks, dailyChecksHistory, setDailyChecksHistory, today, fullDate, timezone, getData }) {
    // Input value when editing checks
    const [inputValue, setInputValue] = useState('');
    // Visibility of Daily checks form modal
    const [visibility, setVisibility] = useState('hidden');
    // Error message when trying to generate today's checks - should not occur
    const [errorMessage, setErrorMessage] = useState('');
    // Controlling the current day and scrolling through different day's checks
    const [currentDay, setCurrentDay] = useState(fullDate);
    const [currentFullDate, setCurrentFullDate] = useState('')
    const [sortedDailyChecks, setSortedDailyChecks] = useState([]);

    useEffect(() => {
        // Load today's date
        getToday();

        let newYear = new Date(currentDay).getFullYear();
        let newMonth = new Date(currentDay).getMonth() + 1;
        let newDay = new Date(currentDay).getDate();
        setCurrentFullDate(`${newYear}-${newMonth}-${newDay}`);
    }, [])

    useEffect(() => {
        // Sort daily checks according to whether they are completed (push to bottom of array) or not (push to top of array)
        setSortedDailyChecks([]);
        
        for (let i = 0; i < dailyChecksHistory.length; i++) {
            if (!dailyChecksHistory[i].completed) {
                setSortedDailyChecks((prev) => [dailyChecksHistory[i], ...prev]);
            } else {
                setSortedDailyChecks((prev) => [...prev, dailyChecksHistory[i]]);
            }
        }
    }, [dailyChecksHistory])

    const showModal = () => {
        // Open Daily Checks modal
        setVisibility('visible');
    }

    const fetchSpecificDayChecks = (newFullDate) => {
        // Function to fetch checks when scrolling through different days
        fetch(`/api/data/checksDate/${newFullDate}`)
        .then((response) => {
            if (!response.ok) {
                console.error(response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            let newFullDateLong = new Date(newFullDate);
            const timeZoneDate = new Intl.DateTimeFormat('en-US', {
                dateStyle: 'full',
                timeZone: timezone,
              }).format(newFullDateLong);

            setCurrentFullDate(newFullDate);
            setCurrentDay(timeZoneDate);
            if (data.Message) {
                setDailyChecksHistory([]);
            } else {
                setDailyChecksHistory(data);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
          });
    }

    const editCheck = (event) => {
        // Edit a check
        const checkID = event.target.attributes[2].nodeValue;
        const checkValue = event.target.attributes[3].nodeValue;

        const goalItem = document.getElementById(`check-list-item-${checkID}`)
        goalItem.setAttribute('class', 'hidden');

        const formID = document.getElementById(`checksForm-${checkID}`);
        formID.setAttribute('class', 'visible');

        const inputField = document.getElementById(`checksInput-${checkID}`);
        inputField.setAttribute('value', checkValue);
    }

    const deleteCheck = async (event) => {
        // Delete a check
        const checkID = event.target.attributes[2].nodeValue;

        if (window.confirm("Are you sure you want to delete this daily check?")) {
            const response = await fetch('/api/data/delete', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: checkID,
                    type: 'Daily Check History',
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                let newYear = new Date(currentDay).getFullYear();
                let newMonth = new Date(currentDay).getMonth() + 1;
                let newDay = new Date(currentDay).getDate();
                let newFullDate = `${newYear}-${newMonth}-${newDay}`;
                fetchSpecificDayChecks(newFullDate);
            } else {
                console.error(response.statusText);
            }
        }
    }

    const submitEdit = async (event) => {
        // Submit the edit for the daily check into the database
        event.preventDefault();
        const formID = event.target.id;
        const checkID = event.target.parentElement.attributes[1].value;
        const formInput = event.target[0].value;
        const checkItem = document.getElementById(`check-list-item-${checkID}`)

        const response = await fetch('/api/data/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: checkID,
                check: formInput,
                type: 'Daily Check History'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            let newYear = new Date(currentDay).getFullYear();
            let newMonth = new Date(currentDay).getMonth() + 1;
            let newDay = new Date(currentDay).getDate();
            let newFullDate = `${newYear}-${newMonth}-${newDay}`;
            fetchSpecificDayChecks(newFullDate);
        } else {
            console.error(response.statusText);
        }

        document.getElementById(formID).setAttribute('class', 'hidden');
        checkItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const cancelEdit = (event) => {
        // Close the edit check form
        event.preventDefault();
        const formID = event.target.form.id;
        const checkID = event.target.parentElement.parentElement.attributes[1].value;

        const formEl = document.getElementById(formID);
        formEl.setAttribute('class', 'hidden');

        const checkItem = document.getElementById(`check-list-item-${checkID}`)
        checkItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const checkbox = async (event) => {
        // Mark check as completed or not and commit to the database
        const checkID = event.target.parentElement.parentElement.attributes[1].value;

        const response = await fetch('/api/data/completed', {
            method: 'PUT',
            body: JSON.stringify({
                id: checkID,
                completed: event.target.checked,
                type: 'Daily Check'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            let newYear = new Date(currentDay).getFullYear();
            let newMonth = new Date(currentDay).getMonth() + 1;
            let newDay = new Date(currentDay).getDate();
            let newFullDate = `${newYear}-${newMonth}-${newDay}`;
            fetchSpecificDayChecks(newFullDate);
        } else {
            console.error(response.statusText);
        }
    }

    const getToday = () => {
        // Function to get today's data and set date
        getData();
        setCurrentDay(fullDate);
        
        let newYear = new Date(currentDay).getFullYear();
        let newMonth = new Date(currentDay).getMonth() + 1;
        let newDay = new Date(currentDay).getDate();
        setCurrentFullDate(`${newYear}-${newMonth}-${newDay}`);
    }

    const minusDay = async () => {
        // Go back one day from current date
        let current = new Date(currentDay);
        let minusOne = current.setDate(current.getDate() - 1);
        let newYear = new Date(minusOne).getFullYear();
        let newMonth = new Date(minusOne).getMonth() + 1;
        let newDay = new Date(minusOne).getDate();
        let newFullDate = `${newYear}-${newMonth}-${newDay}`;

        fetchSpecificDayChecks(newFullDate);
    }

    const addDay = async () => {
        // Go forward one day from current date
        let current = new Date(currentDay);
        let addOne = current.setDate(current.getDate() + 1);
        let newYear = new Date(addOne).getFullYear();
        let newMonth = new Date(addOne).getMonth() + 1;
        let newDay = new Date(addOne).getDate();
        let newFullDate = `${newYear}-${newMonth}-${newDay}`;

        fetchSpecificDayChecks(newFullDate);
    }

    const generateTodaysChecks = () => {
        // Generate the checks for the current day
        try {
            fetch(`/api/data/generateChecks/${today}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.message == 'No checks.') {
                        setErrorMessage('You have not added any daily checks yet! Click the plus to create some.')
                    }
                    getData();
                })
                .catch((err) => {
                    console.log(err);
                })

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div id="daily-checks" className={`card ${css`height: 45vh;`}`}>
            <div className="card-header">
                <h2>Daily Checks for {currentDay.split(',')[1]}</h2>
                <img src="./svgs/add.svg" alt="add" onClick={showModal} />
            </div>
            <div id="arrows" className={css`width: 90%; margin: 0 auto 5px auto; display: flex; justify-content: space-between; align-items: center;`}>
                <img src="./svgs/arrow-left.svg" alt="back" onClick={minusDay} />
                <button onClick={getToday}>Today</button>
                <img src="./svgs/arrow-right.svg" alt="forward" onClick={addDay} />
            </div>
            {sortedDailyChecks.length ? (
                sortedDailyChecks.map((check, index) =>
                    <div className="line" key={index} value={check.id}>
                        <div id={'check-list-item-' + check.id} className="list-item">
                            <input type="checkbox" id={"is-completed-" + check.id} onChange={checkbox} checked={check.completed ? true : false} className={css`margin-right: 5px;`} />
                            <label>{check.daily_check}</label>
                        </div>
                        <form id={'checksForm-' + check.id} className="hidden" onSubmit={submitEdit}>
                            <input type="text" id={'checksInput-' + check.id} onChange={(event) => setInputValue(event.target.value)} className={css`width: 100%;`} />
                            <input type="submit" className="submit-button" value="Save" />
                            <button onClick={cancelEdit}>Cancel</button>
                        </form>
                        <div className="edit-buttons">
                            <img src="./svgs/edit.svg" alt="edit" onClick={editCheck} id={check.id} value={check.daily_check} />
                            <img src="./svgs/delete.svg" alt="delete" onClick={deleteCheck} id={check.id} />
                        </div>
                    </div>
                )) : (

                <div id="empty">
                    <p>No daily checks!</p>
                    {!dailyChecks.length && currentFullDate === today ? <button onClick={showModal}>Add Checks</button> : null}
                    {currentFullDate === today && dailyChecks.length ? <button onClick={generateTodaysChecks}>Generate Today's Checks</button> : null}
                    {errorMessage.length ? (
                        <p>{errorMessage}</p>
                    ) : null}
                </div>
            )
            }
            <DailyChecksForm visibility={visibility} setVisibility={setVisibility} getData={getData} dailyChecks={dailyChecks} setDailyChecks={setDailyChecks} today={today} />
        </div>
    )
}