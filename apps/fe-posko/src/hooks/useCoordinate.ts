/**
 * Created Date       : 31-03-2026
 * Description        : Hook for handling coordinate formatting logic.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Initial custom hook.
 */
import { useState, ChangeEvent } from "react";
import { formatCoordinate } from "../utils/conversion/coordinateConversion";

/**
 * Custom hook to handle smart coordinate form logic.
 * @param initialValue - The initial unformatted string value.
 * @param type - Whether this is a Latitude or Longitude coordinate.
 * @returns State and event handlers for the coordinate input.
 */
export const useCoordinate = (initialValue: string, type: "LAT" | "LNG") => {
  const [rawValue, setRawValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const displayValue = isFocused ? rawValue : (() => {
      if (!rawValue || rawValue === "-" || rawValue === ".") return rawValue;
      const num = parseFloat(rawValue);
      if (isNaN(num)) return rawValue;
      
      const formatted = type === "LAT" 
         ? formatCoordinate(rawValue, 0).split(",")[0].trim() 
         : formatCoordinate(0, rawValue).split(",")[1].trim();
      return formatted !== "-" ? formatted : rawValue;
  })();

  /**
   * Handles text change events.
   * @param e - React Change Event.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (val === "" || val === "-" || val === ".") {
        setRawValue(val);
        return;
    }
    
    // Hanya izinkan angka, minus (di awal), dan 1 titik desimal
    const match = val.replace(/[^\d.-]/g, "").match(/^-?\d*\.?\d*/);
    const cleanDigits = match ? match[0] : "";
    
    setRawValue(cleanDigits);
  };

  /**
   * Handles focus state.
   * @returns void
   */
  const handleFocus = () => setIsFocused(true);

  /**
   * Handles blur state.
   * @returns void
   */
  const handleBlur = () => setIsFocused(false);

  return {
    value: displayValue,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur
  };
};

