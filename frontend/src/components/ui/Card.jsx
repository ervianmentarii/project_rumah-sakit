import React from 'react';

export default function Card({ title, children, className = '', bodyClassName = 'p-6' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
      )}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
}
