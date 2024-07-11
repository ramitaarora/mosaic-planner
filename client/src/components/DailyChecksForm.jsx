import { useState } from 'react';
import { css } from '@emotion/css';

export default function DailyChecksForm({ visibility, setVisibility, dailyChecks, setDailyChecks, today, getData }) {
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
                        date: today,
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

    const archiveCheck = async (event) => {
        const checkID = event.target.attributes[2].nodeValue;

        if (window.confirm("Are you sure you want to archive this check?")) {
            const response = await fetch('/api/data/edit', {
                method: 'PUT',
                body: JSON.stringify({
                    id: checkID,
                    type: 'Daily Check Archive',
                    archived: true,
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
            getData();
        } else {
            console.error(response.statusText);
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
                // console.log(data);
                let parsedGoals = JSON.parse(data);
                setSuggestions(parsedGoals.checkSuggestions);
                setLoading(false);
            })
    }

    const addAISuggestion = async (event) => {
        setInputValue(event.target.innerText);
        const removedCheck = suggestions.filter((item) => item != event.target.innerText);
        setSuggestions(removedCheck);
    }

    const removeAISuggestions = () => {
        setSuggestions([]);
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
                                            <input type="submit" className="submit-button" value="Save"/>
                                            <button id={check.id} onClick={cancelEdit}>Cancel</button>
                                        </form>
                                        <div id="edit-buttons">
                                            <img src="./svgs/edit.svg" alt="edit" id={check.id} value={check.daily_check} onClick={editCheck} />
                                            <img src="./svgs/archive.svg" alt="archive" id={check.id} onClick={archiveCheck} />
                                        </div>
                                    </div>
                                )) : (
                                null
                            )}
                        </div>

                    <form id="add-new-check-form" onSubmit={submitNewCheck} className={css`width: 75%; padding: 10px 0; margin: auto; display: flex; justify-content: space-evenly; align-items: center;`}>
                        <label htmlFor='add-new-check'>Add New Check:</label>
                        <input type="text" name="add-new-check" value={inputValue} onChange={event => setInputValue(event.target.value)} required />
                        <input type="submit" value="Save"/>
                    </form>

                    <div id="ai-suggestions" className={css`width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 10px;`}>
                        {loading ? (
                            <img src="/svgs/loading.gif" alt="loading" height="60px" width="60px" />
                        ) : <input type="submit" onClick={getAISuggestions} value="Get AI Suggestions!" />}
                    </div>

                    <div id="suggestions">
                    {suggestions.length ? (
                        <div className={css`display: flex;`}>
                            <div>
                                {suggestions.map((item, index) => (
                                    <p key={index} id="each-suggestion" onClick={addAISuggestion}>{item}</p>
                                ))}
                            </div>
                            <img src="./svgs/exit.svg" alt="delete-suggestions" className={css`float: right; margin-right: 20px; cursor: pointer;`} onClick={removeAISuggestions} />
                        </div>
                    ) : null}
                </div>
                    
                </div>
            </div>
        </div>
        </div>
    )
}