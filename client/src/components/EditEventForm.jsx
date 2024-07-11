import { useEffect, useState } from 'react';
import { css } from '@emotion/css';

export default function EditEventsForm({ editVisibility, setEditVisibility, getData, eventToEdit, setTodaysEvents }) {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [allDay, setAllDay] = useState('');
    const [address, setAddress] = useState('');
    const [recurring, setRecurring] = useState('');
    // const [startDate, setStartDate] = useState('');

    const [timeVisibility, setTimeVisibility] = useState('hidden')

    useEffect(() => {
        if (eventToEdit) {
            setEventName(eventToEdit.event);
            setEventDate(eventToEdit.date ? formatDateHTML(eventToEdit.date) : formatDateHTML(eventToEdit.start_date));
            setStartTime(eventToEdit.start_time ? eventToEdit.start_time : '');
            setEndTime(eventToEdit.end_time ? eventToEdit.end_time : '');
            setAllDay(eventToEdit.all_day ? true : false);
            setAddress(eventToEdit.address ? eventToEdit.address : '');
            // setStartDate(eventToEdit.start_date ? formatDateHTML(eventToEdit.start_date) : '');
            setRecurring(eventToEdit.recurring ? eventToEdit.recurring : 'Not-Recurring');
            setTimeVisibility(eventToEdit.all_day ? 'hidden' : 'visible')
        }
    }, [eventToEdit])

    const changeAllDay = (event) => {
        if (event.target.checked) {
            setTimeVisibility('hidden');
            setAllDay(true)
        }
        if (!event.target.checked) {
            setTimeVisibility('visible');
            setAllDay(false)
        }
    }

    const formatDateHTML = (fullDate) => {
        let day = new Date(fullDate).getDate();
        let month = new Date(fullDate).getMonth() + 1;
        const year = new Date(fullDate).getFullYear();

        if (month <= 9) month = '0' + month;
        if (day <= 9) day = '0' + day;

        return `${year}-${month}-${day}`;
    }

    const saveEvent = async (event) => {
        event.preventDefault();

        const formatDate = (fullDate) => {
            const day = new Date(fullDate + 'T00:00').getDate();
            const month = new Date(fullDate + 'T00:00').getMonth() + 1;
            const year = new Date(fullDate + 'T00:00').getFullYear();
            return `${year}-${month}-${day}`;
        }

        // startTime and endTime must not be null unless allDay is checked
        // date must not be null unless recurring
        // start date must not be a value unless recurring

        if ((!startTime || !endTime) && !allDay) {
            alert('Event must have a start time and end time.');
        }
        else if (!eventDate) {
            alert("Event must have a date.")
        }
        else {
            const response = await fetch('/api/data/edit', {
                method: 'PUT',
                body: JSON.stringify({
                    type: 'Event',
                    id: eventToEdit.id,
                    event: eventName,
                    date: recurring === 'Not-Recurring' ? formatDate(eventDate) : null,
                    startTime: allDay ? null : startTime,
                    endTime: allDay ? null : endTime,
                    allDay: allDay,
                    address: address ? address : null,
                    startDate: recurring !== 'Not-Recurring' ? formatDate(eventDate) : null,
                    recurring: recurring !== 'Not-Recurring' ? recurring : null,
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                setTodaysEvents([]);
                getData();
                closeModal();
            } else {
                console.error(response.statusText);
            }
        }
    }

    const closeModal = () => {
        setEditVisibility('hidden');
    }

    const resetForm = (event) => {
        event.preventDefault();
        if (eventToEdit) {
            setEventName(eventToEdit.event);
            setEventDate(eventToEdit.date ? formatDateHTML(eventToEdit.date) : '');
            setStartTime(eventToEdit.start_time ? eventToEdit.start_time : '');
            setEndTime(eventToEdit.end_time ? eventToEdit.end_time : '');
            setAllDay(eventToEdit.all_day ? true : false);
            setAddress(eventToEdit.address ? eventToEdit.address : '');
            setStartDate(eventToEdit.start_date ? formatDateHTML(eventToEdit.start_date) : '');
            setRecurring(eventToEdit.recurring ? eventToEdit.recurring : 'Not-Recurring');
            setTimeVisibility(eventToEdit.all_day ? 'hidden' : 'visible')
        }
    }

    return (
        <div id="modal-background" className={editVisibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`} />
                    <div id="edit-event-modal">
                        <div id="form-header">
                            <h2>Edit {eventToEdit ? eventToEdit.event : null}</h2>
                        </div>
                        <form id="event-form" onSubmit={saveEvent} className={css`margin: 0 auto; width: 75%;`}>

                            {eventToEdit ? (
                                <div id="form-input">
                                    <label htmlFor='eventName'>Name</label>
                                    <input type="text" name="eventName" value={eventName} onChange={event => setEventName(event.target.value)} required />
                                </div>
                            ) : null}

                            {eventToEdit ? (
                                eventToEdit.date ? (
                                    <div id="form-input">
                                        <label htmlFor='date'>Date</label>
                                        <input type="date" name="date" value={eventDate} onChange={event => setEventDate(event.target.value)} />
                                    </div>
                                ) : (
                                    <div id="form-input">
                                        <label htmlFor='date'>Start Date</label>
                                        <input type="date" name="date" value={eventDate} onChange={event => setEventDate(event.target.value)} />
                                    </div>
                                )
                            ) : null}

                            {eventToEdit ? (
                                <div id="checkbox">
                                    <label htmlFor='allDay'>All Day?</label>
                                    <input type="checkbox" name="allDay" checked={allDay} onChange={changeAllDay} />
                                </div>
                            ) : null}

                            {eventToEdit ? (
                                <div>
                                    <div id="form-input" className={timeVisibility}>
                                        <label htmlFor='startTime'>Start Time</label>
                                        <input type="time" name="startTime" value={startTime} onChange={event => setStartTime(event.target.value)} />
                                    </div>

                                    <div id="form-input" className={timeVisibility}>
                                        <label htmlFor='endTime'>End Time</label>
                                        <input type="time" name="endTime" value={endTime} onChange={event => setEndTime(event.target.value)} />
                                    </div>
                                </div>
                            ) : null}

                            {eventToEdit ? (
                                <div id="form-input">
                                    <label htmlFor='address'>Address</label>
                                    <input type="text" name="address" value={address} onChange={event => setAddress(event.target.value)} />
                                </div>
                            ) : null}

                            {eventToEdit ? (
                                <div id="form-input">
                                    <label htmlFor='recurring'>Recurring Event?</label>
                                    <select name="recurring" value={recurring} onChange={event => setRecurring(event.target.value)}>
                                        <option value="Not-Recurring">Not Recurring</option>
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Annually">Annually</option>
                                    </select>
                                </div>
                            ) : null}

                            {/*eventToEdit ? (
                                eventToEdit.recurring ? (
                                    <div id="form-input">
                                        <label htmlFor='startDate'>Start Date</label>
                                        <input type="date" name="startDate" value={startDate} onChange={event => setStartDate(event.target.value)} />
                                    </div>
                                ) : null
                                ) : null*/}

                            <div id="form-submit-buttons">
                                <input type="submit" value="Save" />
                                <input type="reset" value="Clear" onClick={resetForm} />
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}