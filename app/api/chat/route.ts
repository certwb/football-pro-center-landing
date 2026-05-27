import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the API with the provided key
const genAI = new GoogleGenerativeAI("AIzaSyCCijIw3xdaK6RfFYG01kJ8kyZGdQ0XY58");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // The system prompt to set the behavior
    const systemPrompt = `Сіз Football Pro Center жасанды интеллект көмекшісісіз.
Football Pro Center - Ақтаудағы алғашқы кешенді кәсіби футбол орталығы.
Қызметтер:
- Кәсіби талдау (Видео және статистика).
- Жаттығу бағдарламалары.
- Алаң жалға беру (Мини-стадион).
- Спорт тауарлары.
- Турнирлер ұйымдастыру.

Бағалар:
- Base (Алаң жалдау) - 5 000 тг/сағ.
- Standard (Жаттығу бағдарламалары) - 3 000 - 8 000 тг.
- Premium (Кәсіби талдау қызметі) - 15 000 тг.

Байланыс телефоны (WhatsApp): +7 702 488 5854
Мекен-жайы: Ақтау қаласы.

Қолданушыларға сыпайы және қазақ тілінде жауап беріңіз. Егер сұрақ күрделі болса немесе брондау керек болса, WhatsApp арқылы хабарласуды ұсыныңыз.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    let formattedHistory: any[] = [];
    for (const msg of messages.slice(0, -1)) {
      const role = msg.sender === "user" ? "user" : "model";
      
      // History must start with 'user'
      if (formattedHistory.length === 0 && role === "model") {
        continue;
      }
      
      // History must alternate
      if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === role) {
        formattedHistory[formattedHistory.length - 1].parts[0].text += "\n" + msg.text;
      } else {
        formattedHistory.push({ role, parts: [{ text: msg.text }] });
      }
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const latestMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessage(latestMessage);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Кешіріңіз, қате шықты. Кейінірек қайта көріңіз." },
      { status: 500 }
    );
  }
}
