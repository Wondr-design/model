import { GoogleGenAI, Type } from "@google/genai";
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const main = async () => {
  const getCurrentTemperature = async ({ location }) => {
    // Simulate a real fetch to a weather API
    console.log(`Fetching temperature for ${location}...`);
    return {
      location,
      temperature: "20°C", // Mock temperature
      unit: "Celsius",
      source: "MockWeatherAPI",
    };
  };
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY");
  }
  try {
    const weatherFunctionDeclaration = {
      name: "getCurrentTemperature",
      description: "Gets the current temperature for a given location.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          location: {
            type: Type.STRING,
            description: "The city name, e.g. San Francisco",
          },
        },
        required: ["location"],
      },
    };

    // Send request with function declarations
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "What's the temperature in London?",
      config: {
        tools: [
          {
            functionDeclarations: [weatherFunctionDeclaration],
          },
        ],
      },
    });

    // Check for function calls in the response
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0]; // Assuming one function call
      console.log(`Function to call: ${functionCall.name}`);
      console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
      const result = await getCurrentTemperature(functionCall.args);
      console.log(result);
      return result;
      // In a real app, you would call your actual function here:
      // const result = await getCurrentTemperature(functionCall.args);
    } else {
      console.log("No function call found in the response.");
      console.log(response.text);
      const result = response.text;
      console.log(result);
      return result;
    }
  } catch (e) {
    console.log(e);
  }
};
export default main;
