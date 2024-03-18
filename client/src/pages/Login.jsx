import { useState, useEffect } from 'react';
import { css } from '@emotion/css'

export default function Login() {
    const [errorMessage, setErrorMessage] = useState(''); 

    useEffect(() => {
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
        document.getElementById('signup-form').setAttribute('class', 'visible');
        document.getElementById("login-instead").setAttribute('class', 'visible');
        document.getElementById('auth-form').setAttribute('class', 'hidden');
        document.getElementById("signup-instead").setAttribute('class', 'hidden');
        document.getElementById('login-error').setAttribute('class', 'hidden');
    }

    const showLogin = () => {
        document.getElementById('signup-form').setAttribute('class', 'hidden');
        document.getElementById("login-instead").setAttribute('class', 'hidden');
        document.getElementById('auth-form').setAttribute('class', 'visible');
        document.getElementById("signup-instead").setAttribute('class', 'visible');
        document.getElementById('login-error').setAttribute('class', 'hidden');
    }

    const login = async (event) => {
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
        event.preventDefault();

        const name = event.target[0].value;
        const email = event.target[1].value;
        const location = event.target[2].value;
        const password = event.target[3].value;

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
        } else {
            console.error(response.statusText);
            setErrorMessage('User already exists!')
        }
    }

    const loginDemo = async (event) => {
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
        <div id="login" className={css`text-align: center; height: 100vh; margin: 0 auto;`}>
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
                    <input type="text" placeholder="Location for Weather"/>
                    <input type="password" placeholder="Password" required/>
                    <input type="submit" value="Sign Up"/>
                </form>

                {errorMessage.length ? <p id="login-error">{errorMessage}</p> : null}

                <button id="signup-instead" className="visible" onClick={showSignup}>Sign Up Instead</button>

                <button id="login-instead" className="hidden" onClick={showLogin}>Log In Instead</button>
                

                <button id="demo" className={css`display: block; margin: 10px auto;`} onClick={loginDemo}>Demo Dashboard</button>
            </div>
        </div>
    )
}