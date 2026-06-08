'use client';

import { useEffect, useState, useRef } from 'react';

interface SubscriptionToggleProps {
  billingCycle: 'gratis' | 'mensual' | 'anual';
  onChange: (cycle: 'gratis' | 'mensual' | 'anual') => void;
}

export function SubscriptionToggle({ billingCycle, onChange }: SubscriptionToggleProps) {
  const [prevCycle, setPrevCycle] = useState(billingCycle);
  const [isStretching, setIsStretching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (billingCycle !== prevCycle) {
      setIsStretching(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsStretching(false);
        setPrevCycle(billingCycle);
      }, 500);
    }
  }, [billingCycle, prevCycle]);

  const isPremium = billingCycle !== 'gratis';
  const direction = (billingCycle === 'gratis' ? 0 : 1) > (prevCycle === 'gratis' ? 0 : 1) 
    ? 'right' 
    : (billingCycle === 'gratis' ? 0 : 1) < (prevCycle === 'gratis' ? 0 : 1) ? 'left' : 'none';

  return (
    <div className="relative w-[340px] h-[64px] bg-white rounded-full p-1 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center overflow-hidden border border-gray-50">
      
      {/* Sliding Black Indicator */}
      <div 
        className="absolute h-[calc(100%-8px)] bg-slate-950 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-0"
        style={{
          width: isPremium ? '182px' : '150px',
          left: isPremium ? '154px' : '4px',
          transform: isStretching && direction !== 'none' 
            ? `scaleX(1.15) translateX(${direction === 'right' ? '10px' : '-10px'})` 
            : 'scaleX(1) translateX(0)',
          transformOrigin: direction === 'right' ? 'left center' : 'right center'
        }}
      >
        {/* White Active Pill (Only in Premium state) */}
        {isPremium && (
          <div 
            className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              width: '84px',
              left: billingCycle === 'mensual' ? '4px' : '94px',
            }}
          />
        )}
      </div>

      {/* Content Layout */}
      <div className="relative flex w-full h-full z-10 items-center">
        
        {/* Left Zone: Gratis */}
        <button
          onClick={() => onChange('gratis')}
          className={`w-[150px] h-full flex items-center justify-center transition-colors duration-500 ${
            !isPremium ? 'text-white' : 'text-gray-400 hover:text-gray-500'
          }`}
        >
          <span className="text-lg font-bold">Gratis</span>
        </button>

        {/* Right Zone: Premium Structure */}
        <div 
          className="flex-1 h-full flex flex-col items-center justify-center cursor-pointer"
          onClick={() => !isPremium && onChange('mensual')}
        >
          {!isPremium ? (
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-gray-800">Premium</span>
              <div className="flex gap-2 text-[10px] text-gray-400 font-medium tracking-tight">
                <span>Mensual</span>
                <span>Anual</span>
              </div>
            </div>
          ) : (
            <div className="flex w-full h-full relative p-1">
              <button
                onClick={(e) => { e.stopPropagation(); onChange('mensual'); }}
                className={`flex-1 h-full flex items-center justify-center transition-colors duration-400 font-semibold text-sm z-10 ${
                  billingCycle === 'mensual' ? 'text-black' : 'text-white'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onChange('anual'); }}
                className={`flex-1 h-full flex items-center justify-center transition-colors duration-400 font-semibold text-sm z-10 ${
                  billingCycle === 'anual' ? 'text-black' : 'text-white'
                }`}
              >
                Anual
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
