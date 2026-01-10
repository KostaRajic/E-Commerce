/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export const SearchComponent = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const debounced = useCallback(
    debounce((text) => {
      onSearch(text);
    }, 800),
    [onSearch]
  );

  useEffect(() => {
    debounced(value);
  }, [value]);

  const handleInputSearch = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  return (
    <div className="searchComponent">
      <FontAwesomeIcon className="searchIcon" icon={faMagnifyingGlass} />
      <input
        type="text"
        value={value}
        onChange={handleInputSearch}
        placeholder="Search product"

      />
    </div>
  );
};
