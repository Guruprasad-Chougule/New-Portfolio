// ════════════════════════════════════════════════════════════════════════════
//  /api/chat.js — Vercel Serverless Function
//
//  Receives chat messages from the React frontend, sends them to Google
//  Gemini with Guru's resume baked in as system instructions, returns reply.
//
//  Requires env var GEMINI_API_KEY set in Vercel project settings.
//  Get one for free: https://aistudio.google.com/app/apikey
// ════════════════════════════════════════════════════════════════════════════

import { buildSystemPrompt } from "../src/resume.js";

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Simple in-memory rate limit per IP (resets on cold start, prevents abuse)
const requestsByIp = new Map();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 15;        // 15 messages / minute / IP

function rateLimit(ip) {
  const now = Date.now();
  const stamps = (requestsByIp.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (stamps.length >= RATE_LIMIT_MAX) return false;
  stamps.push(now);
  requestsByIp.set(ip, stamps);
  return true;
}

export default async function handler(req, res) {
  // CORS — same-origin from your portfolio
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Rate limit by IP
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown";
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests — please slow down." });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing 'messages' array in body." });
  }

  // Validate env var
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not set");
    return res.status(500).json({ error: "Server not configured. Set GEMINI_API_KEY in Vercel env vars." });
  }

  try {
    const systemPrompt = buildSystemPrompt();

    // Convert our { role, content } pairs into Gemini's expected format
    // Roles: 'user' or 'model' (Gemini doesn't use 'assistant')
    const contents = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.content || "").slice(0, 2000) }], // safety: cap each message
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

    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini error:", geminiRes.status, errText);
      return res.status(502).json({ error: "AI service is having a moment. Try again in a few seconds." });
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!reply) {
      console.warn("Empty Gemini response:", JSON.stringify(data));
      return res.status(502).json({ error: "Couldn't generate a response. Try rephrasing your question." });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat handler crashed:", err);
    return res.status(500).json({ error: "Something went wrong on the server. Try again." });
  }
}
