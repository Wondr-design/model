import React, { useEffect, useState } from "react";
import main from "../apis/google/googlegenai";

const Text = () => {
  const [text, setText] = useState([]);
  const prompt = `Note: Extract the event information from here:
  "Alice and Bob are going to a science fair on friday`;

  useEffect(() => {
    (async () => {
      const textResponse = await main(prompt);
      setText(textResponse);
    })();
  }, []);

  return (
    <div>
      {/* Check if the array is not empty, and if so, render each recipe name */}
      {text && text.length > 0 ? (
        text.map((item, index) => (
          <div key={index}>
            {item.eventName}
            {item.eventDate}
            {item.eventParticipants}
          </div> // Render the recipe name
        ))
      ) : (
        <div>Loading...</div> // Show a loading message while waiting for data
      )}
    </div>
  );
};

export default Text;
