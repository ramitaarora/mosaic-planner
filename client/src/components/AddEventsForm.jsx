import { useEffect, useState } from 'react';
import { css } from '@emotion/css';

export default function AddEventsForm({ addVisibility, setAddVisibility, getData, setTodaysEvents }) {
    const [showTime, setShowTime] = useState('visible');
    const [recurring, setReccuring] = useState('Not-Recurring');

    const setTimeVisibility = (event) => {
        if (event.target.checked) {
            setShowTime('hidden');
        } else {
            setShowTime('visible');
        }
    }

    const saveEvent = async (event) => {
        event.preventDefault();
        const formID = event.target.id;
        const eventName = event.target[0].value;
        const date = event.target[1].value;
        const startTime = event.target[3].value;
        const endTime = event.target[4].value;
        const allDay = event.target[2].checked;
        const address = event.target[5].value;

        const formatDate = (fullDate) => {
            const day = new Date(fullDate + 'T00:00').getDate();
            const month = new Date(fullDate + 'T00:00').getMonth() + 1;
            const year = new Date(fullDate + 'T00:00').getFullYear();
            return `${year}-${month}-${day}`;
        }

        // startTime and endTime must not be null unless allDay is checked
        // date must not be null unless recurring

        if ((!startTime || !endTime) && !allDay) {
            alert('Event must have a start time and end time.');
        }
        else if (!date) {
            alert("Event must have a date.")
        }
        else {

            const response = await fetch('/api/data/add', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'Event',
                    event: eventName,
                    date: recurring === 'Not-Recurring' ? formatDate(date) : null,
                    startTime: allDay ? null : startTime,
                    endTime: allDay ? null : endTime,
                    allDay: allDay,
                    address: address ? address : null,
                    startDate: recurring !== 'Not-Recurring' ? formatDate(date) : null,
                    recurring: recurring !== 'Not-Recurring' ? recurring : null,
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                document.getElementById(formID).reset();
                resetForm();

                setTodaysEvents([]);
                getData();
                
                closeModal();
            } else {
                console.error(response.statusText);
            }
        }
    }

    const closeModal = () => {
        setAddVisibility('hidden');
    }

    const resetForm = () => {
        setShowTime('visible');
        setReccuring('Non-Recurring');
        
    }

    return (
        <div id="modal-background" className={addVisibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`}/>

                    <div id="add-event-modal" className={css`margin: 0 auto; width: 75%;`}>
                        <div id="form-header">
                            <h2>Add an Event</h2>
                        </div>
                        <form id="event-form" onSubmit={saveEvent}>
                            <div id="form-input">
                                <label htmlFor='eventName'>Name</label>
                                <input type="text" name="eventName" required />
                            </div>
                            <div id="form-input">
                                <label htmlFor='date'>Date</label>
                                <input type="date" name="date" />
                            </div>
                            <div id="checkbox">
                                <label htmlFor='allDay'>All Day?</label>
                                <input type="checkbox" name="allDay" onChange={setTimeVisibility} />
                            </div>
                            <div id="form-input" className={showTime}>
                                <label htmlFor='startTime'>Start Time</label>
                                <input type="time" name="startTime" />
                            </div>
                            <div id="form-input" className={showTime}>
                                <label htmlFor='endTime'>End Time</label>
                                <input type="time" name="endTime" />
                            </div>
                            <div id="form-input">
                                <label htmlFor='address'>Address</label>
                                <input type="text" name="address" />
                            </div>
                            <div id="form-input">
                                <label htmlFor='recurring'>Recurring Event?</label>
                                <select name="recurring" onChange={event => setReccuring(event.target.value)}>
                                    <option value="Not-Recurring">Not Recurring</option>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                </select>
                            </div>

                            <div id="form-submit-buttons">
                                <input type="submit" value="Save" />
                                <input type="reset" value="Clear" onClick={resetForm}/>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}