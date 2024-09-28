import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import TasksArchived from './TasksArchived';

export default function TasksInProgress({ inProgressTasks, setInProgressTasks, getData, archivedTasks, today }) {
    // Set visibility of archived tasks modal
    const [visibility, setVisibility] = useState('hidden');
    // Input value for edit tasks form
    const [inputValue, setInputValue] = useState('');
    // Final sorted tasks array to display on dashboared
    const [sortedTasks, setSortedTasks] = useState([]);

    useEffect(() => {
        // Sort tasks by date created, then sort by completed status
        setSortedTasks([]);

        const tasksSorted = inProgressTasks.sort((a, b) => {
            const timeA = a.date_created || '';
            const timeB = b.date_created || '';
            return timeA.localeCompare(timeB);
        })

        for (let i = 0; i < tasksSorted.length; i++) {
            if (!tasksSorted[i].completed) {
                setSortedTasks((prev) => [tasksSorted[i], ...prev]);
            } else {
                setSortedTasks((prev) => [...prev, tasksSorted[i]]);
            }
        }
    }, [inProgressTasks])

    const editProgress = (event) => {
        // Show edit task form
        const progressID = event.target.attributes[2].nodeValue;
        const progressValue = event.target.attributes[3].nodeValue;

        const progressItem = document.getElementById(`progress-list-item-${progressID}`)
        progressItem.setAttribute('class', 'hidden');

        const formID = document.getElementById(`progressForm-${progressID}`);
        formID.setAttribute('class', 'visible');

        const inputField = document.getElementById(`progressInput-${progressID}`);
        inputField.setAttribute('value', progressValue);
    }

    const archiveProgress = async (event) => {
        // Set task as archived in database
        const progressID = event.target.attributes[2].nodeValue;

        const response = await fetch('/api/data/taskEdits', {
            method: 'PUT',
            body: JSON.stringify({
                id: progressID,
                type: 'Archive Task'
            }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            getData();
        } else {
            console.error(response.statusText);
        }
    }

    const submitEdit = async (event) => {
        // Submit task edits to database
        event.preventDefault();
        const formID = event.target.id;
        const progressID = event.target.parentElement.attributes[1].value;
        const formInput = event.target[0].value;
        const progressItem = document.getElementById(`progress-list-item-${progressID}`)

        const response = await fetch('/api/data/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: progressID,
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

        document.getElementById(formID).setAttribute('class', 'hidden');
        progressItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const cancelEdit = (event) => {
        // Hide edit task form
        event.preventDefault();
        const formID = event.target.form.id;
        const progressID = event.target.parentElement.parentElement.attributes[1].value;

        const formEl = document.getElementById(formID);
        formEl.setAttribute('class', 'hidden');

        const progressItem = document.getElementById(`progress-list-item-${progressID}`)
        progressItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const checkbox = async (event) => {
        // Set task as completed or incomplete in databbase
        const progressID = event.target.parentElement.parentElement.attributes[1].value;

        const response = await fetch('/api/data/completed', {
            method: 'PUT',
            body: JSON.stringify({
                id: progressID,
                completed: event.target.checked,
                type: 'Task',
                date: today,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            getData()
        } else {
            console.error(response.statusText);
            console.log(response);
        }
    }

    const removeProgressTask = async (event) => {
        // Mark task as not in progress and move it to tasks component
        const taskID = event.target.id;

        const response = await fetch('/api/data/taskEdits', {
            method: 'PUT',
            body: JSON.stringify({
                id: taskID,
                inProgress: false,
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

    const showArchiveModal = () => {
        // Show archived tasks modal
        setVisibility('visible');
    }

    return (
        <div id="in-progress-tasks" className={`card ${css`height: 40vh;`}`}>
            <div className="card-header">
                <h2>Tasks in Progress</h2>
                <img src="./svgs/archive.svg" alt="open-archive" onClick={showArchiveModal} />
            </div>
            {sortedTasks.length ? (
                sortedTasks.map((progress, index) =>
                    <div className="line" key={index} value={progress.id}>
                        <div id={'progress-list-item-' + progress.id} className="list-item">
                            <input type="checkbox" id={"is-completed-" + progress.id} onChange={checkbox} checked={progress.completed ? true : false} className={css`margin-right: 5px;`} />
                            <label>{progress.task}</label>
                        </div>
                        <form id={'progressForm-' + progress.id} className="hidden" onSubmit={submitEdit}>
                            <input type="text" id={'progressInput-' + progress.id} onChange={(event) => setInputValue(event.target.value)} className={css`width: 100%;`} />
                            <input type="submit" className="submit-button" value="Save" />
                            <button onClick={cancelEdit}>Cancel</button>
                        </form>
                        <div id="edit-buttons">
                            <img src="./svgs/minus.svg" alt="move-to-tasks" onClick={removeProgressTask} id={progress.id} />
                            <img src="./svgs/edit.svg" alt="edit" onClick={editProgress} id={progress.id} value={progress.task} />
                            <img src="./svgs/archive.svg" alt="archive" onClick={archiveProgress} id={progress.id} />
                        </div>
                    </div>
                )) : (
                <div id="empty">
                    <p>No tasks in progress yet! Click the plus beside a task to add it here.</p>
                </div>

            )
            }
            <TasksArchived visibility={visibility} setVisibility={setVisibility} getData={getData} archivedTasks={archivedTasks} />
        </div>
    )
}