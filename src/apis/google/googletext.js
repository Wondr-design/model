import { GoogleGenAI, Type } from "@google/genai";
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const main = async () => {
  const prompt = `Note: Extract the event information from here:
  "Alice and Bob are going to a science fair on friday " using this JSON schema:
    CalendarEvent<string> = {name: string, date: string, participants: Array<string>}
    Return: Array<JSON.parse(CalendarEvent)>
        `;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_API_KEY");
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.debug(response.text);
    console.log(response);

    const result = response.text;
    // const jsonObj = JSON.parse(result);
    // console.log(jsonObj[0].recipeName);
    // console.log(jsonObj);
    return result;
  } catch (e) {
    console.log(e);
  }
};
export default main;
