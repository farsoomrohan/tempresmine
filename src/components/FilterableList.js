import React, { useState, useEffect, useRef } from "react";
import FilterDropdown from "./FilterDropdown";

function FilterableList({
  defaultValue,
  filterOptions,
  filterKey,
  onFilterChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleFilterChange = (selectedFilter) => {
    onFilterChange(selectedFilter);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <FilterDropdown
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export default FilterableList;

// import React, { useState } from "react";
// import FilterDropdown from "./FilterDropdown";

// function FilterableList({ data, filterOptions, filterKey, onFilterChange }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const handleFilterChange = (selectedFilter) => {
//     onFilterChange(selectedFilter);
//   };

//   return (
//     <div>
//       <FilterDropdown
//         filterOptions={filterOptions}
//         onFilterChange={handleFilterChange}
//         setIsOpen={setIsOpen}
//         isOpen={isOpen}
//       />
//     </div>
//   );
// }

// export default FilterableList;
