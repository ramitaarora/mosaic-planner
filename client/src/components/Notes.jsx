export default function Notes({ notes, setNotes, inputValue, setInputValue}) {
    const editNote = (event) => {
        const noteID = event.target.attributes[2].nodeValue;
        const noteValue = event.target.attributes[3].nodeValue;

        const formID = document.getElementById(`noteForm-${noteID}`);
        formID.setAttribute('class', 'form-visible');

        const inputField = document.getElementById(`noteInput-${noteID}`);
        inputField.setAttribute('value', noteValue);
    }

    const deleteNote = async (event) => {
        const noteID = event.target.attributes[2].nodeValue;

        if (window.confirm("Are you sure you want to delete this goal?")) {
            const response = await fetch('/api/data/deleteNote', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: noteID,
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                // console.log(response.statusText);
                fetch('/api/data/allgoals')
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json(); // or response.text() for text data
                    })
                    .then((data) => {
                        // console.log(data);
                        setNotes(data.notes.map(note => note));
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
            } else {
                alert(response.statusText);
            }
        }
    }

    const submitNoteEdit = async (event) => {
        event.preventDefault();
        const noteFormID = event.target.id;
        const noteID = event.target.parentElement.parentElement.attributes[1].value;
        const formInput = event.target[0].value;

        const response = await fetch('/api/data/editNote', {
            method: 'POST',
            body: JSON.stringify({
                id: noteID,
                note: formInput
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // console.log(response.statusText);
            fetch('/api/data/allgoals')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json(); // or response.text() for text data
                })
                .then((data) => {
                    // console.log(data);
                    setNotes(data.notes.map(note => note));
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        } else {
            alert(response.statusText);
        }

        document.getElementById(noteFormID).setAttribute('class', 'form-hidden');
        setInputValue('');
    }

    const cancelNoteEdit = (event) => {
        event.preventDefault();
        const noteFormID = event.target.form.id;

        const formID = document.getElementById(noteFormID);
        formID.setAttribute('class', 'form-hidden');
        setInputValue('');
    }

    return (
        <div id="notes" className="card">
            <h2>Notes & Reminders</h2>
            <div id="notes-list">
                <ol>
                    {notes.map((note, index) =>
                        <div key={index} id="goal-line" value={note.id}>
                            <div id={'note-' + note.id} className="each-goal">
                                <li>{note.note}</li>
                                <form id={'noteForm-' + note.id} className="form-hidden" onSubmit={submitNoteEdit}>
                                    <input id={'noteInput-' + note.id} onChange={(event) => setInputValue(event.target.value)} />
                                    <input type="submit" />
                                    <button id="cancel-edit" onClick={cancelNoteEdit}>Cancel</button>
                                </form>
                            </div>
                            <div id="edit-buttons">
                                <img src="./svgs/edit.svg" alt="edit" onClick={editNote} id={note.id} value={note.note} />
                                <img src="./svgs/delete.svg" alt="edit" onClick={deleteNote} id={note.id} />
                            </div>
                        </div>
                    )}
                </ol>
            </div>
        </div>
    )
}