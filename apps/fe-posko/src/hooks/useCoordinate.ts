/**
 * Created Date       : 31-03-2026
 * Description        : Hook untuk menangani logika pemformatan koordinat.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal custom hook.
 */
import { useState, ChangeEvent } from "react";
import { formatCoordinate } from "../utils/conversion/coordinateConversion";

/**
 * Custom hook untuk menangani logika form koordinat cerdas.
 * @param initialValue - Nilai string awal yang belum diformat.
 * @param type - Apakah ini koordinat Latitude atau Longitude.
 * @returns State dan event handler untuk input koordinat.
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
 * Mengupdate nilai state rawValue dengan nilai yang difilter
 * untuk hanya mengizinkan angka, minus (di awal), dan 1 titik desimal.
 * Nilai lainnya diabaikan.
 * @param {ChangeEvent<HTMLInputElement>} e - Event yang terjadi saat input berubah.
 */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (val === "" || val === "-" || val === ".") {
        setRawValue(val);
        return;
    }
    const match = val.replace(/[^\d.-]/g, "").match(/^-?\d*\.?\d*/);
    const cleanDigits = match ? match[0] : "";
    
    setRawValue(cleanDigits);
  };

  /**
   * Menangani state focus.
   * @returns void
   */
  const handleFocus = () => setIsFocused(true);

  /**
   * Menangani state blur.
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

