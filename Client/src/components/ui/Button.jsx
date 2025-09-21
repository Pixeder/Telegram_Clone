import React from 'react';
import { motion } from 'motion/react';

function Button({
  children,
  type = 'button',
  bgColor = 'bg-blue-600',
  text = 'text-white',
  className = '',
  ...props
}) {
  return (
    <motion.button
      // Animation properties from framer-motion
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      // Base styling and props
      type={type}
      // Styling with dark mode classes. Note how default colors are now handled directly.
      className={`w-full rounded-lg px-4 py-2 text-base font-semibold shadow-sm transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-slate-800 ${bgColor} ${text} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
