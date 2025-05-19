import { css } from '@emotion/css';
import { Link } from 'react-router-dom';

export default function Index() {
    const loginDemo = async (event) => {
        // Login to demo dashboard
        event.preventDefault();

        const response = await fetch('/api/users/login-demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        if (response.ok) {
            window.location.replace('/dashboard');
        } else {
            console.error(response.statusText);
            setErrorMessage('Something went wrong.')
        }
    }

    return (
        <div className="landing">
            <header className={css`display: flex; justify-content: space-between; align-items: center; padding: 20px 10px; flex-wrap: wrap;`}>
                <h1 className={css`width: 70%;`}>The Progress Planner</h1>
                <nav className={css`width: 30%;`}>
                    <ul className={css`display: flex; justify-content: space-evenly; align-items: center; flex-wrap: wrap;`}>
                        <Link to="/dashboard"><li>Login</li></Link>
                        <li onClick={loginDemo}>Demo</li>
                        <a href="https://github.com/ramitaarora/mosaic-planner" target='_blank'><li>GitHub</li></a>
                    </ul>
                </nav>
            </header>

            <main>
                <section id="intro" className={css`display: flex; justify-content: space-evenly; align-content: center; margin: 50px auto;`}>
                    <div className={css`padding: 20px; display: flex; justify-content: center; flex-direction: column;`}>
                        <div className={css`margin: 10px auto; font-size: 24px;`}>
                            <h2>Let your planner</h2>
                            <h2>motivate you forward</h2>
                        </div>
                        <ul>
                            <li className={css`display: flex; align-content: center; margin: 10px auto;`}>
                                <img src="./landing-page-images/check-circle.svg" alt="check" className={css`margin: 0 10px;`}/>
                                <p>set your goals and steps towards achieving them</p>
                            </li>
                            <li className={css`display: flex; align-content: center; margin: 10px auto;`}>
                                <img src="./landing-page-images/check-circle.svg" alt="check" className={css`margin: 0 10px;`}/>
                                <p>set your tasks according to the steps</p>
                            </li>
                            <li className={css`display: flex; align-content: center; margin: 10px auto;`}>
                                <img src="./landing-page-images/check-circle.svg" alt="check" className={css`margin: 0 10px;`}/>
                                <p>cross off tasks and see your progress grow</p>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <img src="./landing-page-images/planning.png" alt="planner" className={css`height: 300px;`}/>
                    </div>
                </section>

                <div className={css`width: 80%; margin: 50px auto; text-align: center;`}>
                    <img src="./landing-page-images/line-divider.jpg" alt="divider" className={css`height: 30px;`}/>
                </div>

                <section id="features" className={css`text-align: center; margin: 50px auto;`}>
                    <h2>Stay Organized</h2>
                    <div className={css`display: flex; justify-content: space-evenly; align-content: center; margin: 10px auto;`}>
                        <div>
                            <img src="./landing-page-images/calendar.png" alt="schedule" className={css`height: 200px;`}/>
                            <p>have your schedule ready</p>
                        </div>
                        <div>
                            <img src="./landing-page-images/schedule.png" alt="schedule" className={css`height: 200px;`}/>
                            <p>cross off tasks as you complete them</p>
                        </div>
                        <div>
                            <img src="./landing-page-images/note-icon.png" alt="notes" className={css`height: 200px;`}/>
                            <p>your notes are visible at all times</p>
                        </div>
                    </div>
                </section>
{/*
                <div className={css`width: 80%; margin: 50px auto; text-align: center;`}>
                    <img src="./landing-page-images/line-divider.jpg" alt="divider" className={css`height: 30px;`}/>
                </div>

                <section id="progress" className={css`text-align: center; margin: 50px auto;`}>
                    <img src="" alt="checkboxes" />
                    <img src="" alt="progress-bar" />
                    <h2>See your progress towards your goals in real time</h2>
                    <p>When we can see the progress with each task, 
                    see how much closer we are to completing each step,
                    towards the overall goal, we feel motivated by the little things.</p>
                </section> */}
            </main>
        </div>
    )
}