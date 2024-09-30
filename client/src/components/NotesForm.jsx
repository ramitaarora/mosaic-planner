import { css } from '@emotion/css';
import { useEffect, useState } from 'react';

export default function NotesForm({ notesModalVisibility, setNotesModalVisibility, notes, getData, noteID, setNoteID }) {
    // State for current note clicked on, also used for form input
    const [currentNote, setCurrentNote] = useState({ note: 'note', date_created: '2024-09-26', description: '' })

    useEffect(() => {
        // Sets the current note based on ID of note clicked on
        if (noteID) {
            for (let i = 0; i < notes.length; i++) {
                if (notes[i].id === noteID) {
                    setCurrentNote(notes[i]);
                }
            }
        }
    }, [noteID])


    const handleInput = (event) => {
        // Sets the value based on form input
        const { name, value } = event.target;

        setCurrentNote({
            ...currentNote,
            [name]: value
        })
    }

    const saveChanges = async (event) => {
        // Save note changes to database
        event.preventDefault();

        if (currentNote.note.length && currentNote.date_created.length) {
            // Checks that the name of the note and date created exist (cannot save otherwise)
            try {
                const response = await fetch('/api/data/edit', {
                    method: 'PUT',
                    body: JSON.stringify({
                        type: 'Note Description',
                        id: currentNote.id,
                        note: currentNote.note,
                        date_created: currentNote.date_created,
                        description: currentNote.description
                    }),
                    headers: { 'Content-Type': 'application/json' },
                })

                if (response.ok) {
                    resetCurrentNote();
                    getData()
                    closeModal()
                } else {
                    console.log(response.statusText)
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            alert('Note and date must not be empty.')
        }
    }

    const deleteNote = async (event) => {
         // Delete note from database
        event.preventDefault();

        if (window.confirm("Are you sure you want to delete this note?")) {
            const response = await fetch('/api/data/delete', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: currentNote.id,
                    type: 'Note',
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                resetCurrentNote();
                getData()
                closeModal()
            } else {
                console.error(response.statusText);
            }
        }
    }

    const resetCurrentNote = () => {
        // Reset current note information
        setCurrentNote({ note: 'note', date_created: '2024-09-26-', description: '' })
    }

    const resetDescription = () => {
        // Clear description
        setCurrentNote({...currentNote, description: ''})
    }

    const closeModal = () => {
        // Close note modal
        setNotesModalVisibility('hidden');
        resetCurrentNote()
        setNoteID('')
    }

    return (
        <div id="modal-background" className={notesModalVisibility}>
            <div className="modal">
                <div className="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`} />

                    <div id="profile-modal">
                        <div className="modal-header">
                            <h2>{currentNote.note}</h2>
                        </div>

                        <form onSubmit={saveChanges} className={css`width: 80%; margin: 0 auto;`}>
                            <div className="form-input">
                                <label htmlFor='note' >Note:</label>
                                <input name="note" type="text" value={currentNote.note} onChange={handleInput} />
                            </div>

                            <div className="form-input">
                                <label htmlFor='date_created' >Date Created:</label>
                                <input name="date_created" type="date" value={currentNote.date_created.slice(0, 10)} onChange={handleInput} />
                            </div>

                            <div className="form-input">
                                <label htmlFor='description'>Longer Description:</label>
                                <textarea name="description" value={currentNote.description ? currentNote.description : ''} onChange={handleInput}></textarea>
                            </div>

                            <div className="form-submit-buttons">
                                <input type="reset" value="Clear" onClick={resetDescription} />
                                <input type="submit" value="Save" />
                                <button onClick={deleteNote}>Delete</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}