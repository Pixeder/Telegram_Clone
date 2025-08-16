import { useId, forwardRef } from "react";

const Input = forwardRef(function Input({
  label,
  type = "text",
  className = '',
  ...props
}, ref) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="inline-block mb-1 pl-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full rounded-lg bg-gray-100 px-4 py-3 text-black outline-none border-2 border-transparent transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          ${className}`}
        ref={ref}
        id={id}
        {...props}
      />
    </div>
  );
});

export default Input;
