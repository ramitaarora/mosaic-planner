import { useState, useEffect } from 'react';
import { css } from '@emotion/css';

export default function Tasks({ allTasks, setAllTasks, getData }) {
    // Input state variable to add a new task
    const [inputValue, setInputValue] = useState('');
    // Loading state
    const [loading, setLoading] = useState(false);
    // Array for AI suggestions
    const [suggestions, setSuggestions] = useState([]);
    // Final array with sorted tasks to display on page
    const [sortedTasks, setSortedTasks] = useState([]);

    useEffect(() => {
        // Sort tasks by date created
        setSortedTasks([]);

        const tasksSorted = allTasks.sort((a, b) => {
            const timeA = a.date_created || '';
            const timeB = b.date_created || '';
            return timeB.localeCompare(timeA);
        })
        
        setSortedTasks(tasksSorted);
    }, [allTasks])

    const editTask = (event) => {
        // Show edit task form
        const taskID = event.target.attributes[2].nodeValue;
        const taskValue = event.target.attributes[3].nodeValue;

        const taskItem = document.getElementById(`task-list-item-${taskID}`)
        taskItem.setAttribute('class', 'hidden');

        const formID = document.getElementById(`taskForm-${taskID}`);
        formID.setAttribute('class', 'visible');

        const inputField = document.getElementById(`taskInput-${taskID}`);
        inputField.setAttribute('value', taskValue);
    }

    const deleteTask = async (event) => {
        // Delete task from database
        const taskID = event.target.attributes[2].nodeValue;

        if (window.confirm("Are you sure you want to delete this task?")) {
            const response = await fetch('/api/data/delete', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: taskID,
                    type: 'Task',
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                getData();
            } else {
                console.error(response.statusText);
            }
        }
    }

    const submitTaskEdit = async (event) => {
        // Submit task edit from database
        event.preventDefault();
        const taskFormID = event.target.id;
        const taskID = event.target.parentElement.parentElement.attributes[1].value;
        const formInput = event.target[0].value;
        const taskItem = document.getElementById(`task-list-item-${taskID}`)

        const response = await fetch('/api/data/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: taskID,
                task: formInput,
                type: 'Task'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            getData();
        } else {
            console.error(response.statusText);
        }

        document.getElementById(taskFormID).setAttribute('class', 'hidden');
        taskItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const cancelTaskEdit = (event) => {
        // Hide edit ask form
        event.preventDefault();
        const taskID = event.target.parentElement.parentElement.parentElement.attributes[1].value;
        const taskFormID = event.target.form.id;
        const taskItem = document.getElementById(`task-list-item-${taskID}`)

        const formID = document.getElementById(taskFormID);
        formID.setAttribute('class', 'hidden');
        taskItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const addNewTask = (event) => {
        // Show add new task form
        document.getElementById('add-task').setAttribute('class', 'visible');
        document.getElementById('add-task-button').setAttribute('class', 'hidden');
        document.getElementById('cancel-task-button').setAttribute('class', 'visible');
        setInputValue('');
    }

    const submitNewTask = async (event) => {
        // Add new task to the database
        event.preventDefault();
        const newTaskValue = event.target[0].value;

        if (newTaskValue.length) {
            const response = await fetch('/api/data/add', {
                method: 'POST',
                body: JSON.stringify({
                    task: newTaskValue,
                    type: 'Task'
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                getData();
                document.getElementById('add-task').setAttribute('class', 'hidden');
                document.getElementById('cancel-task-button').setAttribute('class', 'hidden');
                document.getElementById('add-task-button').setAttribute('class', 'visible');
            } else {
                console.error(response.statusText);
            }
        }
    }

    const cancelNewTask = (event) => {
        // Hide new task form
        event.preventDefault();
        document.getElementById('add-task').setAttribute('class', 'hidden');
        document.getElementById('cancel-task-button').setAttribute('class', 'hidden');
        document.getElementById('add-task-button').setAttribute('class', 'visible');
    }

    const addProgressTask = async (event) => {
        // Change inProgress state of task to true, moving it to Tasks in Progress component
        const taskID = event.target.attributes[2].nodeValue;

        const response = await fetch('/api/data/taskEdits', {
            method: 'PUT',
            body: JSON.stringify({
                id: taskID,
                inProgress: true,
                type: 'In Progress'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            getData();
        } else {
            console.error(response.statusText);
        }
    }

    const getAISuggestions = (event) => {
        // Get AI suggestions for new tasks
        event.preventDefault();
        setSuggestions([]);
        setLoading(true);

        fetch(`/api/chat/tasks`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                let parsedGoals = JSON.parse(data);
                setSuggestions(parsedGoals.taskSuggestions);
                setLoading(false);
            })
    }

    const addAISuggestion = async (event) => {
        // By clicking on an AI suggestion, it will add new task to the database
        const newTaskValue = event.target.innerText;

        if (newTaskValue.length) {
            const response = await fetch('/api/data/add', {
                method: 'POST',
                body: JSON.stringify({
                    task: newTaskValue,
                    type: 'Task'
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                getData();
                document.getElementById('add-task').setAttribute('class', 'hidden');
                document.getElementById('cancel-task-button').setAttribute('class', 'hidden');
                document.getElementById('add-task-button').setAttribute('class', 'visible');

                let removeSuggestion = suggestions.filter((item) => item != event.target.innerText);
                setSuggestions(removeSuggestion);
            } else {
                console.error(response.statusText);
            }
        }
    }

    const removeAISuggestions = () => {
        // Clear AI suggestions
        setSuggestions([]);
    }

    return (
        <div id="tasks" className={`card ${css`height: 30vh;`}`}>
            <div className="card-header">
                <h2>All Tasks</h2>

                {sortedTasks.length ? (
                    <div id="ai-suggestions" className={css`margin-right: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center;`}>
                        {loading ? (
                            <img src="/svgs/loading.gif" alt="loading" height="35px" width="35px" />
                        ) : <input type="submit" onClick={getAISuggestions} value="AI Suggestions" />}
                    </div>
                ) : null}

                <img id="add-task-button" src="./svgs/add.svg" alt="add" onClick={addNewTask} />
                <img id="cancel-task-button" src="./svgs/minus.svg" alt="minus" onClick={cancelNewTask} className="hidden" />
            </div>

            <form id="add-task" onSubmit={submitNewTask} className="hidden">
                <input type="text" placeholder="Write new task here..." value={inputValue} onChange={(event) => setInputValue(event.target.value)} className={css`width: 80%;`} />
                <input type="submit" value="Save"/>
            </form>

            {sortedTasks.length ? (
                <div className="suggestions">
                    {suggestions.length ? (
                        <div className={css`display: flex;`}>
                            <div>
                                {suggestions.map((item, index) => (
                                    <p key={index} className="each-suggestion" onClick={addAISuggestion}>{item}</p>
                                ))}
                            </div>
                            <img src="./svgs/exit.svg" alt="delete-suggestions" className={css`float: right; margin-right: 20px; cursor: pointer;`} onClick={removeAISuggestions} />
                        </div>
                    ) : null}
                </div>
            ) : null}
            <div id="task-list">
                <ol>
                    {sortedTasks.length ? (
                        sortedTasks.map((task, index) =>
                            <div key={index} className="line" value={task.id}>
                                <div id={'task-' + task.id} className={css`display: flex; flex-direction: column; margin: 5px; justify-content: space-evenly;`}>
                                    <div id={'task-list-item-' + task.id} className="list-item">
                                        <li id={'task-list-item-' + task.id} >{task.task}</li>
                                    </div>
                                    <form id={'taskForm-' + task.id} className="hidden" onSubmit={submitTaskEdit}>
                                        <input type="text" id={'taskInput-' + task.id} onChange={(event) => setInputValue(event.target.value)} className={css`width: 100%;`} />
                                        <input type="submit" value="Save"/>
                                        <button onClick={cancelTaskEdit}>Cancel</button>
                                    </form>
                                </div>
                                <div className="edit-buttons">
                                    <img src="./svgs/add.svg" alt="add-to-in-progress" id={task.id} onClick={addProgressTask}/>
                                    <img src="./svgs/edit.svg" alt="edit" onClick={editTask} id={task.id} value={task.task} />
                                    <img src="./svgs/delete.svg" alt="edit" onClick={deleteTask} id={task.id} />
                                </div>
                            </div>
                        )) : (
                        
                        <div className="empty">
                            <p>No tasks yet! Click the plus to add a task.</p>
                            <div id="ai-suggestions" className={css`width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;`}>
                                {loading ? (
                                    <img src="/svgs/loading.gif" alt="loading" height="60px" width="60px"/>
                                ) : <input type="submit" onClick={getAISuggestions} value="Get AI Suggestions!" />}
                                
                            </div>
                            <div className="suggestions">
                            {suggestions.length ? (
                                suggestions.map((item, index) => (
                                    <p className="each-suggestion" key={index} onClick={addAISuggestion}>{item}</p>
                                ))
                            ): null}
                            </div>
                        </div>
                    )}
                </ol>
            </div>
        </div>
    )
}