export default function getDateTimezone(timezone) {
    const date = new Date();

    const timeZoneDate = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeZone: timezone,
    }).format(date);
    const timeZoneTime = new Intl.DateTimeFormat('en-US', {
      timeStyle: 'short',
      timeZone: timezone,
    }).format(date);
    const timeZoneHour = new Intl.DateTimeFormat('en-US', {
      timeStyle: 'short',
      timeZone: timezone,
      hourCycle: "h24"
    }).format(date);

    const year = new Date(timeZoneDate).getFullYear();
    const month = new Date(timeZoneDate).getMonth() + 1;
    const day = new Date(timeZoneDate).getDate();

    return { year, month, day, timeZoneDate, timeZoneTime, timeZoneHour };
}