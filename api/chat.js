// ════════════════════════════════════════════════════════════════════════════
//  /api/chat.js — Vercel Serverless Function (v2 — better error reporting)
//
//  Receives chat messages from the frontend, sends them to Google Gemini
//  with Guru's resume as system instructions, returns the AI's reply.
//
//  Requires env var GEMINI_API_KEY (exact name, all caps, with underscores).
//  Get one for free: https://aistudio.google.com/app/apikey
// ════════════════════════════════════════════════════════════════════════════

import { buildSystemPrompt } from "../src/resume.js";

// Using a stable, widely-available model. If this errors, try:
//   gemini-1.5-flash-latest  (good fallback)
//   gemini-1.5-flash         (older but reliable)
const GEMINI_MODEL = "gemini-1.5-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const requestsByIp = new Map();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 15;

function rateLimit(ip) {
  const now = Date.now();
  const stamps = (requestsByIp.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (stamps.length >= RATE_LIMIT_MAX) return false;
  stamps.push(now);
  requestsByIp.set(ip, stamps);
  return true;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown";
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests — please slow down." });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing 'messages' array in body." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[QAIX] GEMINI_API_KEY env var not set");
    return res.status(500).json({ error: "Server not configured. Set GEMINI_API_KEY in Vercel env vars." });
  }

  try {
    const systemPrompt = buildSystemPrompt();

    const contents = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.content || "").slice(0, 2000) }],
      }));

    const body = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
        topP: 0.9,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
      ],
    };

    console.log("[QAIX] Calling Gemini with", contents.length, "messages");

    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseText = await geminiRes.text();

    if (!geminiRes.ok) {
      console.error("[QAIX] Gemini error:", geminiRes.status, responseText);

      // Surface a more useful error message to the user
      let detail = "Try again in a few seconds.";
      try {
        const errJson = JSON.parse(responseText);
        const errMsg = errJson?.error?.message || "";
        if (errMsg.includes("API key not valid")) {
          detail = "Invalid API key. Check GEMINI_API_KEY in Vercel.";
        } else if (errMsg.includes("quota") || errMsg.includes("limit")) {
          detail = "Daily free-tier quota exceeded. Try again tomorrow.";
        } else if (errMsg.includes("not found") || errMsg.includes("not supported")) {
          detail = "Model not available. Try a different Gemini model.";
        } else if (errMsg) {
          detail = errMsg.slice(0, 150);
        }
      } catch { /* ignore parse errors */ }

      return res.status(502).json({ error: detail, debug: responseText.slice(0, 500) });
    }

    const data = JSON.parse(responseText);

    // Check for blocked responses
    const candidate = data?.candidates?.[0];
    if (candidate?.finishReason === "SAFETY") {
      return res.status(200).json({ reply: "I can't answer that one — let's stick to questions about Guru's work. Try asking about his projects, skills, or experience! 🛡️" });
    }

    const reply = candidate?.content?.parts?.[0]?.text?.trim();

    if (!reply) {
      console.warn("[QAIX] Empty response:", JSON.stringify(data).slice(0, 500));
      return res.status(502).json({ error: "Couldn't generate a response. Try rephrasing your question." });
    }

    console.log("[QAIX] Success, reply length:", reply.length);
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("[QAIX] Handler crashed:", err.message, err.stack);
    return res.status(500).json({ error: "Server error: " + (err.message || "unknown") });
  }
}
