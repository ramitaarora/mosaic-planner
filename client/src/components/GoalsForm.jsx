import { useState, useEffect } from 'react';
import { css } from '@emotion/css';

export default function GoalsForm({ visibility, setVisibility }) {

    const closeModal = () => {
        setVisibility('hidden');
    }

    const saveGoal = async (event) => {
        event.preventDefault();
        const formID = event.target.id;
        let yearlyGoal = event.target[0].value;
        let monthlyGoal = event.target[1].value;
        let weeklyGoal = event.target[2].value;

        const response = await fetch('/api/data/add', {
            method: 'POST',
            body: JSON.stringify({
                type: 'Goal',
                yearlyGoal: yearlyGoal,
                monthlyGoal: monthlyGoal,
                weeklyGoal: weeklyGoal,
                goal_type: 'Goals',
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // console.log(response.statusText);
            alert('Goal saved!')
            document.getElementById(formID).reset();
            closeModal();
            location.reload();
        } else {
            alert(response.statusText);
        }
    }

    return (
        <div id="modal-background" className={visibility}>
            <div id="modal">
                <div id="modal-content">
                <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`}/>

                    <div id="goals-modal">
                        <form id="save-goal" onSubmit={saveGoal}>
                            <p>Yearly resolutions break down into monthly goals, which can be further broken down into weekly goals.</p>
                            <div id="form-input">
                                <label htmlFor='yearly'>Yearly Goal</label>
                                <input type="text" name="yearly" placeholder="Type your yearly goal here..." required />
                            </div>

                            <div id="form-input">
                                <label htmlFor='monthly'>Monthly Goal</label>
                                <input type="text" name="monthly" placeholder="Type your monthly goal here..." required />
                            </div>

                            <div id="form-input">
                                <label htmlFor='weekly'>Weekly Goal</label>
                                <input type="text" name="weekly" placeholder="Type your weekly goal here..." required />
                            </div>

                            <div id="form-submit-buttons">
                                <input type="submit" value="Save" />
                                <input type="reset" value="Reset" />
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}