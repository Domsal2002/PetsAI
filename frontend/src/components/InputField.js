import React from "react";

const InputField = ({ type, placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px" }}
  />
);

export default InputField;
