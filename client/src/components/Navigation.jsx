import { Link } from 'react-router-dom';

export default function Navigation() {
    const logout = async () => {
        const response = await fetch('/api/users/logout', {
            method: 'POST',
        })
        if (response.ok) {
            window.location.replace('/');
        } else {
            console.error(response.statusText);
        }
    }

    return (
        <div id="navigation">
            <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/profile">Setup</Link></li>
                <li onClick={logout}>Logout</li>
            </ul>
        </div>
    )
}