import { useEffect, useState } from 'react';
import { css } from '@emotion/css';

export default function TasksArchived({ visibility, setVisibility, archivedTasks, getData }) {
    // Final sorted variable to display tasks on dashboard
    const [sortedArchivedTasks, setSortedArchivedTasks] = useState(archivedTasks);

    useEffect(() => {
        // Sort tasks by date_completed if there is one, or date_dreated if there isn't
        const sortTasks = archivedTasks.sort((a, b) => {
            let dateA = a.date_completed ? new Date(a.date_completed) : new Date(a.date_created);
            let dateB = b.date_completed ? new Date(b.date_completed) : new Date(b.date_created);

            return dateB - dateA;
        })

        setSortedArchivedTasks(sortTasks);
    }, [archivedTasks])

    const closeModal = () => {
        // Close the archive modal
        setVisibility('hidden');
    }

    const undoArchive = async (event) => {
        // Change the status of the task in the database so that it is unarchived and incompleted
        const taskID = event.target.attributes[2].nodeValue;

        const response = await fetch('/api/data/taskEdits', {
            method: 'PUT',
            body: JSON.stringify({
                id: taskID,
                type: 'Undo Archive'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            getData();
        } else {
            console.error(response.statusText);
        }
    }

    const deleteTask = async (event) => {
        // Delete task from the database
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

    const formatDate = (date) => {
        // Date formatting to display date neatly
        let newDate = new Date(date);
        let monthNum = newDate.getMonth();
        let dateNum = newDate.getDate();
        let yearNum = newDate.getFullYear();
        let month;

        if (monthNum === 0) month = 'January';
        if (monthNum === 1) month = 'February';
        if (monthNum === 2) month = 'March';
        if (monthNum === 3) month = 'April';
        if (monthNum === 4) month = 'May';
        if (monthNum === 5) month = 'June';
        if (monthNum === 6) month = 'July';
        if (monthNum === 7) month = 'August';
        if (monthNum === 8) month = 'September';
        if (monthNum === 9) month = 'October';
        if (monthNum === 10) month = 'November';
        if (monthNum === 11) month = 'December';

        return `${month} ${dateNum} ${yearNum}`;
    }

    return (
        <div id="modal-background" className={visibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`} />

                    <div id="modal-header">
                        <h2>Archived Tasks</h2>
                    </div>

                    <div id="archived-tasks-modal" className={css`height: 300px; overflow: overlay;`}>
                        <ul>
                            {archivedTasks.length ? (
                                archivedTasks.map((task, index) => (
                                    <div id="line" key={index}>
                                        <div>
                                            <li>{task.task}</li>
                                            <p className={css`font-size: 12px;`}>{task.date_completed ? "Date Completed: " + formatDate(task.date_completed) : "Date Created: " + formatDate(task.date_created)}</p>
                                        </div>
                                        
                                        <div id="edit-buttons">
                                            <img src="./svgs/undo.svg" alt="unarchive" onClick={undoArchive} id={task.id} />
                                            <img src="./svgs/delete.svg" alt="edit" onClick={deleteTask} id={task.id} />
                                        </div>
                                        
                                    </div>
                                ))
                            ) : <p>No tasks archived yet.</p>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}