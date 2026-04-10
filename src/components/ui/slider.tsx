import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> & {
    value?: number[];
    defaultValue?: number[];
    onValueChange?: (value: number[]) => void;
  }
>(({ className, min = 0, max = 100, step = 1, value, defaultValue, onValueChange, ...props }, ref) => {
  const initialValue = value?.[0] ?? defaultValue?.[0] ?? Number(min);
  const [internalValue, setInternalValue] = React.useState(initialValue);

  const displayValue = value?.[0] ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInternalValue(val);
    onValueChange?.([val]);
  };

  const percentage = Math.min(100, Math.max(0, ((displayValue - Number(min)) / (Number(max) - Number(min))) * 100));

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center group", className)}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onChange={handleChange}
        className="
          absolute z-20 w-full h-full opacity-0 cursor-pointer
        "
        {...props as any}
      />
      <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-white transition-all duration-75" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div 
        className="absolute z-10 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none transition-transform group-hover:scale-125"
        style={{ left: `calc(${percentage}% - 6px)` }}
      />
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider }
