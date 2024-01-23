import { useEffect, useState } from 'react';
import DailyChecksForm from './DailyChecksForm';

export default function DailyChecks({ checks, setChecks }) {
    const [inputValue, setInputValue] = useState('');
    const [visibility, setVisibility] = useState('form-hidden');

    const showModal = () => {
        setVisibility('form-visible')
    }

    const editCheck = (event) => {
        const checkID = event.target.attributes[2].nodeValue;
        const checkValue = event.target.attributes[3].nodeValue;

        const goalItem = document.getElementById(`check-list-item-${checkID}`)
        goalItem.setAttribute('class', 'form-hidden');

        const formID = document.getElementById(`checkForm-${checkID}`);
        formID.setAttribute('class', 'form-visible');

        const inputField = document.getElementById(`checkInput-${checkID}`);
        inputField.setAttribute('value', checkValue);
    }

    const deleteCheck = async (event) => {
        const checkID = event.target.attributes[2].nodeValue;

        if (window.confirm("Are you sure you want to delete this daily check?")) {
            const response = await fetch('/api/data/delete', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: checkID,
                    type: 'Daily Check History',
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                // console.log(response.statusText);
                fetch('/api/data/allData')
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json(); // or response.text() for text data
                    })
                    .then((data) => {
                        location.reload();
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
            } else {
                alert(response.statusText);
            }
        }
    }

    const submitEdit = async (event) => {
        event.preventDefault();
        const formID = event.target.id;
        const checkID = event.target.parentElement.attributes[1].value;
        const formInput = event.target[0].value;
        const checkItem = document.getElementById(`check-list-item-${checkID}`)

        const response = await fetch('/api/data/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: checkID,
                check: formInput,
                type: 'Daily Check History'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // console.log(response.statusText);
            fetch('/api/data/allData')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json(); // or response.text() for text data
                })
                .then((data) => {
                    console.log(data);
                    setChecks(data.dailyChecks.map(check => check));
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        } else {
            alert(response.statusText);
        }

        document.getElementById(formID).setAttribute('class', 'form-hidden');
        checkItem.setAttribute('class', 'form-visible');
        setInputValue('');
    }

    const cancelEdit = (event) => {
        event.preventDefault();
        const formID = event.target.form.id;
        const checkID = event.target.parentElement.parentElement.attributes[1].value;

        const formEl = document.getElementById(formID);
        formEl.setAttribute('class', 'form-hidden');

        const checkItem = document.getElementById(`check-list-item-${checkID}`)
        checkItem.setAttribute('class', 'form-visible');
        setInputValue('');
    }

    return (
        <div id="daily-checks">
            <div id="card-header">
                <h2>Daily Checks</h2>
                <img src="./svgs/add.svg" alt="add" onClick={showModal} />
            </div>
            {checks.length ? (
                checks.map((check, index) =>
                    <div id="line" key={index} value={check.id}>
                        <div id={'check-list-item-' + check.id} className="each-check">
                            <input type="checkbox" id={"is-completed-" + check.id}/>
                            <label id="check-line">{check.daily_check}</label>
                        </div>
                        <form id={'checkForm-' + check.id} className="form-hidden" onSubmit={submitEdit}>
                            <input type="text" id={'checkInput-' + check.id} onChange={(event) => setInputValue(event.target.value)} />
                            <input type="submit" className="submit-button" />
                            <button id="cancel-edit" onClick={cancelEdit}>Cancel</button>
                        </form>
                        <div id="edit-buttons">
                            <img src="./svgs/edit.svg" alt="edit" onClick={editCheck} id={check.id} value={check.daily_check} />
                            <img src="./svgs/delete.svg" alt="delete" onClick={deleteCheck} id={check.id} />
                        </div>
                    </div>
                )) : (
                <div id="add-checks-link">
                    <h3 onClick={showModal}>No daily checks yet! Click to add some for today.</h3>
                </div>
            )
            }
            <DailyChecksForm visibility={visibility} setVisibility={setVisibility} />
        </div>
    )
}