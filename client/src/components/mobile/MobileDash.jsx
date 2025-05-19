import { useState } from 'react';

import Header from "../Header"
// Mobile Components
import MobileNav from "./MobileNav";
import MobileCard from "./MobileCard";
import MobileWeather from "./MobileWeather";
import MobileProfileForm from "./MobileProfileForm";
// Components
import TasksInProgress from '../TasksInProgress';
import Tasks from '../Tasks';
import DailyChecks from '../DailyChecks';
import Schedule from '../Schedule';
import Notes from '../Notes';
import Goals from '../Goals';

export default function MobileDash({ data, getData, today, fullDate, timezone, location, temperature }) {
    // Mobile navigation
    const [mobileCard, setMobileCard] = useState();

    const navigate = (id) => {
    // Navigate between mobile cards
    setMobileCard(id.split('-')[1]);
  }

    return (
       <div>
            <div id="mobile-component">
              {mobileCard === '' || mobileCard === 'home' || !mobileCard ? (
                <MobileCard navigate={navigate} />
              ) : null}
              {mobileCard === 'tasks' ? (
                <div>
                  <TasksInProgress data={data} getData={getData} today={today} />
                  <Tasks data={data} getData={getData} />
                </div>
              ) : null}
              {mobileCard === 'checks' ? (
                <div>
                  <DailyChecks data={data} fullDate={fullDate} today={today} timezone={timezone} getData={getData} />
                </div>
              ) : null}
              {mobileCard === 'schedule' ? (
                <div>
                  <Schedule data={data} fullDate={fullDate} timezone={timezone} today={today} getData={getData} />
                </div>
              ) : null}
              {mobileCard === 'goals' ? (
                <div>
                  <Goals data={data} goalType="Weekly" getData={getData} />
                  <Goals data={data} goalType="Monthly" getData={getData} />
                  <Goals data={data} goalType="Yearly" getData={getData} />
                </div>
              ) : null}
              {mobileCard === 'notes' ? (
                <div>
                  <Notes data={data} getData={getData} />
                </div>
              ) : null}
              {mobileCard === 'weather' ? (
                <div>
                  <MobileWeather location={location} temperature={temperature} />
                </div>
              ) : null}
            </div>
            <MobileNav navigate={navigate} />
        </div>
    )
}