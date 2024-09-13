import React from 'react';
import moment from 'moment';

function DatePicker({ sliderTime, onDateChange }) {
  const handleDateChange = (e) => {
    const selectedDate = moment(e.target.value);

    // Update only the date portion (keep time intact)
    const updatedTime = sliderTime.clone().set({
      year: selectedDate.year(),
      month: selectedDate.month(),
      date: selectedDate.date(),
    });
    
    onDateChange(updatedTime); // Reflect the updated time globally
  };

  return (
    <div className="mb-4">
      <label className="block -500 text-lg text-whitemb-2">Select Date:</label>
      <input
        type="date"
        onChange={handleDateChange}
        value={sliderTime.format('YYYY-MM-DD')}
        className="p-2 border rounded text-black"
      />
    </div>
  );
}

export default DatePicker;
