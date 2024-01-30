export default function Navigation({ visiblity, setVisibility }) {
    const logout = async () => {
        const response = await fetch('/api/users/logout', {
            method: 'POST',
        })
        if (response.ok) {
            window.location.replace('/login');
        } else {
            console.error(response.statusText);
        }
    }
    
    const openModal = () => {
        setVisibility('visible');
    }

    return (
        <div id="navigation">
            <ul>
                <li onClick={openModal}>Edit Profile</li>
                <li onClick={logout}>Logout</li>
            </ul>
        </div>
    )
}