// Vercel Serverless Function: /api/chat
// Enables secure AI chatbot communication without exposing secret keys in source files

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { messages, apiKey: clientKey, model } = req.body || {};

    // Use environment variable from Vercel, or client key supplied securely from localStorage
    const apiKey = process.env.GROQ_API_KEY || clientKey;

    if (!apiKey) {
      return res.status(400).json({
        error: "NO_API_KEY",
        message: "No GROQ_API_KEY configured in environment variables or client."
      });
    }

    const groqModel = model || process.env.GROQ_MODEL || "openai/gpt-oss-20b";

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: groqModel,
        messages: messages,
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error: "GROQ_API_ERROR",
        status: groqResponse.status,
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Vercel API error:", err);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: err.message
    });
  }
}
