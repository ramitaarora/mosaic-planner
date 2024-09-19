import { useState, useEffect } from 'react';
import { css } from '@emotion/css'

export default function Login() {
    // State variable for error message when logging in (ie. incorrect password)
    const [errorMessage, setErrorMessage] = useState(''); 

    useEffect(() => {
        // Redirect to homepage if logged in
        fetch('api/home')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // console.log(response);
            return response.json();
        })
        .then((data) => {
            if (data.loggedIn) {
                window.location.replace('/');
            }
        })
        .catch((error) => {
            console.error(error)
        });
    }, [])

    const showSignup = () => {
        // Show sign up form and hide login form
        document.getElementById('signup-form').setAttribute('class', 'visible');
        document.getElementById("login-instead").setAttribute('class', 'visible');
        document.getElementById('auth-form').setAttribute('class', 'hidden');
        document.getElementById("signup-instead").setAttribute('class', 'hidden');
        setErrorMessage('')
    }

    const showLogin = () => {
        // Hide signup form and show login form
        document.getElementById('signup-form').setAttribute('class', 'hidden');
        document.getElementById("login-instead").setAttribute('class', 'hidden');
        document.getElementById('auth-form').setAttribute('class', 'visible');
        document.getElementById("signup-instead").setAttribute('class', 'visible');
        setErrorMessage('')
    }

    const login = async (event) => {
        // Login by checking email and password through database
        // Set error message if there is an issue
        event.preventDefault();

        const email = event.target[0].value;
        const password = event.target[1].value;

        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        if (response.ok) {
            window.location.replace('/');
        } else {
            console.error(response.statusText);
            setErrorMessage('Incorrect email and/or password.')
        }
    }

    const signup = async (event) => {
        // Signup for an account and set user details in database
        event.preventDefault();

        const name = event.target[0].value;
        const email = event.target[1].value;
        const location = event.target[2].value;
        const password = event.target[3].value;

        const zipcodeTest = new RegExp('^\\d{5}$');
        const zipcode = zipcodeTest.test(location);

        if (!zipcode) {
            setErrorMessage('Invalid zipcode.')
        } else {
            try {
                const response = await fetch('/api/users/createUser', {
                    method: 'POST',
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        location: location
                    }),
                    headers: { 'Content-Type': 'application/json' },
                })
                if (response.ok) {
                    window.location.replace('/');
                }
            } catch(err) {
                console.error(response.statusText);
                setErrorMessage('User already exists! Login instead.')
            }
        }
    }

    const loginDemo = async (event) => {
        // Login to demo dashboard
        event.preventDefault();

        const email = 'demo@example.com'
        const password = 'password12345';

        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        if (response.ok) {
            window.location.replace('/');
        } else {
            console.error(response.statusText);
            setErrorMessage('Something went wrong.')
        }
    }

    return (
        <div id="login" className={css`text-align: center; height: 70vh; margin: 0 auto;`}>
            <h1 className={css`margin: 30vh auto 0 auto;`}>Your goals, schedule & reminders, all in one place.</h1>
            <div id="authentication">

                <form id="auth-form" className="visible" onSubmit={login}>
                    <input type="text" placeholder="Email" required/>
                    <input type="password" placeholder="Password" required/>
                    <input type="submit" value="Login"/>
                </form>

                

                <form id="signup-form" className="hidden" onSubmit={signup}>
                    <input type="text" placeholder="Name" required/>
                    <input type="text" placeholder="Email" required/>
                    <input type="text" placeholder="Zipcode for Weather"/>
                    <input type="password" placeholder="Password" required/>
                    <input type="submit" value="Sign Up"/>
                </form>

                {errorMessage.length ? <p id="login-error">{errorMessage}</p> : null}

                <button id="signup-instead" className="visible" onClick={showSignup}>Sign Up Instead</button>

                <button id="login-instead" className="hidden" onClick={showLogin}>Log In Instead</button>
                

                <button id="demo" className={css`display: block; margin: 10px auto;`} onClick={loginDemo}>Demo Dashboard</button>
            </div>
            
            <a href="https://github.com/ramitaarora/mosaic-planner" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16" className={css`color: lightgrey; margin-top: 20px; cursor: pointer; &:hover {color: white;}`}>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
            </a>
        </div>
    )
}