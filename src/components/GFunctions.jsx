import React, { useState } from "react";
import main from "../apis/google/googlefunctions2";

const GFunctions = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // The function is now outside of useEffect
  const fetchData = async () => {
    if (!prompt) return; // Don't fetch if the prompt is empty

    setLoading(true);
    // setError(null);
    try {
      const apiResult = await main(prompt);
      setResult(apiResult);
    } catch (err) {
      console.error(err);
      // setError(`Error: ${err.message || "Failed to fetch data"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-[100vw] p-10 flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w w-full p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          AI Query Handler
        </h1>

        <div className="mb-4">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt"
            className="w-full h-12 p-4 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <button
          onClick={fetchData}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Send
        </button>

        <div className="mt-4 text-center">
          {loading && <div className="text-indigo-600">Loading...</div>}
          {result && !loading && <div className="text-gray-800">{result}</div>}
          {/* {error && !loading && <div className="text-red-600">{error}</div>} */}
        </div>
      </div>
    </div>
  );
};

export default GFunctions;
