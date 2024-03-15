import { useState } from 'react';
import { css } from '@emotion/css';

export default function Tasks({ allTasks, setAllTasks, getData }) {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const editTask = (event) => {
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
                alert(response.statusText);
            }
        }
    }

    const submitTaskEdit = async (event) => {
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
            alert(response.statusText);
        }

        document.getElementById(taskFormID).setAttribute('class', 'hidden');
        taskItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const cancelTaskEdit = (event) => {
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
        document.getElementById('add-task').setAttribute('class', 'visible');
        document.getElementById('add-task-button').setAttribute('class', 'hidden');
        document.getElementById('cancel-task-button').setAttribute('class', 'visible');
        setInputValue('');
    }

    const submitNewTask = async (event) => {
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
                alert(response.statusText);
            }
        }
    }

    const cancelNewTask = (event) => {
        event.preventDefault();
        document.getElementById('add-task').setAttribute('class', 'hidden');
        document.getElementById('cancel-task-button').setAttribute('class', 'hidden');
        document.getElementById('add-task-button').setAttribute('class', 'visible');
    }

    const addProgressTask = async (event) => {
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
            alert(response.statusText);
        }
    }

    const getAISuggestions = (event) => {
        event.preventDefault();
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
            } else {
                alert(response.statusText);
            }
        }
    }

    return (
        <div id="tasks" className={`card ${css`height: 33vh;`}`}>
            <div id="card-header">
                <h2>All Tasks</h2>
                <img id="add-task-button" src="./svgs/add.svg" alt="add" onClick={addNewTask} />
                <img id="cancel-task-button" src="./svgs/minus.svg" alt="minus" onClick={cancelNewTask} className="hidden" />
            </div>

            <form id="add-task" onSubmit={submitNewTask} className="hidden">
                <input type="text" placeholder="Write new task here..." value={inputValue} onChange={(event) => setInputValue(event.target.value)} className={css`width: 80%;`} />
                <input type="submit" />
            </form>
            <div id="task-list">
                <ol>
                    {allTasks.length ? (
                        allTasks.map((task, index) =>
                            <div key={index} id="line" value={task.id}>
                                <div id={'task-' + task.id} className={css`display: flex; flex-direction: column; margin: 5px; justify-content: space-evenly;`}>
                                    <div id={'task-list-item-' + task.id} className="list-item">
                                        <li id={'task-list-item-' + task.id} >{task.task}</li>
                                    </div>
                                    <form id={'taskForm-' + task.id} className="hidden" onSubmit={submitTaskEdit}>
                                        <input type="text" id={'taskInput-' + task.id} onChange={(event) => setInputValue(event.target.value)} className={css`width: 100%;`} />
                                        <input type="submit" />
                                        <button id="cancel-edit" onClick={cancelTaskEdit}>Cancel</button>
                                    </form>
                                </div>
                                <div id="edit-buttons">
                                    <img src="./svgs/add.svg" alt="add-to-in-progress" id={task.id} onClick={addProgressTask}/>
                                    <img src="./svgs/edit.svg" alt="edit" onClick={editTask} id={task.id} value={task.task} />
                                    <img src="./svgs/delete.svg" alt="edit" onClick={deleteTask} id={task.id} />
                                </div>
                            </div>
                        )) : (
                        
                        <div>
                            <p id="empty">No tasks yet! Click the plus to add a task.</p>
                            <div id="ai-suggestions" className={css`width: 100%; display: flex; justify-content: center; align-items: center;`}>
                                <input type="submit" onClick={getAISuggestions} value="Get AI Suggestions!" />
                                {loading ? (
                                    <img src="/svgs/loading.gif" alt="loading" height="60px" width="60px"/>
                                ) : (
                                    <img src="/svgs/loading.gif" alt="loading" height="60px" width="60px" className={css`visibility: hidden;`}/>
                                )}
                                
                            </div>
                            <div id="suggestions">
                            {suggestions.length ? (
                                suggestions.map((item, index) => (
                                    <p id="each-suggestion" key={index} onClick={addAISuggestion}>{item}</p>
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