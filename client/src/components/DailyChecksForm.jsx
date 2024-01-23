import { useState, useEffect } from 'react';

export default function DailyChecksForm({ visibility, setVisibility }) {
    const [inputValue, setInputValue] = useState('');
    const [checks, setChecks] = useState([]);
    const [todaysChecks, setTodaysChecks] = useState([]);
    const [savedChecks, setSavedChecks] = useState([])

    const getChecks = () => {
        fetch('/api/data/checks')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // console.log(response);
          return response.json(); // or response.text() for text data
        })
        .then((data) => {
        //   console.log(data);
          setChecks(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });

        fetch('/api/data/checksHistory')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // console.log(response);
          return response.json(); // or response.text() for text data
        })
        .then((data) => {
        //   console.log(data);
          if (!data.Message) {
            setTodaysChecks(data);
            setSavedChecks(data);
        }})
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    useEffect(() => {
        getChecks();
    },[])

    const closeModal = () => {
        setVisibility('form-hidden');
    }

    const submitNewCheck = async (event) => {
        event.preventDefault();
        const formID = event.target.id;
        const inputValue = event.target[0].value;

        if (inputValue.length) {
            const response = await fetch('/api/data/add', {
                method: 'POST',
                body: JSON.stringify({
                    dailyCheck: inputValue,
                    type: 'Daily Check'
                }),
                headers: { 'Content-Type': 'application/json' },
            })
            if (response.ok) {
                // console.log(response.statusText);
                // alert("New daily check saved!")
                getChecks();
                document.getElementById(formID).reset();
            } else {
                alert(response.statusText);
            }
        }
    }

    const addCheck = (event) => {
        const addedItem = checks.filter(check => check.id === Number(event.target.id));
        const matches = todaysChecks.find(check => check.parent_id === addedItem[0].id);
        const includes = todaysChecks.includes(addedItem[0]);

        if (!matches && !includes) {
            setTodaysChecks((pre) => [...pre, addedItem[0]]);
        }
    }

    const removeCheck = async (event) => {

        if (savedChecks.length) {
            const newArray = todaysChecks.filter(check => check.parent_id !== Number(event.target.id));
            setTodaysChecks(newArray);

            const response = await fetch('/api/data/delete', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: Number(event.target.id),
                    type: 'Daily Check History',
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                getChecks();
            } else {
                alert(response.statusText);
            }
        } else {
            const newArray = todaysChecks.filter(check => check.id !== Number(event.target.id));
            setTodaysChecks(newArray);
        }
    }

    const submitTodaysChecks = async () => {
        let checksToSave = [];

        if (todaysChecks.length) {
            if (savedChecks.length) {
                for (let i = 0; i < todaysChecks.length; i++) {
                    const matches = savedChecks.find(check => check.parent_id === todaysChecks[i].parent_id);
                    if (!matches) {
                        checksToSave.push(todaysChecks[i]);
                    }
                }
            } else {
                checksToSave = todaysChecks;
            }

            if (checksToSave.length) {
                for (let i = 0; i < checksToSave.length; i++) {
                    const response = await fetch('/api/data/add', {
                        method: 'POST',
                        body: JSON.stringify({
                            type: 'Daily Checks History',
                            dailyCheck: checksToSave[i].daily_check,
                            parentID: checksToSave[i].id
                        }),
                        headers: { 'Content-Type': 'application/json' },
                    })
                    if (response.ok) {
                        console.log(response.statusText);
                    } else {
                        alert(response);
                        console.log(response.statusText);
                    }
                } 
            }


           
        }
        setTodaysChecks([]);
        setSavedChecks([])
        closeModal();
        location.reload();
    }

    const editCheck = (event) => {
        const checkID = event.target.attributes[2].nodeValue;
        const checkValue = event.target.attributes[3].nodeValue;

        const checkItem = document.getElementById(`check-list-item-${checkID}`)
        checkItem.setAttribute('class', 'form-hidden');

        const formID = document.getElementById(`checksForm-${checkID}`);
        formID.setAttribute('class', 'form-visible');

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
                getChecks();
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
        const checkItem = document.getElementById(`check-list-item-${checkID}`)

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
            getChecks();
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
        const checkID = event.target.id;

        const formEl = document.getElementById(formID);
        formEl.setAttribute('class', 'form-hidden');

        const checkItem = document.getElementById(`check-list-item-${checkID}`)
        checkItem.setAttribute('class', 'form-visible');
        setInputValue('');
    }

    return (
        <div id="modal-background" className={visibility}>
            <div id="modal">
                <div id="modal-content">
                <img src="./svgs/exit.svg" alt="exit" onClick={closeModal}/>

                    <div id="checks-modal">
                        <div id="check-list">
                            <h2>Add Daily Checks</h2>
                            {checks.map((check, index) =>
                                <div key={index} id="add-each-check">
                                    <div id="each-check">
                                        <img src="./svgs/add.svg" alt="add" id={check.id} onClick={addCheck}/>
                                        <p id={'check-list-item-' + check.id}>{check.daily_check}</p>
                                    </div>
                                    <form id={'checksForm-' + check.id} className="form-hidden" onSubmit={submitCheckEdit}>
                                        <input type="text" id={'checkInput-' + check.id} onChange={(event) => setInputValue(event.target.value)} />
                                        <input type="submit" className="submit-button" />
                                        <button id={check.id} onClick={cancelEdit}>Cancel</button>
                                    </form>
                                    <div id="edit-buttons">
                                        <img src="./svgs/edit.svg" alt="edit" id={check.id} value={check.daily_check} onClick={editCheck}/>
                                        <img src="./svgs/delete.svg" alt="delete" id={check.id} onClick={deleteCheck}/>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div id="added-checks">
                            <h2>Checks for Today</h2>
                            {todaysChecks.map((check, index) =>
                                <div key={index} id="each-added-check">
                                    <p>{check.daily_check}</p>
                                    <img src="./svgs/minus.svg" alt="minus" id={check.id} onClick={removeCheck}/>
                                </div>
                            )}
                        </div>
                    </div>

                    <form id="add-new-check-form" onSubmit={submitNewCheck}>
                        <label htmlFor='add-new-check'>Add New Check:</label>
                        <input type="text" name="add-new-check" required/>
                        <input type="submit"/>
                    </form>

                    <button onClick={submitTodaysChecks}>Done</button>
                    <button onClick={closeModal}>Cancel</button>
                    
                </div>
            </div>
        </div>
    )
}