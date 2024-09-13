import React, { useState } from 'react';
import DatePicker from './components/DatePicker';
import DarkModeToggle from './components/DarkModeToggle';
import TimezoneList from './components/TimeZoneList';
import moment from 'moment';

function App() {
  const [sliderTime, setSliderTime] = useState(moment());
  const [darkMode, setDarkMode] = useState(true);
  const [timezones, setTimezones] = useState(['Asia/Kolkata']);

  const handleDateChange = (newTime) => {
    setSliderTime(newTime);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const reverseTimezones = () => {
    setTimezones((prev) => [...prev].reverse());
  };

  const scheduleGoogleMeet = () => {
    const startTime = sliderTime.format("YYYYMMDDTHHmmss");
    const endTime = sliderTime.clone().add(2, 'hours').format("YYYYMMDDTHHmmss");

    const timezoneDetails = timezones.map((timezone) => {
      const timeInZone = sliderTime.clone().tz(timezone);
      return `${timezone}: ${timeInZone.format('hh:mm A')} ${timeInZone.format('ddd, MMM D YYYY')}`;
    }).join('\n');

    const details = `${timezoneDetails}\n\nScheduled with Savvy Time`;
    const encodedDetails = encodeURIComponent(details);

    const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?dates=${startTime}/${endTime}&text=Scheduled+Meet&details=${encodedDetails}&location=&sf=true&output=xml`;

    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className={`App ${darkMode ? 'dark bg-gray-900 text-gray-200' : 'light bg-white text-gray-800'} min-h-screen flex flex-col items-center justify-center p-4`}>

      {/* Heading: Savvy Time Converter */}
      <h1 className="text-4xl font-sans font-semibold uppercase text-center my-6">Savvy Time Zone</h1>

      {/* Top Row: Reverse Order, Dark Mode, Schedule Button, Select Date */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-6 p-4 bg-gray-400 dark:bg-gray-700 rounded-lg shadow-lg">
        <button
          onClick={reverseTimezones}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition mr-4"
        >
          Reverse Order
        </button>
        <DarkModeToggle darkMode={darkMode} onToggle={handleDarkModeToggle} />
        <DatePicker sliderTime={sliderTime} onDateChange={handleDateChange} />
        <button
          onClick={scheduleGoogleMeet}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition"
        >
          Schedule Meet
        </button>
      </div>

      

      {/* Bottom Row: Timezone List */}
      <div className="w-full max-w-4xl p-4 bg-gray-400 dark:bg-gray-700 rounded-lg shadow-lg">
        <TimezoneList
          sliderTime={sliderTime}
          setSliderTime={setSliderTime}
          timezones={timezones}
          setTimezones={setTimezones}
        />
      </div>
    </div>
  );
}

export default App;
