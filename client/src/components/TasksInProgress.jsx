import { useState } from 'react';
import { css } from '@emotion/css';
import TasksArchived from './TasksArchived';

export default function TasksInProgress ({ inProgressTasks, setInProgressTasks, getData, archivedTasks }) {
    const [visibility, setVisibility] = useState('hidden');

    const editProgress = (event) => {
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
        const progressID = event.target.attributes[2].nodeValue;

        if (window.confirm("Are you sure you want to archive this task?")) {
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
                alert(response.statusText);
            }
        }
    }

    const submitEdit = async (event) => {
        event.preventDefault();
        const formID = event.target.id;
        const progressID = event.target.parentElement.attributes[1].value;
        const formInput = event.target[0].value;
        const progressItem = document.getElementById(`progress-list-item-${progressID}`)

        const response = await fetch('/api/data/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: progressID,
                progress: formInput,
                type: 'Task'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            getData()
        } else {
            alert(response.statusText);
        }

        document.getElementById(formID).setAttribute('class', 'hidden');
        progressItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const cancelEdit = (event) => {
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
        const progressID = event.target.parentElement.parentElement.attributes[1].value;

        const response = await fetch('/api/data/completed', {
            method: 'PUT',
            body: JSON.stringify({
                id: progressID,
                completed: event.target.checked,
                type: 'Task'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            getData()
        } else {
            alert(response.statusText);
            console.log(response);
        }
    }

    const removeProgressTask = async (event) => {
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
            alert(response.statusText);
        }
    }

    const showArchiveModal = () => {
        setVisibility('visible');
    }

    return (
        <div id="in-progress-tasks" className={`card ${css`height: 30vh;`}`}>
            <div id="card-header">
                <h2>Tasks in Progress</h2>
                <img src="./svgs/archive.svg" alt="open-archive" onClick={showArchiveModal} />
            </div>
            {inProgressTasks.length ? (
                inProgressTasks.map((progress, index) =>
                    <div id="line" key={index} value={progress.id}>
                        <div id={'progress-list-item-' + progress.id} className="list-item">
                            <input type="checkbox" id={"is-completed-" + progress.id} onChange={checkbox} checked={progress.completed ? true : false} className={css`margin-right: 5px;`}/>
                            <label>{progress.task}</label>
                        </div>
                        <form id={'progressForm-' + progress.id} className="hidden" onSubmit={submitEdit}>
                            <input type="text" id={'progressInput-' + progress.id} onChange={(event) => setInputValue(event.target.value)} className={css`width: 100%;`}/>
                            <input type="submit" className="submit-button" />
                            <button id="cancel-edit" onClick={cancelEdit}>Cancel</button>
                        </form>
                        <div id="edit-buttons">
                            <img src="./svgs/minus.svg" alt="move-to-tasks" onClick={removeProgressTask} id={progress.id} />
                            <img src="./svgs/edit.svg" alt="edit" onClick={editProgress} id={progress.id} value={progress.task} />
                            <img src="./svgs/archive.svg" alt="archive" onClick={archiveProgress} id={progress.id} />
                        </div>
                    </div>
                )) : (
                    <p id="empty">No tasks in progress yet! Click the plus beside a task to add it here.</p>
            )
            }
            <TasksArchived visibility={visibility} setVisibility={setVisibility} getData={getData} archivedTasks={archivedTasks}/>
        </div>
    )
}