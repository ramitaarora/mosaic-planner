import { useState } from 'react';
import { css } from '@emotion/css';

export default function GoalsForm({ visibility, setVisibility }) {
    // Loading state variable for AI suggestions
    const [loading, setLoading] = useState(false);
    // Input variables for each goal
    const [yearly, setYearly] = useState('');
    const [monthly, setMonthly] = useState('');
    const [weekly, setWeekly] = useState('');

    const closeModal = () => {
        // Close modal
        setVisibility('hidden');
    }

    const saveGoal = async (event) => {
        // Save new goals to database
        event.preventDefault();
        const formID = event.target.id;

        const response = await fetch('/api/data/add', {
            method: 'POST',
            body: JSON.stringify({
                type: 'Goal',
                yearlyGoal: yearly,
                monthlyGoal: monthly,
                weeklyGoal: weekly,
                goal_type: 'Goals',
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            resetForm();
            closeModal();
            location.reload();
        } else {
            console.error(response.statusText);
        }
    }

    const getAISuggestions = (event) => {
        // Fetch AI suggestions and set suggestions in input boxes
        event.preventDefault();
        setLoading(true);

        fetch(`/api/chat/goals`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                let parsedGoals = JSON.parse(data);
                setYearly(parsedGoals.goalSuggestions[0]);
                setMonthly(parsedGoals.goalSuggestions[1]);
                setWeekly(parsedGoals.goalSuggestions[2]);
                setLoading(false);
            })
    }

    const resetForm = () => {
        // Reset form and input variables
        setWeekly('');
        setMonthly('');
        setYearly('');
    }

    return (
        <div id="modal-background" className={visibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`} />

                    <div id="goals-modal">
                        <div id="modal-header">
                            <h2>Add a New Goal</h2>
                            <p>Yearly resolutions break down into monthly goals, which can be further broken down into weekly goals.</p>
                        </div>
                        <form className={css`width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;`}>
                            {loading ? (
                                <img src="/svgs/loading.gif" alt="loading" height="60px" width="60px"/>
                            ) : <input type="submit" onClick={getAISuggestions} value="Get AI Suggestions!" />}
                        </form>
                        <form onSubmit={saveGoal} className={css`margin: 0 auto; width: 80%;`}>

                            <div id="form-input">
                                <label htmlFor='yearly'>Yearly Goal</label>
                                <textarea name="yearly" placeholder="Type your yearly goal here..." value={yearly} onChange={e => setYearly(e.target.value)} required></textarea>
                            </div>

                            <div id="form-input">
                                <label htmlFor='monthly'>Monthly Goal</label>
                                <textarea name="monthly" placeholder="Type your monthly goal here..." value={monthly} onChange={e => setMonthly(e.target.value)} required></textarea>
                            </div>

                            <div id="form-input">
                                <label htmlFor='weekly'>Weekly Goal</label>
                                <textarea name="weekly" placeholder="Type your weekly goal here..." value={weekly} onChange={e => setWeekly(e.target.value)} required></textarea>
                            </div>

                            <div id="form-submit-buttons">
                                <input type="submit" value="Save" />
                                <input type="reset" onClick={resetForm} value="Clear" />
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}