import { useEffect, useState } from 'react';

export default function MonthlyGoals({ monthGoals, setMonthGoals }) {
    const [inputValue, setInputValue] = useState('');

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
            const response = await fetch('/api/data/deleteGoal', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: monthlyGoalID,
                    goalType: 'Monthly'
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

        const response = await fetch('/api/data/editGoal', {
            method: 'PUT',
            body: JSON.stringify({
                id: monthlyGoalID,
                goal: formInput,
                goalType: 'Monthly'
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

    const addNewGoal = (event) => {
        document.getElementById('add-monthly-goal').setAttribute('class', 'form-visible');
        document.getElementById('add-monthly-goal-button').setAttribute('class', 'form-hidden');
        document.getElementById('cancel-monthly-goal-button').setAttribute('class', 'form-visible');
    }

    const submitNewGoal = async (event) => {
        event.preventDefault();
        const newGoalValue = event.target[0].value;

        if (newGoalValue.length) {
            const response = await fetch('/api/data/addGoal', {
                method: 'POST',
                body: JSON.stringify({
                    userID: 1,
                    goal: newGoalValue,
                    goalType: 'Monthly'
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
                        setMonthGoals(data.monthlyGoals.map(goal => goal));
                        document.getElementById('add-monthly-goal').setAttribute('class', 'form-hidden');
                        document.getElementById('cancel-monthly-goal-button').setAttribute('class', 'form-hidden');
                        document.getElementById('add-monthly-goal-button').setAttribute('class', 'form-visible');
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
        event.preventDefault();
        document.getElementById('add-monthly-goal').setAttribute('class', 'form-hidden');
        document.getElementById('cancel-monthly-goal-button').setAttribute('class', 'form-hidden');
        document.getElementById('add-monthly-goal-button').setAttribute('class', 'form-visible');
    }

    return (
        <div id="monthly-goals" className="card">
            <div id="card-header">
                <h2>Monthly Goals</h2>
                <img id="add-monthly-goal-button" src="./svgs/add.svg" alt="add" onClick={addNewGoal} />
                <img id="cancel-monthly-goal-button" src="./svgs/minus.svg" alt="minus" onClick={cancelNewGoal} className="form-hidden" />
            </div>

            <form id="add-monthly-goal" onSubmit={submitNewGoal} className="form-hidden">
                <input type="text" placeholder="Write new goal here..." value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
                <input type="submit" className="submit-button" />
                {/*<button id="cancel" onClick={cancelNewGoal}>Cancel</button>*/}
            </form>
            <div id="monthly-goals-list">
                <ol>
                    {monthGoals.map(((goal, index) =>
                        <div key={index} id="goal-line" value={goal.id}>
                            <div id={'monthlyGoal-' + goal.id} className="each-goal">
                                <li>{goal.goal}</li>
                                <form id={'monthlyForm-' + goal.id} className="form-hidden" onSubmit={submitMonthlyEdit}>
                                    <input type="text" id={'monthlyInput-' + goal.id} onChange={(event) => setInputValue(event.target.value)} />
                                    <input type="submit" className="submit-button" />
                                    <button id="cancel-edit" onClick={cancelMonthlyEdit}>Cancel</button>
                                </form>
                            </div>
                            <div id="edit-buttons">
                                <img src="./svgs/edit.svg" alt="edit" onClick={editMonthlyGoal} id={goal.id} value={goal.goal} />
                                <img src="./svgs/delete.svg" alt="edit" onClick={deleteMonthlyGoal} id={goal.id} />
                            </div>
                        </div>
                    ))}
                </ol>
            </div>
        </div>
    )
}