import React from "react";

const CustomInput = ({ type, name, value, maxLength, onChange }) => {
  const handleInputChange = (event) => {
    let value = event.target.value;

    if (maxLength && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    value = value.charAt(0).toUpperCase() + value.slice(1);

    onChange(name, value);
  };

  return (
    <input type={type} name={name} value={value} onChange={handleInputChange} />
  );
};

export default CustomInput;
