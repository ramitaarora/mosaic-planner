import { useEffect, useState } from 'react';
import { css } from '@emotion/css';

export default function Notes({ notes, setNotes, getData }) {
    const [inputValue, setInputValue] = useState('');

    const editNote = (event) => {
        const noteID = event.target.attributes[2].nodeValue;
        const noteValue = event.target.attributes[3].nodeValue;

        const noteItem = document.getElementById(`note-list-item-${noteID}`)
        noteItem.setAttribute('class', 'hidden');

        const formID = document.getElementById(`noteForm-${noteID}`);
        formID.setAttribute('class', 'visible');

        const inputField = document.getElementById(`noteInput-${noteID}`);
        inputField.setAttribute('value', noteValue);
    }

    const deleteNote = async (event) => {
        const noteID = event.target.attributes[2].nodeValue;

        if (window.confirm("Are you sure you want to delete this note?")) {
            const response = await fetch('/api/data/delete', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: noteID,
                    type: 'Note',
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

    const submitNoteEdit = async (event) => {
        event.preventDefault();
        const noteFormID = event.target.id;
        const noteID = event.target.parentElement.parentElement.attributes[1].value;
        const formInput = event.target[0].value;
        const noteItem = document.getElementById(`note-list-item-${noteID}`)

        const response = await fetch('/api/data/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: noteID,
                note: formInput,
                type: 'Note'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            getData();
        } else {
            alert(response.statusText);
        }

        document.getElementById(noteFormID).setAttribute('class', 'hidden');
        noteItem.setAttribute('class', 'visible');
        setInputValue('');
    }

    const cancelNoteEdit = (event) => {
        event.preventDefault();
        const noteID = event.target.parentElement.parentElement.parentElement.attributes[1].value;
        const noteFormID = event.target.form.id;
        const noteItem = document.getElementById(`note-list-item-${noteID}`)
        
        const formID = document.getElementById(noteFormID);
        formID.setAttribute('class', 'hidden');
        noteItem.setAttribute('class', 'visible');
        setInputValue('');
    }

    const addNewNote = (event) => {
        document.getElementById('add-note').setAttribute('class', 'visible');
        document.getElementById('add-note-button').setAttribute('class', 'hidden');
        document.getElementById('cancel-note-button').setAttribute('class', 'visible');
    }

    const submitNewNote = async (event) => {
        event.preventDefault();
        const newNoteValue = event.target[0].value;

        if (newNoteValue.length) {
            const response = await fetch('/api/data/add', {
                method: 'POST',
                body: JSON.stringify({
                    note: newNoteValue,
                    type: 'Note'
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

    const cancelNewNote = (event) => {
        event.preventDefault();
        document.getElementById('add-note').setAttribute('class', 'hidden');
        document.getElementById('cancel-note-button').setAttribute('class', 'hidden');
        document.getElementById('add-note-button').setAttribute('class', 'visible');
    }

    return (
        <div id="notes" className="card">
            <div id="card-header">
                <h2>Notes & Reminders</h2>
                <img id="add-note-button" src="./svgs/add.svg" alt="add" onClick={addNewNote} />
                <img id="cancel-note-button" src="./svgs/minus.svg" alt="minus" onClick={cancelNewNote} className="hidden" />
            </div>

            <form id="add-note" onSubmit={submitNewNote} className="hidden">
                <input type="text" placeholder="Write new note here..." value={inputValue} onChange={(event) => setInputValue(event.target.value)} className={css`width: 80%;`}/>
                <input type="submit" />
                {/*<button id="cancel" onClick={cancelNewNote}>Cancel</button>*/}
            </form>
            <div id="notes-list">
                <ol>
                    {notes.map((note, index) =>
                        <div key={index} id="line" value={note.id}>
                            <div id={'note-' + note.id} className={css`display: flex; flex-direction: column; margin: 5px; justify-content: space-evenly;`}>
                                <li id={'note-list-item-' + note.id}>{note.note}</li>
                                <form id={'noteForm-' + note.id} className="hidden" onSubmit={submitNoteEdit}>
                                    <input type="text" id={'noteInput-' + note.id} onChange={(event) => setInputValue(event.target.value)} className={css`width: 100%;`}/>
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