import { useEffect, useState } from 'react';
import GoalsForm from './GoalsForm';
import { css } from '@emotion/css'

export default function Goals({ goals, setGoals, goalType, getData }) {
    const [inputValue, setInputValue] = useState('');
    const [visibility, setVisibility] = useState('hidden');

    const editGoal = (event) => {
        const goalID = event.target.attributes[2].nodeValue;
        const goalValue = event.target.attributes[3].nodeValue;

        const goalItem = document.getElementById(`goal-list-item-${goalID}`)
        goalItem.setAttribute('class', 'hidden');

        const formID = document.getElementById(`goalForm-${goalID}`);
        formID.setAttribute('class', 'visible');

        const inputField = document.getElementById(`goalInput-${goalID}`);
        inputField.setAttribute('value', goalValue);
    }

    const deleteGoal = async (event) => {
        const goalID = event.target.attributes[2].nodeValue;

        if (window.confirm("Are you sure you want to delete this goal? It will delete all related goals.")) {
            const response = await fetch('/api/data/delete', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: goalID,
                    type: 'Goal',
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
        const goalID = event.target.parentElement.parentElement.attributes[1].value;
        const formInput = event.target[0].value;
        const goalItem = document.getElementById(`goal-list-item-${goalID}`)

        const response = await fetch('/api/data/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: goalID,
                goal: formInput,
                type: 'Goal'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            getData();
        } else {
            alert(response.statusText);
        }

        document.getElementById(formID).setAttribute('class', 'hidden');
        goalItem.setAttribute('class', 'visible');
        setInputValue('');
    }

    const cancelEdit = (event) => {
        event.preventDefault();
        const formID = event.target.form.id;
        const goalID = event.target.parentElement.parentElement.parentElement.attributes[1].value;

        const formEl = document.getElementById(formID);
        formEl.setAttribute('class', 'hidden');

        const goalItem = document.getElementById(`goal-list-item-${goalID}`)
        goalItem.setAttribute('class', 'visible');
        setInputValue('');
    }

    const addNewGoal = (event) => {
        setVisibility('visible')
    }

    return (
        <div id="goals" className={`card ${css`max-height: 50vh; min-height: 30vh;`}`}>
            <div id="card-header">
                <h2>{goalType} Goals</h2>
                <img id="add-goal-button" src="./svgs/add.svg" alt="add" onClick={addNewGoal}/>
            </div>

            <GoalsForm visibility={visibility} setVisibility={setVisibility} />

            <div id="goals-list">
                <ol>
                    {goals.length ? (
                        goals.map(((goal, index) =>
                        <div key={index} id="line" value={goal.id}>
                            <div id={'goal-' + goal.id} className={css`display: flex; flex-direction: column; margin: 5px; justify-content: space-evenly;`}>
                                <li id={'goal-list-item-'+ goal.id}>{goal.goal}</li>
                                <form id={'goalForm-' + goal.id} className="hidden" onSubmit={submitEdit}>
                                    <input type="text" id={'goalInput-' + goal.id} onChange={(event) => setInputValue(event.target.value)} className={css`width: 100%;`}/>
                                    <input type="submit" />
                                    <button id="cancel-edit" onClick={cancelEdit}>Cancel</button>
                                </form>
                            </div>
                            <div id="edit-buttons">
                                <img src="./svgs/edit.svg" alt="edit" onClick={editGoal} id={goal.id} value={goal.goal} />
                                <img src="./svgs/delete.svg" alt="delete" onClick={deleteGoal} id={goal.id} />
                            </div>
                        </div>
                    ))) : (
                        <p id="empty">No goals yet!</p>
                    )
                }
                </ol>
            </div>
        </div>
    )
}