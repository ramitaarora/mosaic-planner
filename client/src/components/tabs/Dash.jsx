import { css } from '@emotion/css';

import Schedule from "../Schedule";
import TasksInProgress from "../TasksInProgress";
import Tasks from "../Tasks";
import DailyChecks from "../DailyChecks";
import Goals from "../Goals";
import Notes from "../Notes";

export default function Dash({ data, fullDate, timezone, today, getData }) {
    if (data && fullDate && timezone && today && getData) {
        try {
            return (
                <main className={css`display: flex; width: 99vw; min-height: 80vh;`}>
                    <section id="left" className={css`width: 30%; min-height: 100%;`}>
                        <Schedule data={data} fullDate={fullDate} timezone={timezone} today={today} getData={getData} />
                    </section>

                    <section id="middle" className={css`width: 40%; min-height: 100%;`}>
                        <TasksInProgress data={data} getData={getData} today={today} />
                        <Tasks data={data} getData={getData} />
                    </section>

                    <section id="right" className={css`width: 30%; min-height: 100%;`}>
                        <DailyChecks data={data} fullDate={fullDate} today={today} timezone={timezone} getData={getData} />
                        <Notes data={data} getData={getData} />
                    </section>
                </main>
            )
        }
        catch (error) {
            console.error(error);
        }
    }

}