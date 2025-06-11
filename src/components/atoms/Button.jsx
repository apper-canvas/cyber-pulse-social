import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className, onClick, disabled, type = "button", whileHover, whileTap, ...props }) => {
  const Component = whileHover || whileTap ? motion.button : 'button';

  return (
    <Component
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;