import { useState, useEffect } from 'react';

export default function DailyChecksForm({ visibility, setVisibility }) {
    const [inputValue, setInputValue] = useState('');
    const [checks, setChecks] = useState([]);
    const [todaysChecks, setTodaysChecks] = useState([]);

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
                alert("New daily check saved!")
                getChecks();
                document.getElementById(formID).reset();
            } else {
                alert(response.statusText);
            }
        }
    }

    const addCheck = (event) => {
        const addedItem = checks.filter(check => check.id === Number(event.target.id));
        if (!todaysChecks.includes(addedItem[0])) {
            setTodaysChecks((pre) => [...pre, addedItem[0]]);
        }  
    }

    const removeCheck = (event) => {
        const newArray = todaysChecks.filter(check => check.id !== Number(event.target.id));
        setTodaysChecks(newArray);
    }

    const submitTodaysChecks = async () => {

        if (todaysChecks.length) {
            for (let i = 0; i < todaysChecks.length; i++) {
                const response = await fetch('/api/data/add', {
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'Daily Checks History',
                        dailyCheck: todaysChecks[i].daily_check,
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
        setTodaysChecks([]);
        closeModal();
        location.reload();
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
                                    <form id={'checksForm-' + check.id} className="form-hidden">
                                        <input type="text" id={'checkInput-' + check.id} onChange={(event) => setInputValue(event.target.value)} />
                                        <input type="submit" className="submit-button" />
                                        <button id="cancel-edit">Cancel</button>
                                    </form>
                                    <div id="edit-buttons">
                                        <img src="./svgs/edit.svg" alt="edit" id={check.id} value={check.daily_check} />
                                        <img src="./svgs/delete.svg" alt="delete" id={check.id} />
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