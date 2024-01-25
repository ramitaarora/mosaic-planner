import { useState, useEffect } from 'react';
import AddEventsForm from './AddEventsForm';

export default function Schedule({ events, setEvents, getData }) {
    const [inputValue, setInputValue] = useState('');
    const today = new Date();
    const [todaysEvents, setTodaysEvents] = useState([])
    const [addVisibility, setAddVisibility] = useState('form-hidden');

    const getTodaysEvents = () => {
        const nonRecurring = events.filter(event => event.date);
        const dailyEvents = events.filter(event => event.recurring === "Daily");
        const weeklyEvents = events.filter(event => event.recurring === "Weekly");
        const monthlyEvents = events.filter(event => event.recurring === "Monthly");
        const annualEvents = events.filter(event => event.recurring === "Annually");

        nonRecurring.forEach(event => {
            let eventDate = new Date(event.date);
            const checkDuplicate = todaysEvents.find(event => event.id === event.id);

            if ((String(eventDate)).slice(0,15) === (String(today)).slice(0,15) && !checkDuplicate) {
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
            
            const isToday = dailyDates.find(date => (String(date)).slice(0,15) === (String(today)).slice(0,15));            
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

            const isToday = weeklyDates.find(date => (String(date)).slice(0,15) === (String(today)).slice(0,15));            
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
            
            const isToday = monthlyDates.find(date => (String(date)).slice(0,15) === (String(today)).slice(0,15));
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
            
            const isToday = annualDates.find(date => (String(date)).slice(0,15) === (String(today)).slice(0,15));
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
    }, [events])

    const getHours = (time) => {
        if (Number(time[0] + time[1]) <= 12) {
            return time;
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
        const eventValue = event.target.attributes[3].nodeValue;

        const formID = document.getElementById(`eventForm-${eventID}`);
        formID.setAttribute('class', 'form-visible');

        const inputField = document.getElementById(`eventInput-${eventID}`);
        inputField.setAttribute('value', eventValue);
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
                // console.log(response.statusText);
                fetch('/api/data/allData')
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json(); // or response.text() for text data
                    })
                    .then((data) => {
                        // console.log(data);
                        setEvents(data.events.map(event => event));
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
            } else {
                alert(response.statusText);
            }
        }
    }

    const submitEdit = async (event) => {
        event.preventDefault();
        const formID = event.target.id;
        const eventID = event.target.parentElement.parentElement.attributes[1].value;
        const formInput = event.target[0].value;
        console.log(formInput)

        const response = await fetch('/api/data/edit', {
            method: 'PUT',
            body: JSON.stringify({
                id: eventID,
                event: formInput,
                type: 'Event'
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // console.log(response.statusText);
            fetch('/api/data/allData')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json(); // or response.text() for text data
                })
                .then((data) => {
                    // console.log(data);
                    setEvents(data.events.map(event => event));
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        } else {
            alert(response.statusText);
        }

        document.getElementById(formID).setAttribute('class', 'form-hidden');
        setInputValue('');
    }

    const cancelEdit = (event) => {
        event.preventDefault();
        const formID = event.target.form.id;

        const formEl = document.getElementById(formID);
        formEl.setAttribute('class', 'form-hidden');
        setInputValue('');
    }

    const addNewEvent = (event) => {
        setAddVisibility('form-visible')
    }

    const submitNewEvent = async (event) => {
        event.preventDefault();
        const newEventValue = event.target[0].value;

        if (newEventValue.length) {
            const response = await fetch('/api/data/add', {
                method: 'POST',
                body: JSON.stringify({
                    userID: 1,
                    event: newEventValue,
                    type: 'Event'
                }),
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.ok) {
                // console.log(response.statusText);
                fetch('/api/data/allData')
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json(); // or response.text() for text data
                    })
                    .then((data) => {
                        // console.log(data);
                        setEvents(data.events.map(event => event));
                        document.getElementById('add-event').setAttribute('class', 'form-hidden');
                        document.getElementById('cancel-event-button').setAttribute('class', 'form-hidden');
                        document.getElementById('add-event-button').setAttribute('class', 'form-visible');
                        setInputValue('')
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
            } else {
                alert(response.statusText);
            }
        }
    }

    const cancelNewEvent = (event) => {
        event.preventDefault();
        // document.getElementById('add-event').setAttribute('class', 'form-hidden');
        // document.getElementById('cancel-event-button').setAttribute('class', 'form-hidden');
        // document.getElementById('add-event-button').setAttribute('class', 'form-visible');
    }

    return (
        <div id="schedule">

            <div id="card-header">
                <h2>Today's Schedule</h2>
                <img id="add-event-button" src="./svgs/add.svg" alt="add" onClick={addNewEvent} />
            </div>
            <AddEventsForm addVisibility={addVisibility} setAddVisibility={setAddVisibility} getData={getData} />

            <div>
                <ul>
                {todaysEvents.length ? ( 
                    todaysEvents.map((event, index) =>
                    <div key={index} id="line" value={event.id}>
                        <div id="each-event">
                            { event.all_day ? (
                                <p id="all-day-event">{event.event}</p>
                            ) : (
                                <div>
                                    <li>{event.event}</li>
                                    <p>{getHours(event.start_time)}{event.start_time[0] + event.start_time[1] < 12 ? 'AM' : 'PM'}-{getHours(event.end_time)}{event.end_time[0] + event.end_time[1] < 12 ? 'AM' : 'PM'}</p>
                                    {event.address ? <p>{event.address}</p> : null}
                                </div>
                            )
                            }
                            <form id={'eventForm-' + event.id} className="form-hidden" onSubmit={submitEdit}>
                                <input type="text" id={'eventInput-' + event.id} onChange={(event) => setInputValue(event.target.value)} />
                                <input type="submit" className="submit-button" />
                                <button id="cancel-edit" onClick={cancelEdit}>Cancel</button>
                            </form>
                        </div>
                        <div id="edit-buttons">
                            <img src="./svgs/edit.svg" alt="edit" onClick={editEvent} id={event.id} value={event.event} />
                            <img src="./svgs/delete.svg" alt="edit" onClick={deleteEvent} id={event.id} />
                        </div>
                    </div>
                )
                ) : ( <p>No events today!</p> )}
                </ul>
            </div>
        </div>
    )
}