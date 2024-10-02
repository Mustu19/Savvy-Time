import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "./components/DatePicker.jsx";
import DarkModeToggle from "./components/DarkModeToggle.jsx";
import TimezoneList from "./components/TimeZoneList.jsx";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function App() {
  const [sliderTime, setSliderTime] = useState(moment());
  const [darkMode, setDarkMode] = useState(true);
  const [timezones, setTimezones] = useState([]);
  const [userTimezone, setUserTimezone] = useState("");
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const navigate = useNavigate();

  // Function to load timezones from local storage
  const loadTimezonesFromLocalStorage = useCallback(() => {
    const storedTimezones = JSON.parse(localStorage.getItem("timezones"));
    if (storedTimezones && storedTimezones.length > 0) {
      setTimezones(storedTimezones);
    } else {
      setDefaultTimezone();
    }
  }, []);

  // Store timezones in local storage whenever the timezones state changes
  useEffect(() => {
    if (timezones.length > 0) {
      localStorage.setItem("timezones", JSON.stringify(timezones));
    }
  }, [timezones]);

  // Load timezones from local storage on initial load
  useEffect(() => {
    loadTimezonesFromLocalStorage();
  }, [loadTimezonesFromLocalStorage]);

  // Load history and future from local storage on initial load
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
    const storedFuture = JSON.parse(localStorage.getItem("future")) || [];
    setHistory(storedHistory);
    setFuture(storedFuture);
  }, []);

  const setDefaultTimezone = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const timezone = moment.tz.guess(); // Use guessed timezone from moment.js
          setUserTimezone(timezone);

          // Set default timezone only if local storage is empty
          if (timezones.length === 0) {
            setTimezones([timezone]);
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
          const fallbackTimezone = moment.tz.guess(); // Fallback to guessed timezone
          setUserTimezone(fallbackTimezone);

          // Set fallback timezone only if local storage is empty
          if (timezones.length === 0) {
            setTimezones([fallbackTimezone]);
          }
        }
      );
    } else {
      // Fallback if geolocation is not available
      const fallbackTimezone = moment.tz.guess();
      setUserTimezone(fallbackTimezone);

      // Set fallback timezone only if local storage is empty
      if (timezones.length === 0) {
        setTimezones([fallbackTimezone]);
      }
    }
  };

  const checkDarkModeTime = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour < 6; // Dark mode between 6 PM and 6 AM
  };

  // Set dark mode automatically based on the user's current time
  useEffect(() => {
    const isNightTime = checkDarkModeTime();
    setDarkMode(isNightTime);
  }, []);

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
    const endTime = sliderTime
      .clone()
      .add(2, "hours")
      .format("YYYYMMDDTHHmmss");

    const timezoneDetails = timezones
      .map((timezone) => {
        const timeInZone = sliderTime.clone().tz(timezone);
        return `${timezone}: ${timeInZone.format(
          "hh:mm A"
        )} ${timeInZone.format("ddd, MMM D YYYY")}`;
      })
      .join("\n");

    const details = `${timezoneDetails}\n\nScheduled with Savvy Time`;
    const encodedDetails = encodeURIComponent(details);

    const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?dates=${startTime}/${endTime}&text=Scheduled+Meet&details=${encodedDetails}&location=&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
  };

  const handleShareLinkClick = () => {
    const currentUrl = `${window.location.origin}`;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("URL copied to clipboard: " + currentUrl);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  // Function to update timezones and manage history
  const updateTimezones = (newTimezones) => {
    setHistory((prev) => [...prev, timezones]); // Store the current state in history
    setFuture([]); // Clear future states
    setTimezones(newTimezones);

    // Save history and future to local storage
    localStorage.setItem("history", JSON.stringify([...history, timezones]));
    localStorage.setItem("future", JSON.stringify([]));
  };

  // Function to undo the last change
  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setFuture((prev) => [timezones, ...prev]); // Store the current state in future
      setTimezones(lastState); // Restore the last state
      setHistory((prev) => prev.slice(0, -1)); // Remove last state from history

      // Save updated history and future to local storage
      localStorage.setItem("history", JSON.stringify(history.slice(0, -1)));
      localStorage.setItem("future", JSON.stringify([timezones, ...future]));
    }
  };

  // Function to redo the last undone change
  const handleRedo = () => {
    if (future.length > 0) {
      const nextState = future[0];
      setHistory((prev) => [...prev, timezones]); // Store the current state in history
      setTimezones(nextState); // Restore the next state
      setFuture((prev) => prev.slice(1)); // Remove the restored state from future

      // Save updated history and future to local storage
      localStorage.setItem("history", JSON.stringify([...history, timezones]));
      localStorage.setItem("future", JSON.stringify(future.slice(1)));
    }
  };

  return (
    <div
      className={`App ${
        darkMode
          ? "dark bg-gray-900 text-gray-200"
          : "light bg-white text-gray-800"
      } min-h-screen flex flex-col items-center justify-between p-4`}
    >
      <h1 className="text-4xl font-sans font-semibold uppercase text-center my-6 italic">
        Savvy Time Zone
      </h1>

      <div className="flex items-center justify-between w-full max-w-4xl mb-6 p-4 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg">
        <button
          onClick={reverseTimezones}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition mr-4"
        >
          Reverse Order
        </button>
        <button
          onClick={handleUndo}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition mr-4"
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition"
        >
          Redo
        </button>
        <DarkModeToggle darkMode={darkMode} onToggle={handleDarkModeToggle} />
        <DatePicker sliderTime={sliderTime} onDateChange={handleDateChange} />
        <button
          onClick={scheduleGoogleMeet}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition"
        >
          Schedule Meet
        </button>
        <button
          onClick={handleShareLinkClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition ml-4"
        >
          Share Link
        </button>
      </div>

      <div className="w-full max-w-4xl p-4 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg mb-16">
        <TimezoneList
          sliderTime={sliderTime}
          setSliderTime={setSliderTime}
          timezones={timezones}
          setTimezones={updateTimezones} // Use the updated function
        />
      </div>

      <footer className="w-full max-w-4xl p-4 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg mb-16">
        <p className="mb-2 text-center">Made by Mustafa Kapasi</p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://www.linkedin.com/in/mustafakapasi19"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Mustu19"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://linktr.ee/mustafakapasi19"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Linktree
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
