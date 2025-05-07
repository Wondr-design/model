import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import main from "../apis/google/calls/googlemultimain";
import "./scrollbar.css";

const ModelChat = () => {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState([]);

  const responseRef = useRef(null);

  useEffect(() => {
    if (responseRef.current) {
      gsap.fromTo(
        responseRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [responses]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    try {
      const reply = await main(prompt);
      setResponses((prev) => [
        ...prev,
        { user: prompt, model: reply.join("\n") },
      ]);
    } catch (error) {
      console.error("Error in chat:", error);
      setResponses((prev) => [
        ...prev,
        { user: prompt, model: "Error getting response." },
      ]);
    } finally {
      setPrompt("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-semibold mb-4">ModelChat</h2>
      <div
        className="flex-1 overflow-y-auto mb-4 p-4 rounded bg-gray-800 shadow custom-scrollbar"
        ref={responseRef}
      >
        {responses.map((res, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-xs whitespace-pre-wrap">
                {res.user}
              </div>
            </div>
            <div className="flex justify-start mt-2">
              <div className="bg-gray-700 text-white px-4 py-2 rounded-lg max-w-xs whitespace-pre-wrap">
                {res.model}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Ask something..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ModelChat;
