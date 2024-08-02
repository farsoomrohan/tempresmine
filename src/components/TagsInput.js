import React, { useState } from "react";
import { techSkillsList } from "../utils/techSkillsList";
import { TextField } from "@material-ui/core";

const TagsInput = ({ label, tags, setTags, handleKeyDown }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };

  const addTags = () => {
    if (inputValue && inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length > 0) {
      // Filter suggestions based on input value
      const filtered = techSkillsList.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase()) && !tags.includes(suggestion)
      );
      if (filtered.length > 0) {
        setFilteredSuggestions(filtered.slice(0, 3)); // Show only the first 3 suggestions
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    } else {
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setTags([...tags, suggestion]);
    setInputValue("");
    setFilteredSuggestions([]);
    setShowDropdown(false);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <div className="col-span-2 relative">
      <div className="tags-input">
        {/* <label
          htmlFor={label}
          className="block mb-1 text-nmlText font-semibold text-gray-900"
        >
          {label}
        </label> */}
        <div id={label} className="flex flex-wrap items-center relative">
          <TextField
            label={label}
            InputProps={{
              style: {
                fontSize: "14px",
                fontFamily: "Quicksand, sans-serif",
                color: "#000929",
              },
            }}
            variant="outlined"
            size="small"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTags();
              }
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2 flex-grow"
          />
        </div>

        {showDropdown && (
          <ul className="suggestions border border-gray-300 rounded-lg absolute z-10 w-full bg-white">
            <span
              className="relative top-0 right-0 ml-2 text-[2rem] cursor-pointer text-gray-500 flex flex-end mr-2"
              onClick={closeDropdown}
            >
              &times;
            </span>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item py-2 px-3 cursor-pointer hover:bg-gray-100"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center relative mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="tag bg-textHeading text-white text-nmlText rounded-full px-3 py-[2px] flex items-center mb-2 mr-2 relative"
            >
              {tag}
              <span
                className="tag-close-icon ml-2 text-white cursor-pointer"
                onClick={() => removeTags(index)}
                style={{ fontSize: "1.5rem" }}
              >
                &times;
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsInput;
