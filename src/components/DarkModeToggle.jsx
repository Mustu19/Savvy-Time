import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

function DarkModeToggle({ darkMode, onToggle }) {
  return (
    <button onClick={onToggle} className="p-2 rounded bg-gray-200 dark:bg-gray-800">
      {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-800" />}
    </button>
  );
}

export default DarkModeToggle;
