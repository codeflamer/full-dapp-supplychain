import React from "react";

const Button = ({ name, type, handleClick }) => {
  return (
    <button
      type={type || "button"}
      className="px-4 py-2 rounded-sm bg-red-500 text-white"
      onClick={handleClick}
    >
      {name}
    </button>
  );
};

export default Button;
