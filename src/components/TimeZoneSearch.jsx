import React, { useState, useMemo } from 'react';
import moment from 'moment-timezone';

const allTimezones = moment.tz.names();

function TimezoneSearch({ onAddTimezone }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleSuggestions, setVisibleSuggestions] = useState(5);

  const filteredTimezones = useMemo(() => {
    if (searchTerm.length === 0) return [];
    return allTimezones.filter((timezone) =>
      timezone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setVisibleSuggestions(5);
  };

  const handleShowMore = () => {
    setVisibleSuggestions((prev) => prev + 5);
  };

  const handleAddTimezone = (timezone) => {
    onAddTimezone(timezone);
    setSearchTerm('');
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search Timezone..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 rounded"
      />
      <ul className="mt-2 border rounded bg-white shadow">
        {filteredTimezones.slice(0, visibleSuggestions).map((timezone) => (
          <li
            key={timezone}
            onClick={() => handleAddTimezone(timezone)}
            className="cursor-pointer hover:bg-gray-200 p-2"
          >
            {timezone}
          </li>
        ))}
        {visibleSuggestions < filteredTimezones.length && (
          <li
            onClick={handleShowMore}
            className="cursor-pointer hover:bg-gray-200 p-2 text-center"
          >
            Show more...
          </li>
        )}
      </ul>
    </div>
  );
}

export default TimezoneSearch;
