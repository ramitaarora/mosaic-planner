import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

export default function ProfileSetup() {
    const [inputValue, setInputValue] = useState('');

    return (
        <div>
            <Navigation />

            <div id="profile-setup">
                <div id="setup-header">
                    <h1>Edit Profile or Add Goals, Notes, Reminders or Events</h1>
                </div>
                <form id="account-form">
                    <label htmlFor="editName">Name</label>
                    <input type="text" name="editName" required />
                    <input type="submit" value="save" />

                    <label htmlFor="editLocation">Location</label>
                    <input type="text" name="editLocation" required />
                    <input type="submit" value="save" />

                    <label htmlFor="editEmail">Email</label>
                    <input type="text" name="editEmail" required />
                    <input type="submit" value="save" />

                    <label htmlFor="editPassword">Password</label>
                    <input type="text" name="editPassword" required />
                    <input type="submit" value="save" />
                </form>
                <div id="setup-forms">
                    <form id="each-goal-form">
                        <h2>Save a Goal</h2>
                        <p>Yearly resolutions break down into monthly goals, which can be further broken down into weekly goals.</p>

                        <label htmlFor='yearly'>Yearly Goal</label>
                        <input type="text" name="yearly" required />

                        <label htmlFor='monthly'>Monthly Goal</label>
                        <input type="text" name="monthly" required />

                        <label htmlFor='weekly'>Weekly Goal</label>
                        <input type="text" name="weekly" required />

                        <input type="submit" value="Save" />
                    </form>
                    <form id="event-form">
                        <h2>Add an Event</h2>
                        <label htmlFor='eventName'>Name</label>
                        <input type="text" name="eventName" required />

                        <label htmlFor='date'>Date</label>
                        <input type="date" name="date" required />

                        <label htmlFor='startTime'>Start Time</label>
                        <input type="time" name="startTime" required />

                        <label htmlFor='endTime'>End Time</label>
                        <input type="time" required />

                        <input type="submit" value="Save" />
                    </form>
                    <form id="notes-form">
                        <h2>Add a note/reminder</h2>
                        <label htmlFor='note'>Note/Reminder</label>
                        <input type="text" name="note" required />
                        <input type="submit" value="Save" />
                    </form>
                    <form id="daily-checks-form">
                        <h2>Add a Daily Check</h2>
                        <label htmlFor='check'>Daily Check</label>
                        <input type="text" name="check" required />
                        <input type="submit" value="Save" />
                    </form>
                </div>

            </div>
        </div>
    )
}