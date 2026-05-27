import { NextResponse } from "next/server";

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

    // Map messages to OpenAI/xAI format
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    // Prepend system message
    formattedMessages.unshift({
      role: "system",
      content: systemPrompt,
    });

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: formattedMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("xAI API error:", errorText);
      throw new Error("Failed to fetch from xAI");
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Кешіріңіз, қате шықты. Кейінірек қайта көріңіз." },
      { status: 500 }
    );
  }
}
