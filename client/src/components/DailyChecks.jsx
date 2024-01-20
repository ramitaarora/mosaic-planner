import { useEffect, useState } from 'react';
import DailyChecksForm from './DailyChecksForm';

export default function DailyChecks({ checks, setChecks }) {
    const [inputValue, setInputValue] = useState('');
    const [visibility, setVisibility] = useState('form-hidden');

    const showModal = () => {
        setVisibility('form-visible')
    }

    return (
        <div id="daily-checks">
            <div id="card-header">
                <h2>Daily Checks</h2>
                <img id="add-daily-checks-button" src="./svgs/add.svg" alt="add" onClick={showModal}/>
            </div>
            {checks.length ? (
                checks.map((check, index) =>
                <div id="line" key={index}>
                    <div id="each-check">
                        <input type="checkbox" />
                        <label id="check-line">{check}</label>
                    </div>
                    <div id="edit-buttons">
                        <img src="./svgs/delete.svg" alt="edit" />
                    </div>
                </div>
            )) : (
                <div id="add-checks-link">
                    <h3 onClick={showModal}>No daily checks yet! Click here to add some for today.</h3>
                    <DailyChecksForm visibility={visibility} setVisibility={setVisibility} />
                </div>
            )
        }
        </div>
    )
}