import { useEffect, useState } from "react";

interface UseDebounceProps {
  value: string;
  delay: number;
}
const useDebounce = ({ value, delay }: UseDebounceProps) => {
  const [debounceValue, setDebounceValue] = useState<string>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value]);
  return { debounceValue };
};

export default useDebounce;
