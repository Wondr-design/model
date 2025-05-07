import { GoogleGenAI, Type } from "@google/genai";
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const apiKeyWeather = import.meta.env.VITE_OPENWEATHER_API_KEY;
const ai = new GoogleGenAI({ apiKey });
// Define a function that the model calls;
const main = async (propmt) => {
  const weatherFunctionDeclaration = {
    name: "get_current_weather",
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

  // Declare the fucntion(s) to use

  // const getCurrentTemperature = async (location) => {
  //   return {
  //     location: location,
  //     temperature: "20°C",
  //     unit: "Celsius",
  //     source: "MockWeatherAPI",
  //   };
  // };
  const getCurrentTemperature = async (location) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKeyWeather}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        const temperature = data.main.temp; // Temperature in Celsius
        console.log(`The temperature in ${location} is ${temperature}°C.`);
        return temperature;
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Example usage
  // getCurrentTemperature("London");

  // Call the model with the function(s)

  const config = {
    tools: [
      {
        functionDeclarations: [weatherFunctionDeclaration],
      },
    ],

    systemInstruction: `You are to respond like a chatbot. Let your response be very chatty and conversational
    and be as helpful as possible.
    if you dont know which function to use then respond with 'I don't know'`,
  };
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: propmt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents,
    config: config,
  });
  console.log(response.functionCalls[0]);
  const tool_call = response.functionCalls[0];
  let result;
  console.log(tool_call);

  //to tie the model with the function and its parameters
  if (tool_call.name === "get_current_weather") {
    console.log(tool_call.name);

    result = await getCurrentTemperature(tool_call.args.location);
    console.log(result);

    console.log(`Function extraction result: ${JSON.stringify(result)}`);
  }

  // Create a function response part

  const function_response_part = {
    name: tool_call.name,
    response: { result },
  };

  // Append function call and result of the function execution to contents

  contents.push({
    role: "model",
    parts: [{ functionCall: tool_call }],
  });
  contents.push({
    role: "user",
    parts: [{ functionResponse: function_response_part }],
  });
  // Get the final response from the model

  const final_response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents,
    config: config,
  });
  console.log(final_response.text);
  return final_response.text;
};

export default main;
