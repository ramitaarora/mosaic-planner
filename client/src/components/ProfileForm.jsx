import { useState, useEffect } from 'react';
import { css } from '@emotion/css';

export default function ProfileForm({ visibility, setVisibility, colourTheme, setColourTheme, getData, demo }) {
    // Input variables for profile form; sets the existing values in the form for ease of change
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [location, setLocation] = useState('')
    const [timezone, setTimezone] = useState('')
    const [temperature, setTemperature] = useState('');
    // Select options for time zones
    const timezoneOptions = ["America/New_York", "America/Los_Angeles", "America/Chicago", "Europe/London", "Asia/Tokyo", "Europe/Paris", "Asia/Shanghai", "Asia/Kolkata", "Europe/Berlin", "Australia/Sydney"];
    // Colour theme names
    const colourThemes = ["dark", "light", "blue", "purple", "pink", "forest", "misty", "classy", "saffron", "gold", "halloween", "spring", "ocean", "love", "desert"];

    const closeModal = () => {
        // Close profile form modal
        setVisibility('hidden');
    }

    const getUser = () => {
        // Fetch user info
        fetch('/api/users/getUser')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // console.log(data)
                setName(data.user[0].name);
                setEmail(data.user[0].email);
                setLocation(data.user[0].location);
                setColourTheme(data.user[0].colour);
                setTimezone(data.user[0].timezone);
                setTemperature(data.user[0].temperature);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    const updateProfile = async (event) => {
        // Function to update user information in database
        event.preventDefault();
        const inputType = String(event.target.id).split('-')[0];
        let inputData;

        // To get input data for temperature form
        if (inputType === 'temperature') {
            for (let i = 0; i < 2; i++) {
                if (event.target[i].checked) {
                    inputData = event.target[i].value;
                }
            }
        } else if (inputType === 'location') {
            const zipcodeTest = new RegExp('^\\d{5}$');
            const zipcode = zipcodeTest.test(event.target[0].value);

            if (!zipcode) {
                alert('Invalid zipcode.')
            } else {
                inputData = event.target[0].value;
            }
        }
        else {
            // Input data for all other types
            inputData = event.target[0].value;
        }

        // Change data in database
        if (inputData.length) {
            const response = await fetch('/api/users/updateUser', {
                method: 'PUT',
                body: JSON.stringify({
                    data: inputData,
                    type: inputType
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                getData();
                getUser();
            } else {
                console.error(response.statusText);
            }
        }
    }

    useEffect(() => {
        // Fetch user info on first load
        getUser();
    }, [])

    const handleColours = async (event) => {
        // Change colour theme in database
        setColourTheme(event.target.id);

        const response = await fetch('/api/users/updateUser', {
            method: 'PUT',
            body: JSON.stringify({
                type: 'colour',
                colourTheme: event.target.id
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            getData();
        } else {
            console.error(response.statusText);
        }
    }

    return (
        <div id="modal-background" className={visibility}>
            <div className="modal">
                <div className="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`} />

                    <div id="profile-modal">
                        <div className="modal-header">
                            <h2>Edit Profile</h2>
                        </div>

                        <div id="account-forms" className={css`width: 80%; margin: 0 auto;`}>
                            <form id="name-form" onSubmit={updateProfile}>
                                <div className="form-input">
                                    <label htmlFor="editName">Name:</label>
                                    <div>
                                        <input type="text" name="editName" value={name} onChange={(event) => setName(event.target.value)} required />
                                        <input type="submit" value="Save" />
                                    </div>
                                </div>

                            </form>
                            <form id="location-form" onSubmit={updateProfile}>
                                <div className="form-input">
                                    <label htmlFor="editLocation">Location:</label>
                                    <div>
                                        <input type="text" name="editLocation" value={location} onChange={(event) => setLocation(event.target.value)} required />
                                        <input type="submit" value="Save" />
                                    </div>
                                </div>
                            </form>

                            <form id="timezone-form" onSubmit={updateProfile}>
                                <div className="form-input">
                                    <label htmlFor="editTimezone">Timezone:</label>
                                    <div>
                                        <select name="editTimezone" onChange={(event) => setTimezone(event.target.value)} required>
                                            <option value={timezone}>{timezone}</option>
                                            {timezoneOptions.filter((time) => time != timezone).map((zone, index) => 
                                                <option value={zone} key={index}>{zone}</option>    
                                            )}
                                        </select>
                                        <input type="submit" value="Save" />
                                    </div>
                                </div>
                            </form>

                            <form id="temperature-form" onSubmit={updateProfile}>
                                <div className="form-input">
                                    <label>Temperature:</label>
                                    <div className={css`width: 100%; display: flex; justify-content: space-between; align-items: center;`}>
                                        <div className={css`width: 100%; display: flex; justify-content: space-evenly; align-items: center;`}>
                                            <div>
                                                <input type="radio" name="editTemperature" value="F" required onChange={(event) => setTemperature(event.target.value)}/>
                                                <label htmlFor='F'>°F</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="editTemperature" value="C" required onChange={(event) => setTemperature(event.target.value)}/>
                                                <label htmlFor='C'>°C</label>
                                            </div>
                                        </div>
                                        <input type="submit" value="Save" />
                                    </div>
                                </div>
                            </form>

                           {!demo && <form id="email-form" onSubmit={updateProfile}>
                                <div className="form-input">
                                    <label htmlFor="editEmail">Email:</label>
                                    <div>
                                        <input type="text" name="editEmail" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                        <input type="submit" value="Save" />
                                    </div>
                                </div>
                            </form>}

                            {!demo && <form id="password-form" onSubmit={updateProfile}>
                                <div className="form-input">
                                    <label htmlFor="editPass">Password:</label>
                                    <div>
                                        <input type="password" name="editPass" value={pass} onChange={(event) => setPass(event.target.value)} required />
                                        <input type="submit" value="Save" />
                                    </div>
                                </div>
                            </form>}

                        </div>

                        <div id="colour-themes" className={css`margin: 20px 0;`}>
                            <div className="modal-header">
                                <h2>Set Colour Theme</h2>
                            </div>


                            <form id="colour-form" onChange={handleColours} className={css`display: flex; flex-wrap: wrap; justify-content: space-evenly;`} >
                                {colourThemes.map((theme, index) => (
                                    <div className="form-input" key={index}>
                                        <input type="radio" id={theme} name="colour-theme" />
                                        <label htmlFor={theme}><img src={`./colour-palettes/${theme}.png`} alt={theme} /></label>
                                    </div>
                                ))}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}