import { useState, useEffect } from 'react';
import { css } from '@emotion/css';

export default function Projects() {
    const [parentGoals, setParentGoals] = useState([]);
    const [steps, setSteps] = useState([]);
    const [tasks, setTasks] = useState([])

    const getGoalsData = async () => {
        try {
            const response = await fetch('/api/data/goals-tasks');
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setParentGoals(data.goals.filter((goal) => goal.parent_goal === null));
                setSteps(data.goals.filter((goal) => goal.parent_goal !== null))
                setTasks(data.tasks);
                console.log("parentGoals", parentGoals);
                console.log("steps", steps)
                console.log("tasks", tasks);
            }
        } catch(error) {
            console.error(error);
        }
    }

    useEffect(() => {
        // getGoalsData();
    }, [])

    return (
        <div className={css`width: 99vw; overflow: overlay;`}>

        {/* This will eventually be its own component */}
            <main className={`card ${css`width: fit-content;`}`}> 
            
                <section>
                    <div>
                        <h2>Project Name</h2>
                        <p>Icons to edit, delete, archive</p>
                        <p>Progress bar of entire goal</p>
                    </div>
                    <div>
                        <h2>List of Steps</h2>
                        <p>Icon to add a step</p>
                        <p>Progress bar of Steps</p>
                        <ol>
                            <div>
                                <li>1.</li>
                                <p>Progress bar of this step</p>
                                <p>Icon to add a task</p>
                                <ul>
                                    <li>Checkbox and task</li>
                                    <li>Checkbox and task</li>
                                    <li>Checkbox and task</li>
                                </ul>
                            </div>
                            <div>
                                <li>1.</li>
                                <p>Progress bar of this step</p>
                                <p>Icon to add a task</p>
                                <ul>
                                    <li>Checkbox and task</li>
                                    <li>Checkbox and task</li>
                                    <li>Checkbox and task</li>
                                </ul>
                            </div>
                            <div>
                                <li>1.</li>
                                <p>Progress bar of this step</p>
                                <p>Icon to add a task</p>
                                <ul>
                                    <li>Checkbox and task</li>
                                    <li>Checkbox and task</li>
                                    <li>Checkbox and task</li>
                                </ul>
                            </div>
                        </ol>
                    </div>

                    <div>
                        <h2>Daily Habits related to goal</h2>
                        <p>Icon to add a habit or edit existing habit to be part of this goal</p>
                        <ul>
                            <li>Habit</li>
                            <li>Habit</li>
                            <li>Habit</li>
                        </ul>
                    </div>
                </section>

            </main>
        </div>
    )
}