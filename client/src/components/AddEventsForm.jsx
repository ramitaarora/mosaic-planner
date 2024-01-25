import { useEffect, useState } from 'react';

export default function AddEventsForm({ addVisibility, setAddVisibility, getData }) {
    const [showEndDate, setShowEndDate] = useState('form-hidden');
    const [showTime, setShowTime] = useState('form-visible');
    const [recurring, setReccuring] = useState('Not-Recurring');
    const [endCheckVisibility, setEndCheckVisibility] = useState('form-hidden');
    const [endDateCheck, setEndDateCheck] = useState("");

    const setEndTimeVisibility = (event) => {
        setEndDateCheck("checked")
        if (event.target.checked) {
            setShowEndDate('form-visible');
        } else {
            setShowEndDate('form-hidden')
        }
    }

    const setTimeVisibility = (event) => {
        if (event.target.checked) {
            setShowTime('form-hidden');
        } else {
            setShowTime('form-visible')
        }
    }

    const onChangeRecurring = (event) => {
        setReccuring(event.target.value);

        if (event.target.value !== 'Not-Recurring') {
            setEndCheckVisibility('form-visible');
        }
        if (event.target.value === 'Not-Recurring') {
            setEndCheckVisibility('form-hidden');
            setShowEndDate('form-hidden');
            setEndDateCheck("")
        }
    }

    const saveEvent = async (event) => {
        event.preventDefault();
        const formID = event.target.id;
        const eventName = event.target[0].value;
        const date = event.target[1].value;
        const startTime = event.target[2].value;
        const endTime = event.target[3].value;
        const allDay = event.target[4].checked;
        const address = event.target[5].value;
        const endDate = event.target[8].value;

        const formatDate = (fullDate) => {
            const day = new Date(fullDate + 'T00:00').getDate();
            const month = new Date(fullDate + 'T00:00').getMonth() + 1;
            const year = new Date(fullDate + 'T00:00').getFullYear();
            return `${year}-${month}-${day}`;
        }

        // startTime and endTime must not be null unless allDay is checked
        // date must not be null unless recurring
        // end date must not be a value unless recurring

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
                    date: recurring === 'Not Recurring' ? formatDate(date) : null,
                    startTime: allDay ? null : startTime,
                    endTime: allDay ? null : endTime,
                    allDay: allDay,
                    address: address ? address : null,
                    startDate: recurring !== 'Not-Recurring' ? formatDate(date) : null,
                    endDate: recurring !== 'Not-Recurring' && endDate ? formatDate(endDate) : null,
                    recurring: recurring !== 'Not-Recurring' ? recurring : null,
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                alert('Event saved!')
                document.getElementById(formID).reset();
                getData();
                closeModal();
                location.reload();
            } else {
                alert(response.statusText);
            }
        }
    }

    const closeModal = () => {
        setAddVisibility('form-hidden');
    }

    const resetForm = () => {
        setShowEndDate('form-hidden');
        setShowTime('form-visible');
        setReccuring('Non-Recurring');
        setEndCheckVisibility('form-hidden');
        setEndDateCheck("")
        
    }

    return (
        <div id="modal-background" className={addVisibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} />

                    <div id="add-event-modal">
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

                            <div id="form-input" className={showTime}>
                                <label htmlFor='startTime'>Start Time</label>
                                <input type="time" name="startTime" />
                            </div>
                            <div id="form-input" className={showTime}>
                                <label htmlFor='endTime'>End Time</label>
                                <input type="time" name="endTime" />
                            </div>

                            <div id="form-input">
                                <label htmlFor='allDay'>All Day</label>
                                <input type="checkbox" name="allDay" onChange={setTimeVisibility} />
                            </div>
                            <div id="form-input">
                                <label htmlFor='address'>Address</label>
                                <input type="text" name="address" />
                            </div>
                            <div id="form-input">
                                <label htmlFor='recurring'>Recurring Event?</label>
                                <select name="recurring" onChange={onChangeRecurring}>
                                    <option value="Not-Recurring">Not Recurring</option>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                </select>
                            </div>
                            <div id="form-input" className={endCheckVisibility}>
                                <input type="checkbox" name="checkForEndDate" checked={endDateCheck} onChange={setEndTimeVisibility} />
                                <p>End Date?</p>
                            </div>
                            <div id="form-input" className={showEndDate}>
                                <label htmlFor='endDate'>End Date</label>
                                <input type="date" name="endDate" />
                            </div>
                            <div id="form-submit-buttons">
                                <input type="submit" value="Save" />
                                <input type="reset" value="Reset" onClick={resetForm}/>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}