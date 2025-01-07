import { css } from '@emotion/css';

export default function Index() {
    return (
        <div className="landing">
            <header>
                <h1>Motivational Planner</h1>
                <nav>
                    <ul>
                        <li>Login</li>
                        <li>Demo</li>
                        <li>GitHub</li>
                    </ul>
                </nav>
            </header>

            <main>
                <section id="intro">
                    <div>
                        <h2>Let your planner motivate you forward</h2>
                        <ul>
                            <li>
                                <img src="" alt="check" />
                                <p>set your goals and steps towards achieving them</p>
                            </li>
                            <li>
                                <img src="" alt="check" />
                                <p>set your tasks according to the steps</p>
                            </li>
                            <li>
                                <img src="" alt="check" />
                                <p>cross off tasks and see your progress grow</p>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <img src="" alt="planner" />
                    </div>
                </section>

                <img src="" alt="divider" />

                <section id="features">
                    <img src="" alt="stay-organized" />
                    <div>
                        <div>
                            <img src="" alt="schedule" />
                            <p>have your schedule ready</p>
                        </div>
                        <div>
                            <img src="" alt="schedule" />
                            <p>cross off tasks as you complete them</p>
                        </div>
                        <div>
                            <img src="" alt="schedule" />
                            <p>your notes are visible at all times</p>
                        </div>
                    </div>
                </section>

                <img src="" alt="divider" />

                <section id="progress">
                    <img src="" alt="checkboxes" />
                    <img src="" alt="progress-bar" />
                    <h2>See your progress towards your goals in real time</h2>
                    <p>When we can see the progress with each task, 
                    see how much closer we are to completing each step,
                    towards the overall goal, we feel motivated by the little things.</p>
                </section>
            </main>
        </div>
    )
}