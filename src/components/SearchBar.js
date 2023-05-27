import React from "react";

const SearchBar = ({ searchValue, setSearchValue, handleSearch }) => {
  return (
    <div className="max-w-[300px] border flex border-black rounded-r-md">
      <input
        className=" text-[20px] px-[10px] flex-1 outline-none "
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <span
        className="hover:cursor-pointer text-[20px] px-[10px] border-black border bg-gray-100 rounded-md"
        onClick={handleSearch}
      >
        S
      </span>
    </div>
  );
};

export default SearchBar;
