import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

export default function Setup() {
    const [inputValue, setInputValue] = useState('');

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

    return (
        <div>
            <Navigation />

            <div id="profile-setup">
                <div id="setup-header">
                    <h1>Edit Profile or Add Goals, Notes, Reminders or Events</h1>
                </div>

                <div id="account-forms">
                    <form id="name-form">
                        <label htmlFor="editName">Name</label>
                        <input type="text" name="editName" required />
                        <input type="submit" value="save" />
                    </form>
                    <form id="location-form">
                        <label htmlFor="editLocation">Location</label>
                        <input type="text" name="editLocation" required />
                        <input type="submit" value="save" />
                    </form>
                    <form id="email-form">
                        <label htmlFor="editEmail">Email</label>
                        <input type="email" name="editEmail" required />
                        <input type="submit" value="save" />
                    </form>
                    <form id="password-form">
                        <label htmlFor="editPassword">Password</label>
                        <input type="password" name="editPassword" required />
                        <input type="submit" value="save" />
                    </form>
                </div>

                <div id="setup-forms">

                    <div id="each-goal-form-div">
                        <div id="form-header">
                            <h2>Save a Goal</h2>
                            <img src="./svgs/caret-right.svg" id="caret-right-goal" alt="caret-right" className="form-visible" onClick={showForm} />
                            <img src="./svgs/caret-down.svg" id="caret-down-goal" alt="caret-down" className="form-hidden" onClick={closeForm} />
                        </div>
                        <form id="save-goal" className="form-hidden">
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
                        <form id="event-form" className="form-hidden">
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
                            <div id="form-input"><label htmlFor='address'>Address</label>
                                <input type="text" name="address" />
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

                        <form id="notes-form" className="form-hidden">
                            <div id="form-input"><label htmlFor='note'>Note/Reminder</label>
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

                        <form id="daily-checks-form" className="form-hidden">

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