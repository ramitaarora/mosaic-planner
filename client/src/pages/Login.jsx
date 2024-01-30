import { useState, useEffect } from 'react';
import { css } from '@emotion/css'

export default function Login() {
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
        // console.log(event);
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
            document.getElementById('login-error').setAttribute('class', 'hidden');
            window.location.replace('/');
        } else {
            console.error(response.statusText);
            document.getElementById('login-error').setAttribute('class', 'visible');
        }
    }

    const signup = async (event) => {
        event.preventDefault();
        console.log(event);

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
            document.getElementById('login-error').setAttribute('class', 'hidden');
            window.location.replace('/');
        } else {
            console.error(response.statusText);
            document.getElementById('login-error').setAttribute('class', 'visible');
        }
    }

    return (
        <div id="login">
            <h1>Your goals, schedule & reminders, all in one place.</h1>
            <div id="authentication">

                <form id="auth-form" className="form-visible" onSubmit={login}>
                    <input type="text" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <input type="submit" value="Login"/>
                </form>
                <p id="login-error" className="hidden">Incorrect email and/or password.</p>
                
                <p id="signup-instead" className="visible" onClick={showSignup}>Click to sign up instead</p>

                <form id="signup-form" className="hidden" onSubmit={signup}>
                    <input type="text" placeholder="Name" required/>
                    <input type="text" placeholder="Email" required/>
                    <input type="text" placeholder="Location for Weather"/>
                    <input type="password" placeholder="Password" required/>
                    <input type="submit" value="Sign Up"/>
                </form>

                <p id="login-instead" className="hidden" onClick={showLogin}>Click to login instead</p>
            </div>
        </div>
    )
}