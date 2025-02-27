import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your API key
const API_KEY = "AIzaSyDW3yJZn-XldiU3iYL-beZQsmOC10dTr8Q"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

export type Language = 'english' | 'hindi' | 'tamil';

export async function getResponseInLanguage(
  userMessage: string, 
  language: Language
): Promise<string> {
  try {
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create appropriate system prompt based on language
    let systemPrompt = "";
    
    switch (language) {
      case 'hindi':
        systemPrompt = `
          आप मानसिक स्वास्थ्य सहायक हैं। आपको उपयोगकर्ता के संदेश का जवाब हिंदी में देना है।
          आपका उत्तर सहायक, सहानुभूतिपूर्ण और उत्साहजनक होना चाहिए। 
          अपने उत्तर को एक पैराग्राफ तक सीमित रखें।
          किसी भी अन्य भाषा में उत्तर न दें।
        `;
        break;
      case 'tamil':
        systemPrompt = `
          நீங்கள் ஒரு மன நல உதவியாளர். பயனரின் செய்திக்கு தமிழில் பதிலளிக்க வேண்டும்.
          உங்கள் பதில் உதவிகரமாகவும், அனுதாபமாகவும், ஊக்கமளிப்பதாகவும் இருக்க வேண்டும்.
          உங்கள் பதிலை ஒரு பத்திக்குள் வைத்திருங்கள்.
          வேறு எந்த மொழியிலும் பதிலளிக்க வேண்டாம்.
        `;
        break;
      default: // English
        systemPrompt = `
          You are a mental health assistant. Respond to the user's message in English.
          Your response should be helpful, empathetic, and encouraging. 
          Keep your response to one paragraph.
        `;
        break;
    }

    // Generate content
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: userMessage }] }
      ],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    
    // Return fallback responses based on language
    const fallbackResponses = {
      english: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
      hindi: "मुझे खेद है, मुझे अभी कनेक्ट करने में परेशानी हो रही है। कृपया एक क्षण में पुनः प्रयास करें।",
      tamil: "மன்னிக்கவும், என்னால் தற்போது இணைக்க முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."
    };
    
    return fallbackResponses[language];
  }
}
