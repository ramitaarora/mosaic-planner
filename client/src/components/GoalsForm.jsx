import { useState, useEffect } from 'react';

export default function GoalsForm({ visibility, setVisibility }) {
    const [inputValue, setInputValue] = useState('');

    const closeModal = () => {
        setVisibility('form-hidden');
    }

    const submitNewGoal = async (event) => {
        event.preventDefault();
        const newGoalValue = event.target[0].value;

        if (newGoalValue.length) {
            const response = await fetch('/api/data/add', {
                method: 'POST',
                body: JSON.stringify({
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

    return (
        <div id="modal-background" className={visibility}>
            <div id="modal">
                <div id="modal-content">
                <img src="./svgs/exit.svg" alt="exit" onClick={closeModal}/>

                    <div id="goals-modal">
                    
                    </div>

                </div>
            </div>
        </div>
    )
}