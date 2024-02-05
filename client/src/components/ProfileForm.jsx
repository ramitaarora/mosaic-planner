import { useState, useEffect } from 'react';
import { css } from '@emotion/css';

export default function ProfileForm({ visibility, setVisibility }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('')

    const closeModal = () => {
        setVisibility('hidden');
    }

    const getData = () => {
        fetch('/api/users/getUser')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // console.log(response);
                return response.json(); // or response.text() for text data
            })
            .then((data) => {
                setName(data.name);
                setEmail(data.email);
                setLocation(data.location);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    const updateProfile = async (event) => {
        event.preventDefault();
        const inputType = String(event.target.id).split('-')[0];
        const inputData = event.target[0].value;

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
                alert(`${inputType} updated!`)
                getData();
            } else {
                alert(response.statusText);
            }
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div id="modal-background" className={visibility}>
            <div id="modal">
                <div id="modal-content">
                    <img src="./svgs/exit.svg" alt="exit" onClick={closeModal} className={css`float: right;`}/>

                    <div id="profile-modal">
                        <div id="modal-header">
                            <h2>Edit Profile</h2>
                        </div>
                        
                        <div id="account-forms" className={css`margin: 0 auto; width: 70%;`}>
                            <form id="name-form" onSubmit={updateProfile}>
                                <label htmlFor="editName">Name:</label>
                                <input type="text" name="editName" id="editName" value={name} onChange={(event) => setName(event.target.value)} required />
                                <input type="submit" value="Save" />
                            </form>
                            <form id="location-form" onSubmit={updateProfile}>
                                <label htmlFor="editLocation">Location:</label>
                                <input type="text" name="editLocation" id="editLocation" value={location} onChange={(event) => setLocation(event.target.value)} required />
                                <input type="submit" value="Save" />
                            </form>
                            <form id="email-form" onSubmit={updateProfile}>
                                <label htmlFor="editEmail">Email:</label>
                                <input type="email" name="editEmail" id="editEmail" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                <input type="submit" value="Save" />
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}