export default function MonthlyGoals({ monthGoals, setMonthGoals, inputValue, setInputValue }) {
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

    return (
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
    )
}