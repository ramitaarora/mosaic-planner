import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

export default function Setup() {
    const [inputValue, setInputValue] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('')

    const getData = () => {
        fetch('/api/users/getUser')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // console.log(response);
                return response.json(); // or response.text() for text data
            })
            .then((data) => {
                setName(data.name);
                setEmail(data.email);
                setLocation(data.location);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    useEffect(() => {
        fetch('/api/home')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // console.log(response);
                return response.json();
            })
            .then((data) => {
                if (data.loggedIn) {
                    // console.log(data);
                    getData();
                } else {
                    window.location.replace('/login')
                }
            })
            .catch((error) => {
                console.error(error)
            });
    }, []);

    const showForm = (event) => {
        // console.log(event);
        const formID = event.target.parentElement.parentElement.children[1].id;
        const caretRight = event.target.id;
        const caretDown = event.target.nextSibling.id;
        document.getElementById(`${formID}`).setAttribute('class', 'form-visible');
        document.querySelector(`#${caretDown}`).setAttribute('class', 'form-visible');
        document.querySelector(`#${caretRight}`).setAttribute('class', 'form-hidden');
    }

    const closeForm = (event) => {
        const formID = event.target.parentElement.parentElement.children[1].id;
        const caretDown = event.target.id;
        const caretRight = event.target.previousSibling.id;
        document.getElementById(`${formID}`).setAttribute('class', 'form-hidden');
        document.querySelector(`#${caretDown}`).setAttribute('class', 'form-hidden');
        document.querySelector(`#${caretRight}`).setAttribute('class', 'form-visible');
    }

    const updateProfile = async (event) => {
        event.preventDefault();
        const inputType = String(event.target.id).split('-')[0];
        const inputData = event.target[0].value;

        if (inputData.length) {
            const response = await fetch('/api/users/updateUser', {
                method: 'PUT',
                body: JSON.stringify({
                    data: inputData,
                    type: inputType
                }),
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.ok) {
                alert(`${inputType} updated!`)
                getData();
            } else {
                alert(response.statusText);
            }
        }
    }

    const saveGoal = async (event) => {
        event.preventDefault();
        const formID = event.target.id;
        let yearlyGoal = event.target[0].value;
        let monthlyGoal = event.target[1].value;
        let weeklyGoal = event.target[2].value;

        const response = await fetch('/api/data/add', {
            method: 'POST',
            body: JSON.stringify({
                type: 'Goal',
                yearlyGoal: yearlyGoal,
                monthlyGoal: monthlyGoal,
                weeklyGoal: weeklyGoal,
                goal_type: 'Goals',
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // console.log(response.statusText);
            alert('Goal saved!')
            document.getElementById(formID).reset();
        } else {
            alert(response.statusText);
        }
    }

    const saveEvent = async (event) => {
        event.preventDefault();
        console.log(event);
    }

    const saveNote = async (event) => {
        event.preventDefault();
        const formID = event.target.id;
        const newNoteValue = event.target[0].value;

        if (newNoteValue.length) {
            const response = await fetch('/api/data/add', {
                method: 'POST',
                body: JSON.stringify({
                    note: newNoteValue,
                    type: 'Note'
                }),
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.ok) {
                // console.log(response.statusText);
                alert('Note saved!')
                document.getElementById(formID).reset();
            } else {
                alert(response.statusText);
            }
        }
    }

    const saveChecks = async (event) => {
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
                document.getElementById(formID).reset();
            } else {
                alert(response.statusText);
            }
        }
    }

    return (
        <div>
            <Navigation />

            <div id="profile-setup">
                <div id="setup-header">
                    <h1>Edit Profile or Add Goals, Notes, Reminders or Events</h1>
                </div>

                <div id="account-forms">
                    <form id="name-form" onSubmit={updateProfile}>
                        <label htmlFor="editName">Name</label>
                        <input type="text" name="editName" id="editName" value={name} onChange={(event) => setName(event.target.value)} required />
                        <input type="submit" value="Save" />
                    </form>
                    <form id="location-form" onSubmit={updateProfile}>
                        <label htmlFor="editLocation">Location</label>
                        <input type="text" name="editLocation" id="editLocation" value={location} onChange={(event) => setLocation(event.target.value)} required />
                        <input type="submit" value="Save" />
                    </form>
                    <form id="email-form" onSubmit={updateProfile}>
                        <label htmlFor="editEmail">Email</label>
                        <input type="email" name="editEmail" id="editEmail" value={email} onChange={(event) => setEmail(event.target.value)} required />
                        <input type="submit" value="Save" />
                    </form>
                </div>

                <div id="setup-forms">

                    <div id="goal-form-div">
                        <div id="form-header">
                            <h2>Save a Goal</h2>
                            <img src="./svgs/caret-right.svg" id="caret-right-goal" alt="caret-right" className="form-visible" onClick={showForm} />
                            <img src="./svgs/caret-down.svg" id="caret-down-goal" alt="caret-down" className="form-hidden" onClick={closeForm} />
                        </div>
                        <form id="save-goal" className="form-hidden" onSubmit={saveGoal}>
                            <p>Yearly resolutions break down into monthly goals, which can be further broken down into weekly goals.</p>
                            <div id="form-input">
                                <label htmlFor='yearly'>Yearly Goal</label>
                                <input type="text" name="yearly" placeholder="Type your yearly goal here..." required />
                            </div>

                            <div id="form-input">
                                <label htmlFor='monthly'>Monthly Goal</label>
                                <input type="text" name="monthly" placeholder="Type your monthly goal here..." required />
                            </div>

                            <div id="form-input">
                                <label htmlFor='weekly'>Weekly Goal</label>
                                <input type="text" name="weekly" placeholder="Type your weekly goal here..." required />
                            </div>

                            <div id="form-submit-buttons">
                                <input type="submit" value="Save" />
                                <input type="reset" value="Reset" />
                            </div>
                        </form>
                    </div>

                    <div id="event-form-div">
                        <div id="form-header">
                            <h2>Add an Event</h2>
                            <img src="./svgs/caret-right.svg" id="caret-right-event" alt="caret-right" className="form-visible" onClick={showForm} />
                            <img src="./svgs/caret-down.svg" id="caret-down-event" alt="caret-down" className="form-hidden" onClick={closeForm} />
                        </div>
                        <form id="event-form" className="form-hidden" onSubmit={saveEvent}>
                            <div id="form-input">
                                <label htmlFor='eventName'>Name</label>
                                <input type="text" name="eventName" required />
                            </div>
                            <div id="form-input">
                                <label htmlFor='date'>Date</label>
                                <input type="date" name="date" required />
                            </div>
                            <div id="form-input">
                                <label htmlFor='startTime'>Start Time</label>
                                <input type="time" name="startTime" required />
                            </div>
                            <div id="form-input">
                                <label htmlFor='endTime'>End Time</label>
                                <input type="time" name="endTime" required />
                            </div>
                            <div id="form-input">
                                <label htmlFor='address'>Address</label>
                                <input type="text" name="address" />
                            </div>
                            <div id="form-input">
                                <label htmlFor='recurring'>Recurring Event?</label>
                                <select name="recurring">
                                    <option value="Not-Recurring">Not Recurring</option>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Bi-Weekly">Bi-Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                </select>
                            </div>  
                            <div id="form-submit-buttons">
                                <input type="submit" value="Save" />
                                <input type="reset" value="Reset" />
                            </div>
                        </form>
                    </div>

                    <div id="notes-form-div">
                        <div id="form-header">
                            <h2>Add a Note/Reminder</h2>
                            <img src="./svgs/caret-right.svg" id="caret-right-notes" alt="caret-right" className="form-visible" onClick={showForm} />
                            <img src="./svgs/caret-down.svg" id="caret-down-notes" alt="caret-down" className="form-hidden" onClick={closeForm} />
                        </div>

                        <form id="notes-form" className="form-hidden" onSubmit={saveNote}>
                            <div id="form-input">
                                <label htmlFor='note'>Note/Reminder</label>
                                <input type="text" name="note" required />
                            </div>

                            <div id="form-submit-buttons">
                                <input type="submit" value="Save" />
                                <input type="reset" value="Reset" />
                            </div>

                        </form>
                    </div>

                    <div id="daily-checks-form-div">
                        <div id="form-header">
                            <h2>Add a Daily Check</h2>
                            <img src="./svgs/caret-right.svg" id="caret-right-checks" alt="caret-right" className="form-visible" onClick={showForm} />
                            <img src="./svgs/caret-down.svg" id="caret-down-checks" alt="caret-down" className="form-hidden" onClick={closeForm} />
                        </div>

                        <form id="daily-checks-form" className="form-hidden" onSubmit={saveChecks}>

                            <div id="form-input">
                                <label htmlFor='check'>Daily Check</label>
                                <input type="text" name="check" required />
                            </div>

                            <div id="form-submit-buttons">
                                <input type="submit" value="Save" />
                                <input type="reset" value="Reset" />
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}