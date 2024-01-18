import { useEffect, useState } from 'react';

export default function YearlyGoals({ yearGoals, setYearGoals }) {
    const [inputValue, setInputValue] = useState('');

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
            const response = await fetch('/api/data/deleteGoal', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: yearlyGoalID,
                    goalType: 'Yearly',
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

        const response = await fetch('/api/data/editGoal', {
            method: 'PUT',
            body: JSON.stringify({
                id: yearlyGoalID,
                goal: formInput,
                goalType: 'Yearly'
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

    const addNewGoal = (event) => {
        document.getElementById('add-yearly-goal').setAttribute('class', 'form-visible');
        document.getElementById('add-yearly-goal-button').setAttribute('class', 'form-hidden');
        document.getElementById('cancel-yearly-goal-button').setAttribute('class', 'form-visible');
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
                    goalType: 'Yearly'
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
                        setYearGoals(data.yearlyGoals.map(goal => goal));
                        document.getElementById('add-yearly-goal').setAttribute('class', 'form-hidden');
                        document.getElementById('cancel-yearly-goal-button').setAttribute('class', 'form-hidden');
                        document.getElementById('add-yearly-goal-button').setAttribute('class', 'form-visible');
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
        document.getElementById('add-yearly-goal').setAttribute('class', 'form-hidden');
        document.getElementById('cancel-yearly-goal-button').setAttribute('class', 'form-hidden');
        document.getElementById('add-yearly-goal-button').setAttribute('class', 'form-visible');
    }

    return (
        <div id="yearly-goals" className="card">
            <div id="card-header">
                <h2>Yearly Goals</h2>
                <img id="add-yearly-goal-button" src="./svgs/add.svg" alt="add" onClick={addNewGoal} />
                <img id="cancel-yearly-goal-button" src="./svgs/minus.svg" alt="minus" onClick={cancelNewGoal} className="form-hidden" />
            </div>
            
            <form id="add-yearly-goal" onSubmit={submitNewGoal} className="form-hidden">
                <input type="text" placeholder="Write new goal here..." value={inputValue} onChange={(event) => setInputValue(event.target.value)}/>
                <input type="submit" className="submit-button" />
                {/*<button id="cancel" onClick={cancelNewGoal}>Cancel</button>*/}
            </form>

            <div id="yearly-goals-list">
                <ol>
                    {yearGoals.map(((goal, index) =>
                        <div key={index} id="goal-line" value={goal.id}>
                            <div id={'yearlyGoal-' + goal.id} className="each-goal">
                                <li>{goal.yearly_goal}</li>
                                <form id={'yearlyForm-' + goal.id} className="form-hidden" onSubmit={submitYearlyEdit}>
                                    <input type="text" id={'yearlyInput-' + goal.id} onChange={(event) => setInputValue(event.target.value)} />
                                    <input type="submit" className="submit-button"/>
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
    )
}