import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

function FilterDropdown({
  filterOptions,
  onFilterChange,
  isOpen,
  setIsOpen,
  defaultValue,
}) {
  const [selectedFilter, setSelectedFilter] = useState(defaultValue);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="mr-2">
        <button
          onClick={handleToggle}
          className="inline-flex justify-center items-center w-auto rounded-lg border  shadow-xl py-2 px-3 h-10 bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none"
        >
          {selectedFilter}
          <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
        </button>
      </div>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-36 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {filterOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleFilterChange(option)}
              className="text-gray-900 cursor-default select-none relative py-1 pl-3  hover:bg-indigo-600 hover:text-white"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterDropdown;
