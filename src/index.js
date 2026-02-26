import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);

//   return (
//     <div>
//       {/* using the starRating and giving a props  color="blue" maxRating={8} onSetRating={setMovieRating} */}
//       {/* onSetRating is functiong that setMovieRating that updater of movieRating */}
//       <StarRating color="blue" maxRating={8} onSetRating={setMovieRating} />

//       <p>Rate: {movieRating}</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating />
    <StarRating
      color="blue"
      size={48}
      messages={["Bad", "Not Bad", "Good", "Very Good", "Superb"]}
      defaultRating={2}
    />
    <Test /> */}
  </React.StrictMode>,
);
