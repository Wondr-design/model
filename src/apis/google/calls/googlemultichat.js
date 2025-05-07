import googleai from "../googleentry";
const main = async () => {
  if (!googleai) throw new Error("Missing Google authentication");

  try {
    const chat = googleai.chats.create({
      model: "gemini-2.0-flash",
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });

    const response1 = await chat.sendMessage({
      message: "I have 2 dogs in my house",
    });
    console.log(
      "Chat response 1:",
      response1.candidates[0].content.parts[0].text
    );

    const response2 = await chat.sendMessage({
      message: "I have a cat in my house",
    });
    console.log(
      "Chat response 2:",
      response2.candidates[0].content.parts[0].text
    );
    const response3 = await chat.sendMessage({
      message:
        "The name of my cat is Tom, he is 2 years old, the name of my dogs are Bob and Alice, they are 3 years old",
    });
    console.log(
      "Chat response 3:",
      response3.candidates[0].content.parts[0].text
    );
  } catch (error) {
    console.error(error);
    throw new Error("");
  } finally {
    console.log("Done");
  }
};
export default main;
