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
    }

    const showLogin = () => {
        document.getElementById('signup-form').setAttribute('class', 'form-hidden');
        document.getElementById("login-instead").setAttribute('class', 'form-hidden');
        document.getElementById('auth-form').setAttribute('class', 'form-visible');
        document.getElementById("signup-instead").setAttribute('class', 'form-visible');
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
            window.location.replace('/dashboard');
        } else {
            console.error(response.statusText);
            document.getElementById('login-error').setAttribute('class', 'form-visible');
        }
    }

    const signup = (event) => {
        event.preventDefault();
        console.log(event);
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

                <form id="signup-form" className="form-hidden">
                    <input type="text" placeholder="Name"/>
                    <input type="text" placeholder="Email"/>
                    <input type="text" placeholder="City for Weather"/>
                    <input type="password" placeholder="Password"/>
                    <input type="submit" value="Sign Up"/>
                </form>

                <p id="login-instead" className="form-hidden" onClick={showLogin}>Click to login instead</p>
            </div>
        </div>
    )
}