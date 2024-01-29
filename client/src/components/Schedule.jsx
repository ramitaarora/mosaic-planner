import { useState, useEffect } from 'react';
import AddEventsForm from './AddEventsForm';
import EditEventsForm from './EditEventForm';
import Calendar from 'react-calendar';

export default function Schedule({ events, setEvents, getData }) {
    const [inputValue, setInputValue] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [todaysEvents, setTodaysEvents] = useState([])
    const [addVisibility, setAddVisibility] = useState('form-hidden');
    const [editVisibility, setEditVisibility] = useState('form-hidden');
    const [eventToEdit, setEventToEdit] = useState();
    const [formattedDate, setFormattedDate] = useState(String(currentDate).slice(3, 15))

    const getTodaysEvents = () => {
        const nonRecurring = events.filter(event => event.date);
        const dailyEvents = events.filter(event => event.recurring === "Daily");
        const weeklyEvents = events.filter(event => event.recurring === "Weekly");
        const monthlyEvents = events.filter(event => event.recurring === "Monthly");
        const annualEvents = events.filter(event => event.recurring === "Annually");

        nonRecurring.forEach(event => {
            let eventDate = new Date(event.date);
            const checkDuplicate = todaysEvents.find(event => event.id === event.id);

            if ((String(eventDate)).slice(0, 15) === (String(currentDate)).slice(0, 15) && !checkDuplicate) {
                setTodaysEvents((pre => [...pre, event]));
            }
        })

        dailyEvents.forEach(event => {
            let dailyDates = [];

            for (let i = 0; i < 52; i++) {
                let startDate = new Date(event.start_date);
                const addDay = startDate.setDate(startDate.getDate() + i);
                const eachDate = new Date(addDay)
                dailyDates.push(eachDate)
            }

            const isToday = dailyDates.find(date => (String(date)).slice(0, 15) === (String(currentDate)).slice(0, 15));
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

            const isToday = weeklyDates.find(date => (String(date)).slice(0, 15) === (String(currentDate)).slice(0, 15));
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

            const isToday = monthlyDates.find(date => (String(date)).slice(0, 15) === (String(currentDate)).slice(0, 15));
            const checkDuplicate = todaysEvents.find(event => event.id === event.id);

            if (isToday && !checkDuplicate) {
                setTodaysEvents((pre) => [...pre, event]);
            }
        })

        annualEvents.forEach(event => {
            let annualDates = [];
            let startDate = new Date(event.start_date);
            annualDates.push(startDate)

            for (let i = 0; i < 50; i++) {
                let newDate = new Date(annualDates[i]);
                const addYear = newDate.setFullYear(newDate.getFullYear() + 1);
                const eachDate = new Date(addYear)
                annualDates.push(eachDate);
            }

            const isToday = annualDates.find(date => (String(date)).slice(0, 15) === (String(currentDate)).slice(0, 15));
            const checkDuplicate = todaysEvents.find(event => event.id === event.id);

            if (isToday && !checkDuplicate) {
                setTodaysEvents((pre) => [...pre, event]);
            }
        })
    }

    useEffect(() => {
        if (events.length) {
            getTodaysEvents();
        }
    }, [events, todaysEvents])

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
        setEditVisibility('form-visible');
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
                getDate();
            } else {
                alert(response.statusText);
            }
        }
    }

    const addNewEvent = () => {
        setAddVisibility('form-visible')
    }

    const clickDay = (event, value) => {
        let selectedDate = new Date(event);
        setCurrentDate(selectedDate);
        setTodaysEvents([]);
    }

    return (
        <div id="schedule">

            <div id="card-header">
                <h2>{formattedDate}</h2>
                <img id="add-event-button" src="./svgs/add.svg" alt="add" onClick={addNewEvent}/>
            </div>

            <Calendar className="react-calendar" defaultView="month" onClickDay={clickDay} value={currentDate} onChange={clickDay}/>
            <AddEventsForm addVisibility={addVisibility} setAddVisibility={setAddVisibility} getData={getData} />
            <EditEventsForm editVisibility={editVisibility} setEditVisibility={setEditVisibility} getData={getData} eventToEdit={eventToEdit} />

            <div>
                <ul>
                    {todaysEvents.length ? (
                        todaysEvents.map((event, index) =>
                            <div key={index} id="line" value={event.id}>
                                <div id="each-event">
                                    {event.all_day ? (
                                        <p id="all-day-event">{event.event}</p>
                                    ) : (
                                        <div>
                                            <li>{event.event}</li>
                                            <p>{getHours(event.start_time)}{event.start_time[0] + event.start_time[1] < 12 ? 'AM' : 'PM'}-{getHours(event.end_time)}{event.end_time[0] + event.end_time[1] < 12 ? 'AM' : 'PM'}</p>
                                            {event.address ? <p>{event.address}</p> : null}
                                        </div>
                                    )
                                    }
                                </div>
                                <div id="edit-buttons">
                                    <img src="./svgs/edit.svg" alt="edit" onClick={editEvent} id={event.id} />
                                    <img src="./svgs/delete.svg" alt="edit" onClick={deleteEvent} id={event.id} />
                                </div>
                            </div>
                        )
                    ) : null}
                </ul>
            </div>
        </div>
    )
}