import { useState } from 'react';
import { css } from '@emotion/css';

export default function Notes({ notes, setNotes, getData }) {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

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
                console.error(response.statusText);
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
            setInputValue('');
        } else {
            console.error(response.statusText);
        }

        document.getElementById(noteFormID).setAttribute('class', 'hidden');
        noteItem.setAttribute('class', 'list-item');
        
    }

    const cancelNoteEdit = (event) => {
        event.preventDefault();
        const noteID = event.target.parentElement.parentElement.parentElement.attributes[1].value;
        const noteFormID = event.target.form.id;
        const noteItem = document.getElementById(`note-list-item-${noteID}`)
        
        const formID = document.getElementById(noteFormID);
        formID.setAttribute('class', 'hidden');
        noteItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const addNewNote = (event) => {
        setInputValue('');
        document.getElementById('add-note').setAttribute('class', 'visible');
        document.getElementById('add-note-button').setAttribute('class', 'hidden');
        document.getElementById('cancel-note-button').setAttribute('class', 'visible');
    }

    const submitNewNote = async (event) => {
        event.preventDefault();
        const newNoteValue = inputValue;

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
                document.getElementById('add-note').setAttribute('class', 'hidden');
                document.getElementById('cancel-note-button').setAttribute('class', 'hidden');
                document.getElementById('add-note-button').setAttribute('class', 'visible');
            } else {
                console.error(response.statusText);
            }
        }
    }

    const cancelNewNote = (event) => {
        event.preventDefault();
        document.getElementById('add-note').setAttribute('class', 'hidden');
        document.getElementById('cancel-note-button').setAttribute('class', 'hidden');
        document.getElementById('add-note-button').setAttribute('class', 'visible');
    }

    const getAISuggestions = (event) => {
        event.preventDefault();
        setSuggestions([]);
        setLoading(true);

        fetch(`/api/chat/notes`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                let parsedGoals = JSON.parse(data);
                setSuggestions(parsedGoals.noteSuggestions);
                setLoading(false);
            })
    }

    const addAISuggestion = async (event) => {
        const newNoteValue = event.target.innerText;

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
                document.getElementById('add-note').setAttribute('class', 'hidden');
                document.getElementById('cancel-note-button').setAttribute('class', 'hidden');
                document.getElementById('add-note-button').setAttribute('class', 'visible');
            } else {
                console.error(response.statusText);
            }
        }
    }

    return (
        <div id="notes" className={`card ${css`height: 20vh;`}`}>
            <div id="card-header">
                <h2>Notes & Reminders</h2>
                <img id="add-note-button" src="./svgs/add.svg" alt="add" onClick={addNewNote} />
                <img id="cancel-note-button" src="./svgs/minus.svg" alt="minus" onClick={cancelNewNote} className="hidden" />
            </div>

            <form id="add-note" onSubmit={submitNewNote} className="hidden">
                <input type="text" placeholder="Write new note here..." value={inputValue} onChange={(event) => setInputValue(event.target.value)} className={css`width: 80%;`}/>
                <input type="submit" />
            </form>
            <div id="notes-list">
                <ol>
                    {notes.length ? (
                        notes.map((note, index) =>
                        <div key={index} id="line" value={note.id}>
                            <div id={'note-' + note.id} className={css`display: flex; flex-direction: column; margin: 5px; justify-content: space-evenly;`}>
                                <li id={'note-list-item-' + note.id} className="list-item">{note.note}</li>
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
                    )) : (
                        <div id="empty">
                            <p>No notes yet! Click the plus to add a note or reminder.</p>
                            <div id="ai-suggestions" className={css`width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;`}>
                                <input type="submit" onClick={getAISuggestions} value="Get AI Suggestions!" />
                                {loading ? (
                                    <img src="/svgs/loading.gif" alt="loading" height="60px" width="60px"/>
                                ) : null}
                                
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