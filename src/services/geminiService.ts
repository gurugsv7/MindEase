import axios from 'axios';

// Use a more TypeScript-friendly way to access the API key
const API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || 
               (typeof window !== "undefined" && (window as any)._env_?.REACT_APP_GEMINI_API_KEY) || 
               'AIzaSyDW3yJZn-XldiU3iYL-beZQsmOC10dTr8Q'; // Fallback to the key you provided

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export async function getGeminiResponse(messages: Message[]): Promise<string> {
  try {
    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        systemInstruction: {
          parts: [
            {
              text: "You are a compassionate therapy assistant named MindfulChat. Your goal is to provide supportive, empathetic responses to help users with their mental wellbeing. Always maintain a calming, non-judgmental tone. Offer practical advice when appropriate, but don't diagnose or prescribe medication. Encourage professional help for serious concerns. Prioritize user safety and wellbeing above all."
            }
          ]
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
  }
}
