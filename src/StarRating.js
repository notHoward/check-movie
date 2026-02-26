// Star Rating Component - displays interactive star ratings with hover preview

import { useState } from "react";

// Flex container styling for rating display
const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

// Flex container for star elements
const starContainerStyle = {
  display: "flex",
  gap: "4px",
};

// StarRating component - accepts props for customization
export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 32,
  messages = [],
  defaultRating = 0,
  // Callback function to communicate selected rating to parent component
  onSetRating,
}) {
  // State: rating is the confirmed selection, tempRating shows hover preview
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  // Dynamic text styling based on props
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size}px`,
  };

  // Updates rating and notifies parent component via callback
  function handleRate(rating) {
    setRating(rating);
    // Call parent's callback to propagate the rating value
    if (onSetRating) onSetRating(rating);
  }

  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {/* Render stars based on maxRating prop */}
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            color={color}
            size={size}
            key={i}
            // Pass click handler with 1-based index
            onRate={() => handleRate(i + 1)}
            // Star is filled if hovering or if rating is set
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            // Update hover state on mouse enter/leave
            onHoverIn={() => setTempRating(i + 1)}
            onHoverLeave={() => setTempRating(0)}
          />
        ))}
      </div>
      <p style={textStyle}>
        {/* Display custom message if provided, otherwise show numeric rating */}
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}
// Star component - individual star element
function Star({ onRate, full, onHoverIn, onHoverLeave, color, size }) {
  // Dynamic styling based on size prop
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    cursor: "pointer",
    display: "block",
  };

  return (
    <span
      style={starStyle}
      role="button"
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverLeave}
    >
      {/* Show filled star if full, otherwise empty star */}
      {full ? (
        /* Filled star icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        /* Empty star icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}