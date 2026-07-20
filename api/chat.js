// This runs on Vercel's server, not in the browser — so the API key
// stays private and is never exposed to anyone visiting the site.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, language } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GEMINI_API_KEY" });
  }

  const systemPrompt =
    language === "hi"
      ? "आप साथी हैं, छात्रों के लिए एक दयालु मानसिक स्वास्थ्य सहायता साथी। संक्षिप्त, गर्मजोशी से भरे और सहायक उत्तर दें (3-4 वाक्यों में)। यदि कोई आत्महत्या या आत्म-हानि का उल्लेख करता है, तो हमेशा आपातकालीन सेवाओं या क्राइसिस हेल्पलाइन (1800-123-4567) से संपर्क करने की सलाह दें।"
      : "You are Saathi, a warm and supportive mental health companion for students. Give brief, caring, helpful responses in 3-4 sentences. If someone mentions suicide or self-harm, always encourage them to contact emergency services or the crisis helpline (1800-123-4567).";

  const callGemini = () =>
    fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nStudent says: ${message}` }],
            },
          ],
        }),
      }
    );

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    let response = await callGemini();
    let data = await response.json();

    // If the model is temporarily overloaded (503) or rate-limited (429),
    // wait briefly and try once more before giving up.
    if (!response.ok && (response.status === 503 || response.status === 429)) {
      await sleep(1500);
      response = await callGemini();
      data = await response.json();
    }

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(502).json({ error: "AI service error" });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "I'm here for you, but I'm having a little trouble responding right now. Could you try rephrasing that?";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}