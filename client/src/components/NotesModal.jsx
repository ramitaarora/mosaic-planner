import { css } from '@emotion/css';

export default function NotesModal({ notesModalVisibility, setNotesModalVisibility }) {
    const closeModal = () => {
        setNotesModalVisibility('hidden');
    }

    return (
        <div id="modal-background" className={notesModalVisibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`} />

                    <div id="profile-modal">
                        <div id="modal-header">
                            <h2>Note Name Here</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}