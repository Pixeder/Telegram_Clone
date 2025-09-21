import { useId, forwardRef } from 'react';
import { motion } from 'motion/react';

const Input = forwardRef(function Input({ label, type = 'text', className = '', ...props }, ref) {
  const id = useId();
  return (
    <div className='w-full'>
      {label && (
        <label
          htmlFor={id}
          className='mb-1 inline-block pl-1 text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          {label}
        </label>
      )}
      <motion.input
        whileFocus={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        type={type}
        autoComplete='off'
        className={`w-full rounded-lg border-2 border-gray-200 bg-gray-100 px-4 py-2 text-gray-800 transition-colors duration-200 outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-sky-500 dark:focus:bg-slate-600 ${className}`}
        ref={ref}
        id={id}
        {...props}
      />
    </div>
  );
});

export default Input;
