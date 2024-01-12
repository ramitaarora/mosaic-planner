import { useState, useEffect } from 'react';

export default function Landing() {
    useEffect(() => {
        fetch('api/home/', {
            method: 'GET',
            credentials: 'include' 
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // console.log(response);
            return response.json();
        })
        .then((data) => {
            if (data.loggedIn) {
                window.location.replace('/dashboard');
            }
        })
        .catch((error) => {
            console.error(error)
        });
    }, [])

    const showSignup = () => {
        document.getElementById('signup-form').setAttribute('class', 'form-visible');
        document.getElementById("login-instead").setAttribute('class', 'form-visible');
        document.getElementById('auth-form').setAttribute('class', 'form-hidden');
        document.getElementById("signup-instead").setAttribute('class', 'form-hidden');
        document.getElementById('login-error').setAttribute('class', 'form-hidden');
    }

    const showLogin = () => {
        document.getElementById('signup-form').setAttribute('class', 'form-hidden');
        document.getElementById("login-instead").setAttribute('class', 'form-hidden');
        document.getElementById('auth-form').setAttribute('class', 'form-visible');
        document.getElementById("signup-instead").setAttribute('class', 'form-visible');
        document.getElementById('login-error').setAttribute('class', 'form-hidden');
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
            document.getElementById('login-error').setAttribute('class', 'form-hidden');
            window.location.replace('/dashboard');
        } else {
            console.error(response.statusText);
            document.getElementById('login-error').setAttribute('class', 'form-visible');
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
            document.getElementById('login-error').setAttribute('class', 'form-hidden');
            // window.location.replace('/dashboard');
        } else {
            console.error(response.statusText);
            document.getElementById('login-error').setAttribute('class', 'form-visible');
        }
    }

    return (
        <div id="landing">
            <h1>Your goals, schedule & reminders, all in one place.</h1>
            <div id="authentication">

                <form id="auth-form" className="form-visible" onSubmit={login}>
                    <input type="text" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <input type="submit" value="Login"/>
                </form>
                <p id="login-error" className="form-hidden">Incorrect email and/or password.</p>
                
                <p id="signup-instead" className="form-visible" onClick={showSignup}>Click to sign up instead</p>

                <form id="signup-form" className="form-hidden" onSubmit={signup}>
                    <input type="text" placeholder="Name" required/>
                    <input type="text" placeholder="Email" required/>
                    <input type="text" placeholder="Location for Weather"/>
                    <input type="password" placeholder="Password" required/>
                    <input type="submit" value="Sign Up"/>
                </form>

                <p id="login-instead" className="form-hidden" onClick={showLogin}>Click to login instead</p>
            </div>
        </div>
    )
}