import { css } from '@emotion/css';

export default function TasksArchived({ visibility, setVisibility, archivedTasks, getData }) {
    const closeModal = () => {
        setVisibility('hidden');
    }

    const undoArchive = async (event) => {
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
            alert(response.statusText);
        }
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

    return (
        <div id="modal-background" className={visibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`} />

                    <div id="modal-header">
                        <h2>Archived Tasks</h2>
                    </div>

                    <div id="archived-tasks-modal">
                        <ul>
                            {archivedTasks.length ? (
                                archivedTasks.map((task, index) => (
                                    <div id="line" key={index}>
                                        <li>{task.task}</li>
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