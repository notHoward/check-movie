/* 
  import means we are importing a module, and the default export from that module is what we are importing.
  We can import multiple named exports from a module using curly braces.
  We can also import a module without specifying what we want to import, which will execute the module but not give us access to any of its exports.
*/

import { useRef, useEffect, useState } from "react";
import StarRating from "./StarRating";
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

// A utility function to calculate the average of an array of numbers
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
// The API key for the OMDB API, which is used to fetch movie data
const KEY = "fe77cd3e";

// The main App component, which is the root of our application
export default function App() {
  /*  the three states for movies, loading and error are now handled by the useMovie custom hook, which abstracts away the logic for fetching movies and managing these states. */
  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");

  // the query state is used to store the user's search input, and the selectedId state is used to store the ID of the currently selected movie.
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // this state is used to store the list of movies that the user has watched, and it is persisted in local storage using the useLocalStorageState custom hook. This allows the user's watched movies to be saved even if they refresh the page or close and reopen the browser.
  //useLocalStorageState is the initial state of the watched movies, which is an empty array, and the key "watched" is used to store the data in local storage.
  // 'watched' holds the current state of the watched movies, and 'setWatched' is a function that can be used to update this state. When 'setWatched' is called, it will also update the local storage with the new value of 'watched'.
  const [watched, setWatched] = useLocalStorageState([], "watched");

  // const [watched, setWatched] = useState(() => {
  //   const storedValue = localStorage.getItem("watched");
  //   return storedValue ? JSON.parse(storedValue) : [];
  // });

  // the useMovie custom hook is called with the current query, and it returns the movies, loading state, and error state. This allows us to easily manage the movie data and related states in our component without having to write the logic for fetching movies and handling loading and error states directly in the App component.
  const { movies, isLoading, error } = useMovie(query);

  // This function is called when a movie is selected from the list. It updates the selectedId state with the ID of the selected movie. If the same movie is selected again, it will deselect it by setting selectedId to null.
  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  // This function is called when the user wants to close the movie details view. It sets the selectedId state to null, which will hide the movie details.
  function handleClose() {
    setSelectedId(null);
  }

  // This function is called when the user wants to add a movie to their watched list. It takes a movie object as an argument and updates the watched state by adding the new movie to the existing list of watched movies. The setWatched function is used to update the state, and it takes a callback function that receives the current state of watched movies and returns a new array with the new movie added to it.
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  // This function is called when the user wants to delete a movie from their watched list. It takes the ID of the movie to be deleted as an argument and updates the watched state by filtering out the movie with the specified ID. The setWatched function is used to update the state, and it takes a callback function that receives the current state of watched movies and returns a new array that includes only the movies that do not have the specified ID.
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // useEffect(() => {
  //   localStorage.setItem("watched", JSON.stringify(watched));
  // }, [watched]);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   async function fetchMovies() {
  //     try {
  //       setIsLoading(true);
  //       setError("");
  //       const res = await fetch(
  //         `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
  //         { signal: controller.signal },
  //       );
  //       if (!res.ok)
  //         throw new Error("Something went wrong with fetching movie");
  //       const data = await res.json();
  //       if (data.Response === "False") throw new Error("Movies not found");
  //       setMovies(data.Search);
  //     } catch (err) {
  //       console.error(err.message);

  //       if (err.name !== "AbortError") setError(err.message);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   if (query.length < 3) {
  //     setMovies([]);
  //     setError("");
  //     return;
  //   }

  //   fetchMovies();

  //   return function () {
  //     controller.abort();
  //   };
  // }, [query]);

  return (
    <>
      {/* The NavBar component is rendered at the top of the page, and it contains the Logo, Search, and NumResult components. */}
      <NavBar>
        {/* The Logo component displays the logo of the application, which is a popcorn emoji and the text "usePopcorn". */}
        <Logo />
        {/* The Search component is a search input field that allows the user to enter a query to search for movies. It takes the current query and the setQuery function as props, which are used to manage the state of the search input. */}
        <Search query={query} setQuery={setQuery} />
        {/* The NumResult component displays the number of movies found based on the current search query. It takes the movies array as a prop and calculates the number of results to display. */}
        <NumResult movies={movies} />
      </NavBar>

      {/* The Main component is rendered below the NavBar, and it contains two Box components. */}
      <Main>
        {/* The first Box component contains the movie list and related states. 
          It conditionally renders the Loader component if movies are being loaded, 
          the MovieList component if movies are successfully fetched without errors, 
          and the ErrorMessage component if there is an error in fetching movies. */}
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectedMovie} />
          )}

          {error && <ErrorMessage message={error} />}
        </Box>
        {/* The second Box component contains the movie details and the watched movies list. 
          It conditionally renders the MovieDetails component if a movie is selected, 
          and if no movie is selected, it renders the WatchedSummary and WatchedMoviesList components. */}
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onClose={handleClose}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDelete={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// The Loader component is a simple component that displays a loading spinner. It uses an SVG to create the spinner animation.
function Loader() {
  const spinner = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M11 2v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 18v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM4.223 5.637l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM15.533 16.947l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM2 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM18 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM5.637 19.777l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM16.947 8.467l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path>
    </svg>
  );

  return <div className="spinner">{spinner}</div>;
}

// The ErrorMessage component is a simple component that displays an error message. It takes a message prop and renders it inside a paragraph element with a class of "error". It also includes an emoji to visually indicate that an error has occurred.
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span>
      {message}
    </p>
  );
}

// The MovieDetails component is responsible for displaying the details of a selected movie.
// It takes several props, including the selectedId of the movie, onClose function to close the details view,
// onAddWatched function to add the movie to the watched list,
// and the watched array to check if the movie has already been watched.
// The component fetches the movie details from the OMDB API using the selectedId and displays various information about the movie,
// such as title, year, poster, runtime, plot, IMDb rating, release date, actors, director, and genre.
// It also allows the user to rate the movie and add it to their watched list if they haven't already done so.
function MovieDetails({ selectedId, onClose, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState([]);

  // useRef is used to create a mutable reference that persists across renders.
  // In this case, countRef is used to keep track of the number of times the user has rated the movie.
  // The useEffect hook is used to increment the countRef.current value whenever the userRating state changes and is not empty.
  // This allows us to keep track of how many times the user has rated the movie without causing unnecessary re-renders of the component.
  const countRef = useRef(0);

  //.current is a property of the ref object that holds the current value of the reference.
  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  //includes is used to check if the selected movie has already been watched by the user.
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  // find is used to search for the movie in the watched list that matches the selectedId and retrieves the userRating for that movie.
  // ? is used to handle the case where the movie is not found in the watched list, preventing an error from occurring when trying to access the userRating property of an undefined object. If the movie is not found, userWatchedRating will be undefined.
  const userWatchedRating = watched.find(
    (movie) => movie.imdbID === selectedId,
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    imdbRating,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handlAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRef: countRef.current,
    };

    // onAddWatched is a function passed as a prop to the MovieDetails component, and it is responsible for adding a new movie to the watched list.
    onAddWatched(newWatchedMovie);
    onClose();
  }

  // useKey is a custom hook that listens for a specific key press and executes a callback function when that key is pressed. In this case, it listens for the "Escape" key and calls the onClose function to close the movie details view when the "Escape" key is pressed.
  useKey("Escape", onClose);

  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (e.code === "Escape") {
  //         onClose();
  //       }
  //     }

  //     document.addEventListener("keydown", callback);

  //     return function () {
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [onClose],
  // );

  // This useEffect hook is responsible for fetching the details of the selected movie from the OMDB API whenever the selectedId changes.
  // It defines an asynchronous function getMovieDetails that makes a fetch request to the API using the selectedId to retrieve the movie details.
  // The fetched data is then stored in the movie state using setMovie.
  //  The isLoading state is used to indicate whether the movie details are currently being loaded,
  // and it is set to true before the fetch request and set back to false after the data is fetched and stored in the state.

  useEffect(
    function () {
      async function getMovieDetails() {
        // setIsLoading is used to indicate that the movie details are being fetched, and it is set to true before the fetch request is made.
        setIsLoading(true);
        // fetching the movie details from the OMDB API using the selectedId to construct the API URL.
        // The response is then converted to JSON format and stored in the data variable.
        // The fetched movie details are then stored in the movie state using setMovie,
        // and the isLoading state is set back to false to indicate that the loading process is complete.
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
        );
        const data = await res.json();
        setMovie(data);

        setIsLoading(false);
      }

      // The getMovieDetails function is called to fetch the movie details whenever the selectedId changes.
      getMovieDetails();
    },
    [selectedId],
  );

  // This useEffect hook is responsible for updating the document title to reflect the title of the currently selected movie.
  // It runs whenever the title of the movie changes. If there is no title (i.e., no movie is selected),
  // it returns early and does not update the document title. When a movie is selected, it sets the document title to "Movie | [movie title]".
  // Additionally, it includes a cleanup function that resets the document title back to "usePopCorn" when the component unmounts or when a different movie is selected.
  // The cleanup function also logs a message to the console indicating that it is cleaning up for the current movie title.
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopCorn";
        console.log(`Clean up for ${title}`);
      };
    },
    [title],
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>

              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {/* The component checks if the movie has already been watched by the user using the isWatched variable. If the movie has not been watched,
               it renders a StarRating component that allows the user to set their rating for the movie. 
               The onSetRating prop of the StarRating component is set to the setUserRating function, 
               which updates the userRating state when the user selects a rating. If the user has selected a rating greater than 0, 
               a button is displayed that allows them to add the movie to their watched list. When this button is clicked, the handlAdd function is called,
                which creates a new movie object with the relevant details and calls the onAddWatched function passed as a prop to add the movie to the watched list. 
                If the movie has already been watched, a message is displayed showing the user's previous rating for that movie. */}
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handlAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You already give {userWatchedRating}
                  <span>⭐</span> rating to this movie
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>

            <p>Starring: {actors}</p>
            <p>Directed by: {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

// The NavBar component is a simple functional component that renders a navigation bar. It takes children as a prop,
//  which allows it to render any child components passed to it within the nav element. The nav element has a class of "nav-bar
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
// The Logo component is a simple functional component that renders the logo of the application.
// It consists of a div with a class of "logo" that contains a popcorn emoji and an h1 element with the text "usePopcorn".
//  This component is used to display the branding of the application in the navigation bar.
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

// The Search component is a functional component that renders a search input field. It takes two props: query and setQuery.
// The query prop represents the current value of the search input, while the setQuery prop is a function that updates the query state in the parent component.
// The component uses the useRef hook to create a reference to the input element, allowing it to programmatically focus the input when certain conditions are met.

function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (document.activeElement === inputEl.current) return;
  //       if (e.code === "Enter" || e.code === "NumpadEnter") {
  //         inputEl.current.focus();
  //         setQuery("");
  //       }
  //     }

  //     document.addEventListener("keydown", callback);
  //     return function () {
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [setQuery],
  // );

  // The useKey custom hook is used to listen for the "Enter" key press, and when the "Enter" key is pressed, it checks if the input element is currently focused. If it is not focused, it focuses the input and clears the query state. This allows users to quickly access the search input by pressing "Enter" from anywhere in the application.
  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

// The NumResult component is a functional component that displays the number of movies found based on the current search query.
//  It takes the movies array as a prop and calculates the number of results to display. The component renders a paragraph element with a class of "num-results"
// that contains the text "Found [number] results", where [number] is the length of the movies array. The number of results is displayed in bold using the strong element.
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// The Main component is a simple functional component that renders a main element with a class of "main".
// It takes children as a prop, which allows it to render any child components passed to it within the main element.
// This component is used to wrap the main content of the application, providing a consistent layout and styling for the main section of the page.
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// The Box component is a functional component that renders a box with a toggle button to show or hide its children.
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// The MovieList component is a functional component that renders a list of movies. It takes two props: movies and onSelectedMovie.
// The movies prop is an array of movie objects that will be displayed in the list, while the onSelectedMovie prop is a function that will be called when a movie is selected from the list.
// The component maps over the movies array and renders a Movie component for each movie, passing the movie object, a unique key (movie.imdbID), and the onSelectedMovie function as props to each Movie component.
function MovieList({ movies, onSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectedMovie={onSelectedMovie}
        />
      ))}
    </ul>
  );
}

// The Movie component is a functional component that renders the details of a single movie in the list. It takes two props: movie and onSelectedMovie.
// The movie prop is an object that contains the details of the movie to be displayed, while the onSelectedMovie prop is a function that will be called when the movie is clicked.
// The component renders a list item (li) that displays the movie's poster, title, and year of release. When the list item is clicked, it calls the onSelectedMovie function with the movie's IMDb ID (movie.imdbID) as an argument, allowing the parent component to handle the selection of the movie and display its details.
function Movie({ movie, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// The WatchedSummary component is a functional component that renders a summary of the movies that the user has watched. It takes a single prop, watched, which is an array of movie objects representing the movies that the user has watched.
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

// The WatchedMoviesList component is a functional component that renders a list of movies that the user has watched. It takes two props: watched and onDelete.
// The watched prop is an array of movie objects representing the movies that the user has watched, while the onDelete prop is a function that will be called when a movie is deleted from the list.
// The component maps over the watched array and renders a WatchedMovie component for each movie, passing the movie object, a unique key (movie.imdbID), and the onDelete function as props to each WatchedMovie component.
function WatchedMoviesList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} onDelete={onDelete} key={movie.imdbID} />
      ))}
    </ul>
  );
}

// The WatchedMovie component is a functional component that renders the details of a single movie in the watched list. It takes two props: movie and onDelete.
// The movie prop is an object that contains the details of the movie to be displayed, while the onDelete prop is a function that will be called when the delete button is clicked.
// The component renders a list item (li) that displays the movie's poster, title, IMDb rating, user rating, and runtime. It also includes a delete button that, when clicked, calls the onDelete function with the movie's IMDb ID (movie.imdbID) as an argument, allowing the parent component to handle the deletion of the movie from the watched list.
function WatchedMovie({ movie, onDelete }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}
