import { useState, useEffect } from 'react';
import { css } from '@emotion/css';

export default function ProfileForm({ visibility, setVisibility, colourTheme, setColourTheme, getData, demo }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [location, setLocation] = useState('')
    const [timezone, setTimezone] = useState('')
    const [temperature, setTemperature] = useState('');

    const timezoneOptions = ["America/New_York", "America/Los_Angeles", "America/Chicago", "Europe/London", "Asia/Tokyo", "Europe/Paris", "Asia/Shanghai", "Asia/Kolkata", "Europe/Berlin", "Australia/Sydney"];

    const closeModal = () => {
        setVisibility('hidden');
    }

    const getUser = () => {
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
        event.preventDefault();
        const inputType = String(event.target.id).split('-')[0];
        let inputData;

        if (inputType === 'temperature') {
            for (let i = 0; i < 2; i++) {
                if (event.target[i].checked) {
                    inputData = event.target[i].value;
                }
            }
        } else {
            inputData = event.target[0].value;
        }

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
        getUser();
    }, [])

    const handleColours = async (event) => {
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
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`} />

                    <div id="profile-modal">
                        <div id="modal-header">
                            <h2>Edit Profile</h2>
                        </div>

                        <div id="account-forms" className={css`width: 80%; margin: 0 auto;`}>
                            <form id="name-form" onSubmit={updateProfile}>
                                <div id="form-input">
                                    <label htmlFor="editName">Name:</label>
                                    <div>
                                        <input type="text" name="editName" value={name} onChange={(event) => setName(event.target.value)} required />
                                        <input type="submit" value="Save" />
                                    </div>
                                </div>

                            </form>
                            <form id="location-form" onSubmit={updateProfile}>
                                <div id="form-input">
                                    <label htmlFor="editLocation">Location:</label>
                                    <div>
                                        <input type="text" name="editLocation" value={location} onChange={(event) => setLocation(event.target.value)} required />
                                        <input type="submit" value="Save" />
                                    </div>
                                </div>
                            </form>

                            <form id="timezone-form" onSubmit={updateProfile}>
                                <div id="form-input">
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
                                <div id="form-input">
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
                                <div id="form-input">
                                    <label htmlFor="editEmail">Email:</label>
                                    <div>
                                        <input type="text" name="editEmail" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                        <input type="submit" value="Save" />
                                    </div>
                                </div>
                            </form>}

                            {!demo && <form id="password-form" onSubmit={updateProfile}>
                                <div id="form-input">
                                    <label htmlFor="editPass">Password:</label>
                                    <div>
                                        <input type="password" name="editPass" value={pass} onChange={(event) => setPass(event.target.value)} required />
                                        <input type="submit" value="Save" />
                                    </div>
                                </div>
                            </form>}

                        </div>

                        <div id="colour-themes" className={css`margin: 20px 0;`}>
                            <div id="modal-header">
                                <h2>Set Colour Theme</h2>
                            </div>


                            <form id="colour-form" onChange={handleColours} className={css`display: flex; flex-wrap: wrap; justify-content: space-evenly;`} >
                                <div id="form-input">
                                    <input type="radio" id="dark" name="colour-theme" />
                                    <label htmlFor='dark'><img src="./colour-palettes/dark.png" alt="dark" /></label>
                                </div>
                                <div id="form-input">
                                    <input type="radio" id="light" name="colour-theme" />
                                    <label htmlFor='light'><img src="./colour-palettes/light.png" alt="light" /></label>
                                </div>
                                <div id="form-input">
                                    <input type="radio" id="blue" name="colour-theme" />
                                    <label htmlFor='blue'><img src="./colour-palettes/blue.png" alt="blue" /></label>
                                </div>
                                <div id="form-input">
                                    <input type="radio" id="purple" name="colour-theme" />
                                    <label htmlFor='purple'><img src="./colour-palettes/purple.png" alt="purple" /></label>
                                </div>
                                <div id="form-input">
                                    <input type="radio" id="pink" name="colour-theme" />
                                    <label htmlFor='pink'><img src="./colour-palettes/pink.png" alt="pink" /></label>
                                </div>
                                <div id="form-input">
                                    <input type="radio" id="forest" name="colour-theme" />
                                    <label htmlFor='forest'><img src="./colour-palettes/forest.png" alt="forest" /></label>
                                </div>
                                <div id="form-input">
                                    <input type="radio" id="misty" name="colour-theme" />
                                    <label htmlFor='misty'><img src="./colour-palettes/misty.png" alt="misty" /></label>
                                </div>
                                <div id="form-input">
                                    <input type="radio" id="classy" name="colour-theme" />
                                    <label htmlFor='classy'><img src="./colour-palettes/classy.png" alt="classy" /></label>
                                </div>
                                <div id="form-input">
                                    <input type="radio" id="saffron" name="colour-theme" />
                                    <label htmlFor='saffron'><img src="./colour-palettes/saffron.png" alt="saffron" /></label>
                                </div>
                                <div id="form-input">
                                    <input type="radio" id="gold" name="colour-theme" />
                                    <label htmlFor='gold'><img src="./colour-palettes/gold.png" alt="gold" /></label>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}