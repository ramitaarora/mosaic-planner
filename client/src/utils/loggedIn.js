export default async function loggedIn() {
    try {
        const response = await fetch('/api/home');
        if (response.ok) {
            return await response.json()
        }
    } catch(err) {
        console.error(err);
    }
}