import React from "react";

const Button = ({ name, type, handleClick, className, disabled }) => {
  return (
    <button
      type={type || "button"}
      className={`px-4 py-2 border rounded-md bg-blue-500 text-white ${className} ${
        disabled && "cursor-wait opacity-60"
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default Button;
