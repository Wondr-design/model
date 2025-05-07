import React, { useEffect, useState } from "react";
import main from "../apis/google/calls/googlestream";

const GStreamText = () => {
  const prompt = "Explain modern physics in 500 words"; // Customize the prompt
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let isMounted = true;

      const streamText = async () => {
        setText(""); // Reset previous output
        setLoading(true);

        // Call main function and pass onChunk callback to update text state
        await main(prompt, (chunk) => {
          if (isMounted) {
            setText((prev) => prev + chunk); // Append chunk of text as it arrives
          }
        });

        if (isMounted) setLoading(false);
      };

      await streamText();

      // Cleanup to avoid setting state on unmounted component
      return () => {
        isMounted = false;
      };
    })();
  }, [prompt]); // Runs again if the prompt changes

  if (loading) return <div>Loading AI response...</div>; // Show loading message while waiting

  return <div>{text}</div>; // Display the streamed text
};

export default GStreamText;
