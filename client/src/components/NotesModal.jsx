import { css } from '@emotion/css';
import { useEffect, useState } from 'react';

export default function NotesModal({ notesModalVisibility, setNotesModalVisibility, notes, getData, noteID, setNoteID }) {
    const [currentNote, setCurrentNote] = useState({})

    useEffect(() => {
        if (noteID) {
            for (let i = 0; i < notes.length; i++) {
                if (notes[i].id === noteID) {
                    setCurrentNote(notes[i]);
                }
            }
        }
    }, [noteID])

    useEffect(() => {
        console.log(currentNote)
    }, [])

    const closeModal = () => {
        setNotesModalVisibility('hidden');
        setCurrentNote({})
        setNoteID('')
    }

    return (
        <div id="modal-background" className={notesModalVisibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`} />

                    <div id="profile-modal">
                        <div id="modal-header">
                            <h2>{currentNote.note}</h2>
                        </div>

                        <form>
                            <p>Date Created: {currentNote.date_created}</p>
                            <p>Description: {currentNote.description}</p>
                            <img src="./" alt="edit" />
                            <img src="./" alt="delete" />
                            <textarea></textarea>
                            <input type="submit" value="Save" />
                            <input type="reset" value="Clear" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}