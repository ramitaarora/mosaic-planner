import { useEffect, useState } from 'react';

export default function Goals({ goals, setGoals, goalType }) {
    const [inputValue, setInputValue] = useState('');

    const editGoal = (event) => {
        const goalID = event.target.attributes[2].nodeValue;
        const goalValue = event.target.attributes[3].nodeValue;

        const formID = document.getElementById(`goalForm-${goalID}`);
        formID.setAttribute('class', 'form-visible');

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
                // console.log(response.statusText);
                fetch('/api/data/allData')
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json(); // or response.text() for text data
                    })
                    .then((data) => {
                        // console.log(data);
                        // setGoals(data.goals.filter(goal => goal.goal_type === goalType));
                        location.reload();
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
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
            // console.log(response.statusText);
            fetch('/api/data/allData')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json(); // or response.text() for text data
                })
                .then((data) => {
                    // console.log(data);
                    setGoals(data.goals.filter(goal => goal.goal_type === goalType));
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        } else {
            alert(response.statusText);
        }

        document.getElementById(formID).setAttribute('class', 'form-hidden');
        setInputValue('');
    }

    const cancelEdit = (event) => {
        event.preventDefault();
        const formID = event.target.form.id;

        const formEl = document.getElementById(formID);
        formEl.setAttribute('class', 'form-hidden');
        setInputValue('');
    }

    const addNewGoal = (event) => {
        console.log(event);
        // document.getElementById('add-goal').setAttribute('class', 'form-visible');
        // document.getElementById('add-goal-button').setAttribute('class', 'form-hidden');
        // document.getElementById('cancel-goal-button').setAttribute('class', 'form-visible');
    }

    const submitNewGoal = async (event) => {
        event.preventDefault();
        const newGoalValue = event.target[0].value;

        if (newGoalValue.length) {
            const response = await fetch('/api/data/add', {
                method: 'POST',
                body: JSON.stringify({
                    userID: 1,
                    goal: newGoalValue,
                    type: 'Goal'
                }),
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.ok) {
                // console.log(response.statusText);
                fetch('/api/data/allData')
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json(); // or response.text() for text data
                    })
                    .then((data) => {
                        // console.log(data);
                        setGoals(data.goals.filter(goal => goal.goal_type === goalType));
                        document.getElementById('add-goal').setAttribute('class', 'form-hidden');
                        document.getElementById('cancel-goal-button').setAttribute('class', 'form-hidden');
                        document.getElementById('add-goal-button').setAttribute('class', 'form-visible');
                        setInputValue('')
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
            } else {
                alert(response.statusText);
            }
        }
    }

    const cancelNewGoal = (event) => {
        console.log(event)
        event.preventDefault();
        // document.getElementById('add-goal').setAttribute('class', 'form-hidden');
        // document.getElementById('cancel-goal-button').setAttribute('class', 'form-hidden');
        // document.getElementById('add-goal-button').setAttribute('class', 'form-visible');
    }

    return (
        <div id="goals" className="card">
            <div id="card-header">
                <h2>{goalType} Goals</h2>
                <img id="add-goal-button" src="./svgs/add.svg" alt="add" onClick={addNewGoal} />
                <img id="cancel-goal-button" src="./svgs/minus.svg" alt="minus" onClick={cancelNewGoal} className="form-hidden" />
            </div>
            
            {/*<form id="add-goal" onSubmit={submitNewGoal} className="form-hidden">
                <input type="text" placeholder="Write new goal here..." value={inputValue} onChange={(event) => setInputValue(event.target.value)}/>
                <input type="submit" className="submit-button" />
            </form> */}

            <div id="goals-list">
                <ol>
                    {goals.map(((goal, index) =>
                        <div key={index} id="line" value={goal.id}>
                            <div id={'goal-' + goal.id} className="each-goal">
                                <li>{goal.goal}</li>
                                <form id={'goalForm-' + goal.id} className="form-hidden" onSubmit={submitEdit}>
                                    <input type="text" id={'goalInput-' + goal.id} onChange={(event) => setInputValue(event.target.value)} />
                                    <input type="submit" className="submit-button"/>
                                    <button id="cancel-edit" onClick={cancelEdit}>Cancel</button>
                                </form>
                            </div>
                            <div id="edit-buttons">
                                <img src="./svgs/edit.svg" alt="edit" onClick={editGoal} id={goal.id} value={goal.goal} />
                                <img src="./svgs/delete.svg" alt="edit" onClick={deleteGoal} id={goal.id} />
                            </div>
                        </div>
                    ))}
                </ol>
            </div>
        </div>
    )
}