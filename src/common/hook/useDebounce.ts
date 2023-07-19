import { useEffect, useState } from "react";

interface UseDebounceProps {
  value: string;
  delay: number;
}
const useDebounce = ({ value, delay }: UseDebounceProps) => {
  const [debounceValue, setDebounceValue] = useState<string>(value);
  const [debouncing, setDebouncing] = useState<boolean>(false);

  useEffect(() => {
    setDebouncing(true);
    const timer = setTimeout(() => {
      setDebounceValue(value);
      setDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value]);
  return { debounceValue, debouncing };
};

export default useDebounce;
