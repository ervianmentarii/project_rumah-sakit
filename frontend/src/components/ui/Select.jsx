import React, { forwardRef } from 'react';

const Select = forwardRef(({ label, options = [], error, className = '', id, ...props }, ref) => {
  const selectId = id || props.name;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ${
          error ? 'ring-red-300 focus:ring-red-500' : 'ring-slate-300 focus:ring-blue-500'
        } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-white shadow-sm`}
        {...props}
      >
        <option value="" disabled hidden>Pilih {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
