import { useState, useEffect } from "react";

const KEY = "fe77cd3e";
// Hook for fetching movies based on a search query
// Usage: const { movies, isLoading, error } = useMovie("Inception");
export function useMovie(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // useEffect is used to perform side effects in functional components, such as fetching data from an API.
  useEffect(() => {
    // Create an AbortController to allow us to cancel the fetch request if the component unmounts or if the query changes before the fetch completes.
    const controller = new AbortController();
    // Define an asynchronous function to fetch movies from the OMDB API based on the search query.
    async function fetchMovies() {
      // try-catch block is used to handle any errors that may occur during the fetch operation. 
      // If an error occurs, it will be caught and the error message will be set in the state.
      try {
        // Set isLoading to true before starting the fetch operation to indicate that the data is being loaded.
        // Clear any previous error messages before starting a new fetch operation.
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal },// signal controller.signal is used to associate the fetch request with the AbortController, allowing us to cancel the request if needed.
        );
        //.ok is a property of the Response object that indicates whether the HTTP status code of the response is in the successful range (200-299). 
        // If res.ok is false, it means that the fetch request was not successful, and we throw an error with a message indicating that something went wrong with fetching movies.
        if (!res.ok)
          //throw new Error("Something went wrong with fetching movie") is used to throw an error if the fetch request was not successful. Error() is a built-in JavaScript constructor that creates an error object with a specified message.
          throw new Error("Something went wrong with fetching movie");
        const data = await res.json();
        //Response is a property of the data object returned by the OMDB API that indicates whether the search was successful or not. 
        // If data.Response is "False", it means that no movies were found matching the search query, and we throw an error with a message indicating that movies were not found.
        if (data.Response === "False") throw new Error("Movies not found");
        //.Search is a property of the data object returned by the OMDB API that contains an array of movie objects matching the search query.
        setMovies(data.Search);
      } catch (err) {
        // err.message is used to access the message property of the error object, which contains a human-readable description of the error that occurred.
        console.error(err.message);
        //.name is a property of the error object that contains the name of the error type.
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        // finally block is used to execute code that should run regardless of whether an error occurred or not. In this case, we set isLoading to false after the fetch operation is complete, whether it was successful or resulted in an error.
        setIsLoading(false);
      }
    }

    // after defining the fetchMovies function, we check if the length of the search query is less than 3 characters. 
    // If it is, we clear the movies array and any error messages, and return early without making a fetch request. 
    // This is a common practice to avoid making unnecessary API calls for short or incomplete search queries.
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // If the search query is valid (3 or more characters), we call the fetchMovies function to initiate the fetch request to the OMDB API.
    fetchMovies();

    // Cleanup function to abort the fetch request if the component unmounts or if the query changes before the fetch completes.
    // The cleanup function is returned from the useEffect hook and will be called when the component unmounts or when the dependencies of the useEffect hook change (in this case, when the query changes).
    return function () {
      controller.abort();
    };
  }, [query]);


  // Finally, we return an object containing the movies array, the isLoading boolean, and the error message (if any) from the useMovie hook.
  return { movies, isLoading, error };
}
