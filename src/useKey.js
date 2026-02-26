import { useEffect } from "react";

/// Hook for handling key presses
// Usage: useKey("Enter", () => console.log("Enter key pressed"));
export function useKey(key, action) {
  // Add event listener for keydown when the component mounts and remove it when the component unmounts
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }

      // Add event listener for keydown then call the callback function when the specified key is pressed
      document.addEventListener("keydown", callback);

      // Cleanup function to remove the event listener when the component unmounts
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [key, action],
  );
}
