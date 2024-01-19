import { useState, useEffect } from 'react';

export default function DailyChecksForm({ visibility, setVisibility }) {
    const [checks, setChecks] = useState([]);
    const [todaysChecks, setTodaysChecks] = useState([]);

    useEffect(() => {
        fetch('/api/data/getAllChecks')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // console.log(response);
          return response.json(); // or response.text() for text data
        })
        .then((data) => {
          console.log(data);
          setChecks(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    },[])

    const closeModal = () => {
        setVisibility('form-hidden');
    }

    return (
        <div id="modal-background" className={visibility}>
            <div id="modal">
                <div id="modal-content">
                <img src="./svgs/exit.svg" alt="exit" onClick={closeModal}/>

                    <div id="checks-lists">
                        <div id="check-list">
                            <h2>Add Daily Checks</h2>
                            {checks.map((check, index) =>
                                <div key={index} id="add-each-check">
                                    <p>{check.daily_check}</p>
                                    <img src="./svgs/add.svg" alt="add" />
                                </div>
                            )}
                        </div>

                        <div id="added-checks">
                            <h2>Checks for Today</h2>
                            {todaysChecks.map((check, index) => {
                                <div key={index} id="each-added-check">
                                    <p>{todaysChecks.daily_check}</p>
                                </div>
                            })}
                        </div>
                    </div>

                    <form id="add-new-check-form">
                        <label htmlFor='add-new-check'>Add New Check:</label>
                        <input type="text" name="add-new-check"/>
                        <input type="submit"/>
                    </form>

                </div>
            </div>
        </div>
    )
}