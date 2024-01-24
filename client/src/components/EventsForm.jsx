export default function EventsForm() {
    return (
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
    )
}