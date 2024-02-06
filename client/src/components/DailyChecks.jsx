import { useEffect, useState } from 'react';
import DailyChecksForm from './DailyChecksForm';
import { css } from '@emotion/css';

export default function DailyChecks({ checks, setChecks, getData }) {
    const [inputValue, setInputValue] = useState('');
    const [visibility, setVisibility] = useState('hidden');

    const showModal = () => {
        setVisibility('visible')
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
        checkItem.setAttribute('class', 'visible');
        setInputValue('');
    }

    const cancelEdit = (event) => {
        event.preventDefault();
        const formID = event.target.form.id;
        const checkID = event.target.parentElement.parentElement.attributes[1].value;

        const formEl = document.getElementById(formID);
        formEl.setAttribute('class', 'hidden');

        const checkItem = document.getElementById(`check-list-item-${checkID}`)
        checkItem.setAttribute('class', 'visible');
        setInputValue('');
    }

    const checkbox = async (event) => {
        const checkID = event.target.parentElement.parentElement.attributes[1].value;

        if (event.target.checked) {
            const response = await fetch('/api/data/completed', {
                method: 'PUT',
                body: JSON.stringify({
                    id: checkID,
                    completed: event.target.checked,
                }),
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.ok) {
                getData()
            } else {
                alert(response.statusText);
            }
        }
        else {
            const response = await fetch('/api/data/completed', {
                method: 'PUT',
                body: JSON.stringify({
                    id: checkID,
                    completed: event.target.checked,
                }),
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.ok) {
                getData()
            } else {
                alert(response.statusText);
            }
        }
    }

    return (
        <div id="daily-checks" className={`card ${css`height: 60vh;`}`}>
            <div id="card-header">
                <h2>Daily Checks</h2>
                <img src="./svgs/add.svg" alt="add" onClick={showModal} />
            </div>
            {checks.length ? (
                checks.map((check, index) =>
                    <div id="line" key={index} value={check.id}>
                        <div id={'check-list-item-' + check.id} className={css`display: flex; align-items: center; justify-content: space-evenly;`}>
                            <input type="checkbox" id={"is-completed-" + check.id} onChange={checkbox} checked={check.completed ? true : false} className={css`margin-right: 5px;`}/>
                            <label>{check.daily_check}</label>
                        </div>
                        <form id={'checksForm-' + check.id} className="hidden" onSubmit={submitEdit}>
                            <input type="text" id={'checksInput-' + check.id} onChange={(event) => setInputValue(event.target.value)} className={css`width: 100%;`}/>
                            <input type="submit" className="submit-button" />
                            <button id="cancel-edit" onClick={cancelEdit}>Cancel</button>
                        </form>
                        <div id="edit-buttons">
                            <img src="./svgs/edit.svg" alt="edit" onClick={editCheck} id={check.id} value={check.daily_check} />
                            <img src="./svgs/delete.svg" alt="delete" onClick={deleteCheck} id={check.id} />
                        </div>
                    </div>
                )) : (
                    <p id="empty" onClick={showModal}>No daily checks yet!</p>
            )
            }
            <DailyChecksForm visibility={visibility} setVisibility={setVisibility} />
        </div>
    )
}