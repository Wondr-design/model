import googleai from "../googleentry";

const main = async (prompt, onChunk) => {
  try {
    const response = await googleai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    for await (const chunk of response) {
      console.log("Received chunk:", chunk); // Log each chunk

      // Check if the chunk has content and extract the text
      if (chunk.candidates && chunk.candidates[0].content.parts) {
        const text = chunk.candidates[0].content.parts
          .map((part) => part.text)
          .join(""); // Join parts to form the complete chunk of text
        onChunk(text); // Call onChunk with the extracted text
      }
    }
  } catch (e) {
    console.error("Error in streaming:", e);
  }
};

export default main;
