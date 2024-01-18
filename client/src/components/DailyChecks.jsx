import { useEffect, useState } from 'react';

export default function DailyChecks({ checks, setChecks }) {
    const [inputValue, setInputValue] = useState('');

    return (
        <div id="daily-checks">
            <div id="card-header">
                <h2>Daily Checks</h2>
                <img id="add-daily-checks-button" src="./svgs/add.svg" alt="add" />
                <img id="cancel-daily-checks-button" src="./svgs/minus.svg" alt="minus" className="form-hidden" />
            </div>
            {checks.map((check, index) =>
                <div id="line" key={index}>
                    <div id="each-check">
                        <input type="checkbox" />
                        <label id="check-line">{check}</label>
                    </div>
                    <div id="edit-buttons">
                        <img src="./svgs/edit.svg" alt="edit" />
                        <img src="./svgs/delete.svg" alt="edit" />
                    </div>
                </div>
            )}
        </div>
    )
}