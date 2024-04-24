import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import AddEventsForm from './AddEventsForm';
import EditEventsForm from './EditEventForm';
import Calendar from 'react-calendar';

export default function Schedule({ events, setEvents, fullDate, timezone, getData }) {
    const [currentDate, setCurrentDate] = useState(fullDate);
    const [todaysEvents, setTodaysEvents] = useState([])
    const [addVisibility, setAddVisibility] = useState('hidden');
    const [editVisibility, setEditVisibility] = useState('hidden');
    const [eventToEdit, setEventToEdit] = useState();
    const [formattedDate, setFormattedDate] = useState(new Date(currentDate))

    const getTodaysEvents = () => {
        const nonRecurring = events.filter(event => event.date);
        const dailyEvents = events.filter(event => event.recurring === "Daily");
        const weeklyEvents = events.filter(event => event.recurring === "Weekly");
        const monthlyEvents = events.filter(event => event.recurring === "Monthly");
        const annualEvents = events.filter(event => event.recurring === "Annually");

        nonRecurring.forEach(event => {
            let eventDate = new Date(event.date);
            const checkDuplicate = todaysEvents.find(event => event.id === event.id);

            if ((String(eventDate)).slice(0, 15) === (String(formattedDate)).slice(0, 15) && !checkDuplicate) {
                setTodaysEvents((pre => [...pre, event]));
            }
        })

        dailyEvents.forEach(event => {
            let dailyDates = [];

            for (let i = 0; i < 365; i++) {
                let startDate = new Date(event.start_date);
                const addDay = startDate.setDate(startDate.getDate() + i);
                const eachDate = new Date(addDay)
                dailyDates.push(eachDate)
            }

            const isToday = dailyDates.find(date => (String(date)).slice(0, 15) === (String(formattedDate)).slice(0, 15));
            const checkDuplicate = todaysEvents.find(event => event.id === event.id);

            if (isToday && !checkDuplicate) {
                setTodaysEvents((pre) => [...pre, event]);
            }
        })

        weeklyEvents.forEach(event => {
            let weeklyDates = [];
            let startDate = new Date(event.start_date);
            weeklyDates.push(startDate)

            for (let i = 0; i < 52; i++) {
                let newDate = new Date(weeklyDates[i])
                const addWeek = newDate.setDate(newDate.getDate() + 7);
                const eachDate = new Date(addWeek)
                weeklyDates.push(eachDate)
            }

            const isToday = weeklyDates.find(date => (String(date)).slice(0, 15) === (String(formattedDate)).slice(0, 15));
            const checkDuplicate = todaysEvents.find(event => event.id === event.id);

            if (isToday && !checkDuplicate) {
                setTodaysEvents((pre) => [...pre, event]);
            }
        })

        monthlyEvents.forEach(event => {
            let monthlyDates = [];
            let startDate = new Date(event.start_date);
            monthlyDates.push(startDate)

            for (let i = 0; i < 24; i++) {
                let newDate = new Date(monthlyDates[i]);
                const addMonth = newDate.setMonth(newDate.getMonth() + 1);
                const eachDate = new Date(addMonth)
                monthlyDates.push(eachDate);
            }

            const isToday = monthlyDates.find(date => (String(date)).slice(0, 15) === (String(formattedDate)).slice(0, 15));
            const checkDuplicate = todaysEvents.find(event => event.id === event.id);

            if (isToday && !checkDuplicate) {
                setTodaysEvents((pre) => [...pre, event]);
            }
        })

        annualEvents.forEach(event => {
            let annualDates = [];
            let startDate = new Date(event.start_date + 'T00:00');
            annualDates.push(startDate)

            for (let i = 0; i < 50; i++) {
                let newDate = new Date(annualDates[i]);
                const addYear = newDate.setFullYear(newDate.getFullYear() + 1);
                const eachDate = new Date(addYear)
                annualDates.push(eachDate);
            }

            const isToday = annualDates.find(date => (String(date)).slice(0, 15) === (String(formattedDate)).slice(0, 15));
            const checkDuplicate = todaysEvents.find(event => event.id === event.id);

            if (isToday && !checkDuplicate) {
                setTodaysEvents((pre) => [...pre, event]);
            }
        })
    }

    const sortTodaysEvents = () => {
        todaysEvents.sort((a, b) => {
            if (a.all_day !== b.all_day) {
                return a.all_day ? -1 : 1;
            }
            const timeA = a.start_time || '';
            const timeB = b.start_time || '';
            return timeA.localeCompare(timeB);
        })
    }

    useEffect(() => {
        if (events.length) {
            getTodaysEvents();
            sortTodaysEvents();
        }
    }, [events, currentDate])

    const getHours = (time) => {
        if (Number(time[0] + time[1]) <= 12 && Number(time[0]) !== 0) {
            return time;
        }
        else if (Number(time[0]) === 0) {
            return time[1] + time.slice(-3);
        }
        else if (time[0] + time[1] === '13') return '1' + time.slice(-3);
        else if (time[0] + time[1] === '14') return '2' + time.slice(-3);
        else if (time[0] + time[1] === '15') return '3' + time.slice(-3);
        else if (time[0] + time[1] === '16') return '4' + time.slice(-3);
        else if (time[0] + time[1] === '17') return '5' + time.slice(-3);
        else if (time[0] + time[1] === '18') return '6' + time.slice(-3);
        else if (time[0] + time[1] === '19') return '7' + time.slice(-3);
        else if (time[0] + time[1] === '20') return '8' + time.slice(-3);
        else if (time[0] + time[1] === '21') return '9' + time.slice(-3);
        else if (time[0] + time[1] === '22') return '10' + time.slice(-3);
        else if (time[0] + time[1] === '23') return '11' + time.slice(-3);
        else if (time[0] + time[1] === '24') return '12' + time.slice(-3);
        else return time;
    }

    const editEvent = (event) => {
        const eventID = event.target.attributes[2].nodeValue;
        const targetEvent = todaysEvents.find(event => event.id == eventID);
        setEventToEdit(targetEvent);
        setEditVisibility('visible');
    }

    const deleteEvent = async (event) => {
        const eventID = event.target.attributes[2].nodeValue;

        if (window.confirm("Are you sure you want to delete this event?")) {
            const response = await fetch('/api/data/delete', {
                method: 'DELETE',
                body: JSON.stringify({
                    id: eventID,
                    type: 'Event',
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                setTodaysEvents([]);
                getData();
            } else {
                console.error(response.statusText);
            }
        }
    }

    const addNewEvent = () => {
        setAddVisibility('visible')
    }

    const clickDay = (event, value) => {
        let selectedDate = new Date(event);

        const timeZoneDate = new Intl.DateTimeFormat('en-US', {
            dateStyle: 'full',
            timeZone: timezone,
          }).format(selectedDate);

        setCurrentDate(timeZoneDate);
        setFormattedDate(new Date(timeZoneDate));
        setTodaysEvents([]);
    }

    return (
        <div id="schedule" className={`card ${css`height: 55vh;`}`}>

            <div id="card-header">
                <h2>{currentDate ? currentDate : "Today"}</h2>
                <img id="add-event-button" src="./svgs/add.svg" alt="add" onClick={addNewEvent} />
            </div>

            <Calendar className="react-calendar" defaultView="month" onClickDay={clickDay} value={currentDate} onChange={clickDay} />
            <AddEventsForm addVisibility={addVisibility} setAddVisibility={setAddVisibility} getData={getData} setTodaysEvents={setTodaysEvents} />
            <EditEventsForm editVisibility={editVisibility} setEditVisibility={setEditVisibility} getData={getData} eventToEdit={eventToEdit} setTodaysEvents={setTodaysEvents} />

            <div>
                <ul>
                    {todaysEvents.length ? (
                        todaysEvents.map((event, index) =>
                            <div key={index} id="line" value={event.id}>
                                <div id="each-event" className={css`display: flex; flex-direction: column; margin: 5px; justify-content: space-evenly;`}>
                                    {event.all_day ? (
                                        <p id="all-day-event" className={css`font-size: 80%; margin: 5px 0;`}>{event.event}</p>
                                    ) : (
                                        <div>
                                            <li>{event.event}</li>
                                            <p className={css`font-size: 80%; margin: 5px 0;`}>{getHours(event.start_time)}{event.start_time[0] + event.start_time[1] < 12 ? 'AM' : 'PM'}-{getHours(event.end_time)}{event.end_time[0] + event.end_time[1] < 12 ? 'AM' : 'PM'}</p>
                                            {event.address ? <p className={css`font-size: 80%; margin: 5px 0;`}>{event.address}</p> : null}
                                        </div>
                                    )
                                    }
                                </div>
                                <div id="edit-buttons">
                                    <img src="./svgs/edit.svg" alt="edit" onClick={editEvent} id={event.id}/>
                                    <img src="./svgs/delete.svg" alt="edit" onClick={deleteEvent} id={event.id}/>
                                </div>
                            </div>
                        )
                    ) : (
                        <p id="empty">No events yet! Click the plus to add to your schedule.</p>
                    )}
                </ul>
            </div>
        </div>
    )
}