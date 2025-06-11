import React from 'react';

const Input = ({ as = 'input', className, value, onChange, placeholder, rows, maxLength, type = 'text', onKeyPress, inputRef, ...props }) => {
  const Component = as; // 'input' or 'textarea'

  return (
    <Component
      ref={inputRef}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      type={type}
      onKeyPress={onKeyPress}
      {...props}
    />
  );
};

export default Input;