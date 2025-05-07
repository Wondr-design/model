import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const googleai = new GoogleGenAI({ apiKey });

export default googleai;
