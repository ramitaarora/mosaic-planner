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
            </main>
        </div>
    )
}