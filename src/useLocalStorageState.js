import { useEffect, useState } from "react";
// Hook for managing state that is synchronized with localStorage
// Usage: const [name, setName] = useLocalStorageState("Guest", "name");
export function useLocalStorageState(initialValue, key) {
  // Initialize state with value from localStorage or fallback to initialValue
  const [value, setValue] = useState(() => {
    // Get the stored value from localStorage using the provided key
    // getItem is used to retrieve the value associated with the specified key from localStorage.
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  // Update localStorage whenever the value or key changes
  //JSON.stringify is used to convert the value to a string before storing it in localStorage,
  // and JSON.parse is used to convert it back to its original form when retrieving it from localStorage.
  // This allows us to store complex data types like objects and arrays in localStorage, which only supports string values.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
