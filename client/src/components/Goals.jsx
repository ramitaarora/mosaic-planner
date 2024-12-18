import { useEffect, useState } from 'react';
import GoalsForm from './GoalsForm';
import { css } from '@emotion/css'

export default function Goals({ goals, setGoals, goalType, getData }) {
    // Input variable for editing individual goals
    const [inputValue, setInputValue] = useState('');
    // Variable for visibility of modal
    const [visibility, setVisibility] = useState('hidden');
    // Array to display goals after sorting
    const [sortedGoals, setSortedGoals] = useState([]);

    useEffect(() => {
        // Sort goals every time data updates
        setSortedGoals([]);

        for (let i = 0; i < goals.length; i++) {
            if (!goals[i].completed) {
                setSortedGoals((prev) => [goals[i], ...prev]);
            } else {
                setSortedGoals((prev) => [...prev, goals[i]]);
            }
        }
    }, [goals])

    const editGoal = (event) => {
        // Show edit goal form
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
        // Delete goal from database
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
                console.error(response.statusText);
            }
        }
    }

    const submitEdit = async (event) => {
        // Submit individual goal edit and change in database
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
            console.error(response.statusText);
        }

        document.getElementById(formID).setAttribute('class', 'hidden');
        goalItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const cancelEdit = (event) => {
        // Hide goal edit form
        event.preventDefault();
        const formID = event.target.form.id;
        const goalID = event.target.parentElement.parentElement.parentElement.attributes[1].value;

        const formEl = document.getElementById(formID);
        formEl.setAttribute('class', 'hidden');

        const goalItem = document.getElementById(`goal-list-item-${goalID}`)
        goalItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const addNewGoal = (event) => {
        // Open modal
        setVisibility('visible')
    }

    const checkbox = async (event) => {
        // Mark goal as completed or not in database
        const goalID = event.target.parentElement.parentElement.parentElement.attributes[1].value;

        const response = await fetch('/api/data/completed', {
            method: 'PUT',
            body: JSON.stringify({
                id: goalID,
                completed: event.target.checked,
                type: 'Goal'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            getData()
        } else {
            console.error(response.statusText);
        }
    }

    return (
        <div id="goals" className={`card ${css`height: 23vh; width: 90%; margin: 5px auto;`}`}>
            <GoalsForm visibility={visibility} setVisibility={setVisibility} />
            <div className="card-header">
                <h2>Goals</h2>
                <img id="add-goal-button" src="./svgs/add.svg" alt="add" onClick={addNewGoal} />
            </div>
            <div id="goals-list">
                <ol>
                    {sortedGoals.length ? (
                        sortedGoals.map(((goal, index) =>
                            <div key={index} className="line" value={goal.id}>
                                <div id={'goal-' + goal.id} className={css`display: flex; flex-direction: column; margin: 5px; justify-content: space-evenly;`}>
                                    <div id={'goal-list-item-' + goal.id} className="list-item">
                                        <input type="checkbox" id={"is-completed-" + goal.id} onChange={checkbox} checked={goal.completed ? true : false} className={css`margin-right: 5px;`} />
                                        <label>{goal.goal}</label>
                                    </div>
                                    <form id={'goalForm-' + goal.id} className="hidden" onSubmit={submitEdit}>
                                        <input type="text" id={'goalInput-' + goal.id} onChange={(event) => setInputValue(event.target.value)} className={css`width: 100%;`} />
                                        <input type="submit" value="Save" />
                                        <button onClick={cancelEdit}>Cancel</button>
                                    </form>
                                </div>
                                <div className="edit-buttons">
                                    <img src="./svgs/edit.svg" alt="edit" onClick={editGoal} id={goal.id} value={goal.goal} />
                                    <img src="./svgs/delete.svg" alt="delete" onClick={deleteGoal} id={goal.id} />
                                </div>
                            </div>
                        ))) : (
                        <p className="empty">No goals yet! Click the plus to add a goal.</p>
                    )
                    }
                </ol>
            </div>
        </div>
    )
}