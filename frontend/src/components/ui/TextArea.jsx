import React, { forwardRef } from 'react';

const TextArea = forwardRef(({ label, error, className = '', id, rows = 3, ...props }, ref) => {
  const areaId = id || props.name;
  
  return (
    <div className={className}>
      {label && (
        <label htmlFor={areaId} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        ref={ref}
        rows={rows}
        className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ${
          error ? 'ring-red-300 focus:ring-red-500' : 'ring-slate-300 focus:ring-blue-500'
        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 shadow-sm`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

TextArea.displayName = 'TextArea';
export default TextArea;
