import { css } from '@emotion/css';

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
        <div id="navigation" className={css`width: 33%; display: flex; align-items: center; justify-content: flex-end;`}>
            <ul className={css`display: flex; justify-content: space-evenly; justify-items: space-evenly; width: 50%; &:hover {cursor: pointer;}`}>
                <li onClick={openModal}>Edit Profile</li>
                <li onClick={logout}>Logout</li>
            </ul>
        </div>
    )
}