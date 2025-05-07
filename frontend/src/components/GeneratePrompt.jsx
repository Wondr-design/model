import React, { useState } from "react";

const GeneratePrompt = () => {
  const [prompt, setPrompt] = useState(""); // State for storing the user's prompt
  const [response, setResponse] = useState(""); // State for storing the response from the API
  const [loading, setLoading] = useState(false); // State to track if the request is in progress
  const [error, setError] = useState(null); // State to track if there's an error

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }), // Use the state directly
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      console.log(data.response);
      setResponse(data.response); // Update response state
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate text. Please try again.");
    }
  };

  return (
    <div>
      <h1>Generate Text</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Prompt:
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            rows="4"
            cols="50"
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {response && (
        <div>
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default GeneratePrompt;
