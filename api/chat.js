// ════════════════════════════════════════════════════════════════════════════
//  /api/chat.js — OpenRouter version (replaces flaky Gemini direct)
//
//  Why OpenRouter: works reliably in all regions, no Google Cloud project
//  confusion, free tier available, OpenAI-compatible API.
//
//  REQUIRED: set OPENROUTER_API_KEY in Vercel env vars.
//  Get one free at: https://openrouter.ai/keys
// ════════════════════════════════════════════════════════════════════════════

import { buildSystemPrompt } from "../src/resume.js";

// Free models on OpenRouter — fallback list, tries in order
// As of 2026, these have a "free" suffix and cost nothing.
const MODEL_CANDIDATES = [
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat:free",
];

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// Simple in-memory rate limit
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

async function callOpenRouter(model, apiKey, systemPrompt, messages) {
  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 400,
    top_p: 0.9,
  };

  const res = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://guruprasadchougule.vercel.app",
      "X-Title": "Guruprasad Portfolio Chatbot",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
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

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("[QAIX] OPENROUTER_API_KEY env var not set");
    return res.status(500).json({ error: "Server not configured. Set OPENROUTER_API_KEY in Vercel env vars." });
  }

  try {
    const systemPrompt = buildSystemPrompt();

    const conversation = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: String(m.content || "").slice(0, 2000) }));

    // Try each model in turn — if one is rate-limited or down, fall back
    let lastError = null;
    for (const model of MODEL_CANDIDATES) {
      console.log("[QAIX] Trying model:", model);
      const result = await callOpenRouter(model, apiKey, systemPrompt, conversation);

      if (result.ok) {
        const data = JSON.parse(result.text);
        const reply = data?.choices?.[0]?.message?.content?.trim();
        if (reply) {
          console.log("[QAIX] Success with", model, "| reply length:", reply.length);
          return res.status(200).json({ reply });
        }
      }

      console.warn("[QAIX] Model failed:", model, "| status:", result.status, "| body:", result.text.slice(0, 300));
      lastError = { model, status: result.status, body: result.text };

      // If auth error, all models will fail — break early
      if (result.status === 401 || result.status === 403) break;
    }

    // All models failed — return useful error
    let userMessage = "AI service is temporarily unavailable. Try again in a moment.";
    if (lastError?.status === 401 || lastError?.status === 403) {
      userMessage = "Invalid API key. Check OPENROUTER_API_KEY in Vercel.";
    } else if (lastError?.status === 429) {
      userMessage = "Rate limited by free tier. Try again in a minute.";
    } else if (lastError?.body?.includes("credit")) {
      userMessage = "OpenRouter credits exhausted. Switch to a different free model.";
    }

    return res.status(502).json({ error: userMessage, debug: lastError?.body?.slice(0, 500) });
  } catch (err) {
    console.error("[QAIX] Handler crashed:", err.message, err.stack);
    return res.status(500).json({ error: "Server error: " + (err.message || "unknown") });
  }
}
