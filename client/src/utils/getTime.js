export default function getTime(timezone) {
    const date = new Date();

    const timeZoneTime = new Intl.DateTimeFormat('en-US', {
      timeStyle: 'short',
      timeZone: timezone,
    }).format(date);
    const timeZoneHour = new Intl.DateTimeFormat('en-US', {
      timeStyle: 'short',
      timeZone: timezone,
      hourCycle: "h24"
    }).format(date);

    return { timeZoneTime: timeZoneTime, timeZoneHour: timeZoneHour };
}