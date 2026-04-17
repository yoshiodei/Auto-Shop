"use client";

import { useState, useCallback } from "react";

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  gap?: number; // enforced gap between min and max (default: 100)
  currency?: string;
  onChange?: (min: number, max: number) => void;
}

export default function PriceRangeSlider({
  min = 0,
  max = 10000,
  step = 100,
  gap = 100,
  currency = "$",
  onChange,
}: PriceRangeSliderProps) {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  const formatPrice = (val: number) =>
    `${currency}${val.toLocaleString()}`;

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(Number(e.target.value), maxVal - gap);
      setMinVal(value);
      onChange?.(value, maxVal);
    },
    [maxVal, gap, onChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(Number(e.target.value), minVal + gap);
      setMaxVal(value);
      onChange?.(minVal, value);
    },
    [minVal, gap, onChange]
  );

  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
        Vehicle Price Range
      </p>

      {/* Read-only display inputs */}
      <div className="space-y-6 mb-6">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-400">
            Price from
          </label>
          <input
            readOnly
            value={formatPrice(minVal)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-medium"
          />
        </div>

        {/* <div className="flex items-end pb-2">
          <span className="text-gray-300 font-light text-lg">—</span>
        </div> */}

        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-400">
            Price up to
          </label>
          <input
            readOnly
            value={formatPrice(maxVal)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-medium"
          />
        </div>
      </div>

      {/* Slider track */}
      <div className="relative h-2 w-full">
        {/* Base track */}
        <div className="absolute top-0 h-full w-full rounded-full bg-gray-200" />

        {/* Active range highlight */}
        <div
          className="absolute top-0 h-full rounded-full bg-[#FF6B7A]"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#FF6B7A]
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#FF6B7A]
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:shadow-md"
          style={{ zIndex: minVal > max - gap ? 5 : 3 }}
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-[#FF6B7A]
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-[#FF6B7A]
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:shadow-md"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Min / Max labels */}
      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  );
}