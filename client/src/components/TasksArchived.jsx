import { useEffect, useState } from 'react';
import { css } from '@emotion/css';

export default function TasksArchived({ visibility, setVisibility, archivedTasks, getData }) {
    // Final sorted variable to display tasks on dashboard
    const [sortedArchivedTasks, setSortedArchivedTasks] = useState(archivedTasks);
    // List of month/years that exist in archived tasks for each month filters
    const [eachMonth, setEachMonth] = useState([]);

    const sortTasks = (tasksArray) => {
        // Sort tasks by date_completed if there is one, or date_created if there isn't
        const sortTasks = tasksArray.sort((a, b) => {
            let dateA = a.date_completed ? new Date(a.date_completed) : new Date(a.date_created);
            let dateB = b.date_completed ? new Date(b.date_completed) : new Date(b.date_created);

            return dateB - dateA;
        })

        setSortedArchivedTasks(sortTasks);
    }

    useEffect(() => {
        // Sort tasks for data from database when it changes
        sortTasks(archivedTasks);
    }, [archivedTasks])

    useEffect(() => {
        // Retrieve the month/year existing in archived tasks and create an array
        let months = [];

        for (let i = 0; i < archivedTasks.length; i++) {
            if (archivedTasks[i].date_completed) {
                let month = new Date(archivedTasks[i].date_completed).getMonth();
                let year = new Date(archivedTasks[i].date_completed).getFullYear();
                let findMonth = months.find((date) => date.month === month && date.year === year);
                if (!findMonth) {
                    months.push({
                        month: month,
                        year: year
                    });
                }
            } else {
                let month = new Date(archivedTasks[i].date_created).getMonth();
                let year = new Date(archivedTasks[i].date_created).getFullYear();
                let findMonth = months.find((date) => date.month === month && date.year === year);
                if (!findMonth) {
                    months.push({
                        month: month,
                        year: year
                    });
                }
            }
        }

        const sortedMonths = months.sort((a, b) => {
            let dateA = new Date(`${a.year}-${a.month}`);
            let dateB = new Date(`${b.year}-${b.month}`);

            return dateB - dateA;
        })

        setEachMonth(sortedMonths);
    }, [archivedTasks])

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

    const formatMonth = (monthNum) => {
        // Format month number to string for each month filter
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

        return month;
    }

    const filterMonth = (event) => {
        // Filter tasks by month or reset with "all" button
        let date = event.target.value;

        if (date === 'All') {
            sortTasks(archivedTasks);
        } else {
            let filteredMonth = new Date(date).getMonth();
            let filteredYear = new Date(date).getFullYear();

            const filteredTasks = archivedTasks.filter((task) => {
                if (task.date_completed) {
                    let month = new Date(task.date_completed).getMonth();
                    let year = new Date(task.date_completed).getFullYear();

                    if (`${year}-${month}` === `${filteredYear}-${filteredMonth}`) {
                        return task.date_completed;
                    }
                } else if (task.date_created) {
                    let month = new Date(task.date_created).getMonth();
                    let year = new Date(task.date_created).getFullYear();

                    if (`${year}-${month}` === `${filteredYear}-${filteredMonth}`) {
                        return task.date_created;
                    }
                }
            })
            sortTasks(filteredTasks);
        }
    }

    const closeModal = () => {
        // Close the archive modal
        setVisibility('hidden');
    }

    return (
        <div id="modal-background" className={visibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`} />

                    <div id="modal-header" className={css`display: flex; justify-content: space-between; width: 95%; align-items: center;`}>
                        <h2>Archived Tasks ({sortedArchivedTasks.length && sortedArchivedTasks.length})</h2>
                        <div id="archived-tasks-month">
                            <select onChange={filterMonth}>
                                <option>All</option>
                                {eachMonth.length && eachMonth.map((date, index) => (
                                    <option key={index}>{formatMonth(date.month)} {date.year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div id="archived-tasks-modal" className={css`height: 300px; overflow: overlay;`}>
                        <ul>
                            {sortedArchivedTasks.length ? (
                                sortedArchivedTasks.map((task, index) => (
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