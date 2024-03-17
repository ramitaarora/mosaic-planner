import { useState } from 'react';
import DailyChecksForm from './DailyChecksForm';
import { css } from '@emotion/css';

export default function DailyChecks({ dailyChecks, setDailyChecks, dailyChecksHistory, setDailyChecksHistory, getData }) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const today = `${year}-${month}-${day}`;

    const [inputValue, setInputValue] = useState('');
    const [visibility, setVisibility] = useState('hidden');
    const [currentDay, setCurrentDay] = useState(today);
    const [errorMessage, setErrorMessage] = useState('');

    const showModal = () => {
        setVisibility('visible');
    }

    const editCheck = (event) => {
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
                getData();
            } else {
                alert(response.statusText);
            }
        }
    }

    const submitEdit = async (event) => {
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
            getData()
        } else {
            alert(response.statusText);
        }

        document.getElementById(formID).setAttribute('class', 'hidden');
        checkItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const cancelEdit = (event) => {
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
            getData()
        } else {
            alert(response.statusText);
        }
    }

    const getToday = async () => {
        getData();
        setCurrentDay(today);
    }

    const minusDay = async () => {
        let current = new Date(currentDay);
        let minusOne = current.setDate(current.getDate() - 1);
        let newYear = new Date(minusOne).getFullYear();
        let newMonth = new Date(minusOne).getMonth() + 1;
        let newDay = new Date(minusOne).getDate();
        let newFullDate = `${newYear}-${newMonth}-${newDay}`;

        fetch(`/api/data/checksDate/${newFullDate}`)
            .then((response) => {
                if (!response.ok) {
                    alert(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                setCurrentDay(newFullDate);
                // console.log(currentDay);
                if (data.Message) {
                    setDailyChecksHistory([]);
                } else {
                    setDailyChecksHistory(data);
                }
            })
    }

    const addDay = async () => {
        let current = new Date(currentDay);
        let addOne = current.setDate(current.getDate() + 1);
        let newYear = new Date(addOne).getFullYear();
        let newMonth = new Date(addOne).getMonth() + 1;
        let newDay = new Date(addOne).getDate();
        let newFullDate = `${newYear}-${newMonth}-${newDay}`;

        fetch(`/api/data/checksDate/${newFullDate}`)
            .then((response) => {
                if (!response.ok) {
                    alert(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                setCurrentDay(newFullDate);
                // console.log(currentDay);
                if (data.Message) {
                    setDailyChecksHistory([]);
                } else {
                    setDailyChecksHistory(data);
                }
            })
    }

    const generateTodaysChecks = () => {
        try {
            fetch('/api/data/generateChecks')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                return response.json();
            })
            .then((data) => {
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
            <div id="daily-checks" className={`card ${css`height: 35vh;`}`}>
                <div id="card-header">
                    <h2>Daily Checks</h2>
                    <img src="./svgs/add.svg" alt="add" onClick={showModal} />
                </div>
                <div id="arrows" className={css`width: 90%; margin: 0 auto 5px auto; display: flex; justify-content: space-between; align-items: center;`}>
                    <img src="./svgs/arrow-left.svg" alt="back" onClick={minusDay} />
                    <button onClick={getToday}>Today</button>
                    <img src="./svgs/arrow-right.svg" alt="forward" onClick={addDay} />
                </div>
                {dailyChecksHistory.length ? (
                    dailyChecksHistory.map((check, index) =>
                        <div id="line" key={index} value={check.id}>
                            <div id={'check-list-item-' + check.id} className="list-item">
                                <input type="checkbox" id={"is-completed-" + check.id} onChange={checkbox} checked={check.completed ? true : false} className={css`margin-right: 5px;`} />
                                <label>{check.daily_check}</label>
                            </div>
                            <form id={'checksForm-' + check.id} className="hidden" onSubmit={submitEdit}>
                                <input type="text" id={'checksInput-' + check.id} onChange={(event) => setInputValue(event.target.value)} className={css`width: 100%;`} />
                                <input type="submit" className="submit-button" />
                                <button id="cancel-edit" onClick={cancelEdit}>Cancel</button>
                            </form>
                            <div id="edit-buttons">
                                <img src="./svgs/edit.svg" alt="edit" onClick={editCheck} id={check.id} value={check.daily_check} />
                                <img src="./svgs/delete.svg" alt="delete" onClick={deleteCheck} id={check.id} />
                            </div>
                        </div>
                    )) : (

                    <div id="empty">
                        <p onClick={showModal}>No daily checks!</p>
                        {currentDay === today ? <button onClick={generateTodaysChecks}>Generate Today's Checks</button> : null}
                        {errorMessage.length ? (
                            <p>{errorMessage}</p>
                        ) : null}
                    </div>
                )
                }
                <DailyChecksForm visibility={visibility} setVisibility={setVisibility} getData={getData} dailyChecks={dailyChecks} setDailyChecks={setDailyChecks} />
            </div>
        )
    }