import { useState } from 'react';
import { css } from '@emotion/css';

export default function DailyChecksForm({ visibility, setVisibility, dailyChecks, setDailyChecks, getData }) {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const closeModal = () => {
        setVisibility('hidden');
    }

    const submitNewCheck =  (event) => {
        event.preventDefault();

        if (inputValue.length) {
            fetch('/api/data/add', {
                method: 'POST',
                body: JSON.stringify({
                    dailyCheck: inputValue,
                    type: 'Daily Check'
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                return response.json();
            })
            .then((data => {
                fetch('/api/data/add', {
                    method: 'POST',
                    body: JSON.stringify({
                        dailyCheck: inputValue,
                        parentID: data.id,
                        type: 'Daily Checks History'
                    }),
                    headers: { 'Content-Type': 'application/json' },
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }
                    return response.json();
                })
                .then((data => {
                    // console.log(data);
                    setInputValue('');
                    getData();
                }))
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
            }))
            .catch((error) => {
                console.error('Error fetching data:', error);
            })
        }
    }

    const editCheck = (event) => {
        const checkID = event.target.attributes[2].nodeValue;
        const checkValue = event.target.attributes[3].nodeValue;

        const checkItem = document.getElementById(`check-item-${checkID}`)
        checkItem.setAttribute('class', 'hidden');

        const formID = document.getElementById(`checkForm-${checkID}`);
        formID.setAttribute('class', 'visible');

        const inputField = document.getElementById(`checkInput-${checkID}`);
        inputField.setAttribute('value', checkValue);
    }

    const deleteCheck = async (event) => {
        const checkID = event.target.attributes[2].nodeValue;

        if (window.confirm("Are you sure you want to delete this check?")) {
            const response = await fetch('/api/data/delete', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: checkID,
                    type: 'Daily Check',
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

    const submitCheckEdit = async (event) => {
        event.preventDefault();
        const formID = event.target.id;
        const checkID = event.target[2].id;
        const formInput = event.target[0].value;
        const checkItem = document.getElementById(`check-item-${checkID}`)

        const response = await fetch('/api/data/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: checkID,
                check: formInput,
                type: 'Daily Check'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // console.log(response.statusText);
            getData();
        } else {
            alert(response.statusText);
        }

        document.getElementById(formID).setAttribute('class', 'hidden');
        checkItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const cancelEdit = (event) => {
        event.preventDefault();
        const formID = event.target.form.id;
        const checkID = event.target.id;

        const formEl = document.getElementById(formID);
        formEl.setAttribute('class', 'hidden');

        const checkItem = document.getElementById(`check-item-${checkID}`)
        checkItem.setAttribute('class', 'list-item');
        setInputValue('');
    }

    const getAISuggestions = (event) => {
        event.preventDefault();
        setSuggestions([]);
        setLoading(true);

        fetch(`/api/chat/checks`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then((data) => {
                let parsedGoals = JSON.parse(data);
                setSuggestions(parsedGoals.checkSuggestions);
                setLoading(false);
            })
    }

    const addAISuggestion = async (event) => {
        setInputValue(event.target.innerText);     
    }

    return (
        <div id="modal-background" className={visibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`} />

                    <div id="checks-modal" className={css`display: flex; flex-direction: column; justify-content: center; align-items: center; `}>

                        <div id="check-list">
                            <div id="modal-header">
                                <h2>Add Daily Checks</h2>
                            </div>
                            {dailyChecks.length ? (
                                dailyChecks.map((check, index) =>
                                    <div key={index} id="add-each-check" className={css`width: 100%; display: flex; justify-content: space-between; align-items: center;`}>
                                        <div id="each-check" className={css`display: flex; align-items: center;`}>
                                            <p id={'check-item-' + check.id} className="list-item">{check.daily_check}</p>
                                        </div>
                                        <form id={'checkForm-' + check.id} className="hidden" onSubmit={submitCheckEdit}>
                                            <input type="text" id={'checkInput-' + check.id} />
                                            <input type="submit" className="submit-button" />
                                            <button id={check.id} onClick={cancelEdit}>Cancel</button>
                                        </form>
                                        <div id="edit-buttons">
                                            <img src="./svgs/edit.svg" alt="edit" id={check.id} value={check.daily_check} onClick={editCheck} />
                                            <img src="./svgs/delete.svg" alt="delete" id={check.id} onClick={deleteCheck} />
                                        </div>
                                    </div>
                                )) : (
                                null
                            )}
                        </div>

                    <form id="add-new-check-form" onSubmit={submitNewCheck} className={css`width: 75%; padding: 10px 0; margin: auto; display: flex; justify-content: space-evenly; align-items: center;`}>
                        <label htmlFor='add-new-check'>Add New Check:</label>
                        <input type="text" name="add-new-check" value={inputValue} onChange={event => setInputValue(event.target.value)} required />
                        <input type="submit" />
                    </form>

                    <div id="ai-suggestions" className={css`width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;`}>
                        <input type="submit" onClick={getAISuggestions} value="Get AI Suggestions!" />
                        {loading ? (
                            <img src="/svgs/loading.gif" alt="loading" height="60px" width="60px" />
                        ) : null}
                    </div>

                    <div id="suggestions">
                        {suggestions.length ? (
                            suggestions.map((item, index) => (
                                <p id="each-suggestion" key={index} onClick={addAISuggestion}>{item}</p>
                            ))
                        ) : null}
                    </div>
                    
                </div>
            </div>
        </div>
        </div>
    )
}