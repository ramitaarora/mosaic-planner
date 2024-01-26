import { useEffect, useState } from 'react';

export default function EditEventsForm({ editVisibility, setEditVisibility, getData, eventToEdit }) {
    const [eventName, setEventName] = useState();
    const [eventDate, setEventDate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [allDay, setAllDay] = useState();
    const [address, setAddress] = useState();
    const [recurring, setRecurring] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const formatDateHTML = (fullDate) => {
        let day = new Date(fullDate).getDate();
        let month = new Date(fullDate).getMonth() + 1;
        const year = new Date(fullDate).getFullYear();

        if (month <= 9) month = '0' + month;
        if (day <= 9) day = '0' + day;

        return `${year}-${month}-${day}`;
    }

    formatDateHTML();

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
        setEditVisibility('form-hidden');
    }

    const resetForm = () => {
        
    }

    return (
        <div id="modal-background" className={editVisibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} />
                    <div id="edit-event-modal">
                        <div id="form-header">
                            <h2>Edit {eventToEdit ? eventToEdit.event : null}</h2>
                        </div>
                        <form id="event-form" onSubmit={saveEvent}>

                        {eventToEdit ? (
                            <div id="form-input">
                            <label htmlFor='eventName'>Name</label>
                            <input type="text" name="eventName" value={eventToEdit.event} onChange={event => setEventName(event.target.value)} required />
                            </div>
                        ) : null}
                            
                        {eventToEdit ? (
                            eventToEdit.date ? (
                                <div id="form-input">
                                <label htmlFor='date'>Date</label>
                                <input type="date" name="date" value={formatDateHTML(eventToEdit.date)} onChange={event => setEventDate(event.target.value)}/>
                                </div>
                            ) : null
                        ) : null}
                            
                        {eventToEdit ? (
                            eventToEdit.start_time ? (
                                <div id="form-input">
                                <label htmlFor='startTime'>Start Time</label>
                                <input type="time" name="startTime" value={eventToEdit.start_time} onChange={event => setStartTime(event.target.value)}/>
                                </div>
                            ) : null
                        ) : null}

                        {eventToEdit ? (
                            eventToEdit.end_time ? (
                                <div id="form-input">
                                <label htmlFor='endTime'>End Time</label>
                                <input type="time" name="endTime" value={eventToEdit.end_time} onChange={event => setEndTime(event.target.value)}/>
                                </div>
                            ) : null
                        ) : null}
                            
                        {eventToEdit ? (
                                <div id="form-input">
                                <label htmlFor='allDay'>All Day</label>
                                <input type="checkbox" name="allDay" checked={eventToEdit.all_day} onChange={event => setAllDay(event.target.checked)}/>
                            </div>
                        ) : null}

                        {eventToEdit ? (
                            <div id="form-input">
                            <label htmlFor='address'>Address</label>
                            <input type="text" name="address" value={eventToEdit.address ? eventToEdit.address : ''} onChange={event => setAddress(event.target.value)}/>
                        </div>
                        ): null}

                        {eventToEdit ? (
                            <div id="form-input">
                            <label htmlFor='recurring'>Recurring Event?</label>
                            <select name="recurring" value={eventToEdit.recurring ? eventToEdit.recurring : "Not-Recurring"} onChange={event => setRecurring(event.target.value)}>
                                <option value="Not-Recurring">Not Recurring</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Annually">Annually</option>
                            </select>
                            </div>
                        ) : null}

                        {eventToEdit ? (
                            eventToEdit.recurring ? (
                                <div id="form-input">
                                <label htmlFor='startDate'>Start Date</label>
                                <input type="date" name="startDate" value={formatDateHTML(eventToEdit.start_date)} onChange={event => setStartTime(event.target.value)}/>
                            </div>
                            ) : null
                        ) : null}

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