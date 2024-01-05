export default function WeeklyGoals({ weekGoals, setWeekGoals, inputValue, setInputValue }) {
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

    return (
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
    )
}