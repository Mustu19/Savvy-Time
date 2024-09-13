import moment from 'moment-timezone';
import { useState, useEffect } from 'react';

function Slider({ sliderTime, setSliderTime, timezone }) {
  const [typedTime, setTypedTime] = useState(sliderTime.format('hh:mm A'));
  const [suggestions, setSuggestions] = useState([]); // Initially, no suggestions
  const [isValidTime, setIsValidTime] = useState(true); // Track if the input is valid

  // Sync typedTime with the updated global sliderTime whenever it changes
  useEffect(() => {
    setTypedTime(sliderTime.format('hh:mm A'));
  }, [sliderTime]);

  // Generate all possible time options in 12-hour format with AM/PM and 30-minute intervals
  const generateDropdownOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) { // 30-minute intervals
        const time = moment().utc().startOf('day').hours(h).minutes(m);
        options.push(time.format('hh:mm A')); // 12-hour format with AM/PM
      }
    }
    return options;
  };

  // Handle time change from the slider in 15-minute intervals
  const handleSliderChange = (e) => {
    const sliderValue = Math.min(e.target.value, 96); // Clamp to prevent exceeding 96 (24 hours)
    const newTime = sliderTime.clone().startOf('day').add(sliderValue * 15, 'minutes');

    // Ensure the new time is within the current day
    if (newTime.isSame(sliderTime.clone().startOf('day'), 'day')) {
      setSliderTime(newTime); // Update the global slider time without changing the date
    }
  };

  // Handle input change (typed value)
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setTypedTime(inputValue); // Allow free typing, even invalid times

    // Check for partial match with valid time options for suggestions
    const filteredSuggestions = generateDropdownOptions().filter((option) =>
      option.startsWith(inputValue)
    );
    setSuggestions(filteredSuggestions);
  };

  // Validate the time format after the user finishes typing (on blur or Enter)
  const handleInputBlur = () => {
    if (moment(typedTime, 'hh:mm A', true).isValid()) {
      const newTime = sliderTime.clone().set({
        hour: moment(typedTime, 'hh:mm A').hour(),
        minute: moment(typedTime, 'hh:mm A').minute(),
      });
      setSliderTime(newTime);
      setIsValidTime(true);
    } else {
      setIsValidTime(false);
    }

    // Hide suggestions when input loses focus
    setTimeout(() => {
      setSuggestions([]);
    }, 100); // Delay clearing to allow click on suggestion
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setTypedTime(suggestion); // Update input field with clicked suggestion
    setSuggestions([]); // Clear suggestions
    const newTime = sliderTime.clone().set({
      hour: moment(suggestion, 'hh:mm A').hour(),
      minute: moment(suggestion, 'hh:mm A').minute(),
    });
    setSliderTime(newTime);
  };

  // Show suggestions only when the input is focused
  const handleInputFocus = () => {
    setSuggestions(generateDropdownOptions()); // Populate suggestions on focus
  };

  // Handle Enter key press for validating time
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur(); // Validate and set the time on Enter press
    }
  };

  return (
    <div className="relative mb-6">
      {/* Label for Timezone */}
      <label className="block text-sm font-semibold text-blue-theme-dark mb-1">
        {timezone}
      </label>

      {/* Typable Input for Time */}
      <input
        type="text"
        value={typedTime}
        onChange={handleInputChange}
        onFocus={handleInputFocus} // Show suggestions when input is focused
        onBlur={handleInputBlur} // Validate time when input loses focus
        onKeyPress={handleKeyPress} // Validate time on Enter press
        placeholder="Enter time (hh:mm AM/PM)"
        className={`p-2 text-sm border ${isValidTime ? 'border-blue-400' : 'border-red-500'} rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-32 overflow-y-auto shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 text-sm hover:bg-blue-100 cursor-pointer transition-colors"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* Time Slider for 15-minute intervals */}
      <input
        type="range"
        min="0"
        max="96" // 96 intervals for 15-minute steps
        value={Math.floor(sliderTime.hours() * 4 + sliderTime.minutes() / 15)} // Convert current time to 15-minute interval
        onChange={handleSliderChange}
        className="mt-2 w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
      />

      {/* Display selected date and time */}
      <div className="text-xs text-center mt-2 text-gray-600">
        <span>Selected Time: {sliderTime.format('hh:mm A - MMM D, YYYY')}</span>
      </div>
    </div>
  );
}

export default Slider;
