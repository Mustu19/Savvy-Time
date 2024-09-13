import React, { useState } from 'react';
import moment from 'moment-timezone';

const allTimezones = moment.tz.names();

function TimezoneSearch({ onAddTimezone }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTimezones, setFilteredTimezones] = useState([]);
  const [visibleSuggestions, setVisibleSuggestions] = useState(5);

  const handleSearchChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchTerm(inputValue);

    if (inputValue.length > 0) {
      const filtered = allTimezones.filter((timezone) =>
        timezone.toLowerCase().includes(inputValue)
      );
      setFilteredTimezones(filtered);
      setVisibleSuggestions(5);
    } else {
      setFilteredTimezones([]);
    }
  };

  const handleShowMore = () => {
    setVisibleSuggestions((prev) => prev + 5);
  };

  const handleAddTimezone = (timezone) => {
    onAddTimezone(timezone);
    setSearchTerm('');
    setFilteredTimezones([]);
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search country/town and add timezone"
        className="p-2 border border-gray-300 rounded w-full"
      />

      {filteredTimezones.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-40 overflow-y-auto">
          {filteredTimezones.slice(0, visibleSuggestions).map((timezone, index) => (
            <li
              key={index}
              onClick={() => handleAddTimezone(timezone)}
              className="p-2 hover:bg-blue-200 cursor-pointer"
            >
              {timezone}
            </li>
          ))}
          {visibleSuggestions < filteredTimezones.length && (
            <li
              onClick={handleShowMore}
              className="p-2 text-center text-blue-500 cursor-pointer hover:bg-blue-100"
            >
              Show more...
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default TimezoneSearch;
