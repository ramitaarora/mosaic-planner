import { useState, useEffect } from 'react';

export default function Landing() {
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

    return (
        <div id="landing">
            <h1>Your goals, schedule & reminders, all in one place.</h1>
            <div id="authentication">

                <form id="auth-form" className="form-visible">
                    <input type="text" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <input type="submit" value="Login"/>
                </form>
                
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