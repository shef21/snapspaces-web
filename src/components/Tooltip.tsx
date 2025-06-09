'use client';

import { useState, useRef } from 'react';

let tooltipIdCounter = 0;

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  // Use a stable, incrementing ID
  const idRef = useRef<string>(undefined);
  if (!idRef.current) {
    tooltipIdCounter += 1;
    idRef.current = `tooltip-${tooltipIdCounter}`;
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      aria-describedby={idRef.current}
    >
      {children}
      {visible && (
        <span
          id={idRef.current}
          role="tooltip"
          className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-yellow-200 text-[#171717] text-xs rounded-lg shadow-lg whitespace-nowrap font-medium"
          style={{ bottom: 'auto', top: '100%' }}
        >
          {text}
        </span>
      )}
    </span>
  );
} 