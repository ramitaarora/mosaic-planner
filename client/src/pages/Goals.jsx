import Header from "../components/Header";
import { useState, useEffect } from 'react';

export default function Goals() {
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
        getGoalsData();
    }, [])

    return (
        <div>
            {/* <Header /> */}
            <main> 
            {/* This will eventually be its own component */}
                <section>
                    <div>
                        <h2>Parent Goal</h2>
                        <p>Icons to edit, delete, archive</p>
                    </div>
                    <div>
                        <h2>List of Steps</h2>
                        <p>Icon to add a step</p>
                        <ol>
                            <li>1.</li>
                            <li>2.</li>
                            <li>3.</li>
                        </ol>
                    </div>
                    <div>
                        <h2>Tasks</h2>
                        <p>Icon to add a task</p>
                        <ul>
                            <li>Checkbox and task</li>
                            <li>Checkbox and task</li>
                            <li>Checkbox and task</li>
                        </ul>
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