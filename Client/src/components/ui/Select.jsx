import React, { useId } from 'react';

function Select({ label, options = [], className = '', ...props }, ref) {
  const id = useId();

  return (
    <div className='w-full'>
      {label && (
        <label htmlFor={id} className='mb-1 inline-block pl-1 text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
      <select
        {...props}
        id={id}
        ref={ref}
        className={`w-full rounded-lg border-2 border-transparent bg-gray-100 px-4 py-3 text-black transition-all duration-200 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 ${className}`}
      >
        {options?.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
