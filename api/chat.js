// ════════════════════════════════════════════════════════════════════════════
//  /api/chat.js — Cerebras (with Groq + Gemini fallback) — 100% FREE, NO CARD
//
//  Tries providers in order: Cerebras → Groq → Gemini
//  If any one provider fails, falls back to the next. Resilient and free.
//
//  Required env vars (add whichever you have, code skips missing ones):
//    CEREBRAS_API_KEY  → https://cloud.cerebras.ai (recommended, 1M tok/day)
//    GROQ_API_KEY      → https://console.groq.com (fast backup)
//    GEMINI_API_KEY    → https://aistudio.google.com (final backup)
//
//  Setting just one is enough — the others are optional for redundancy.
// ════════════════════════════════════════════════════════════════════════════

import { buildSystemPrompt } from "../src/resume.js";

// ─── Provider configs ──────────────────────────────────────────────────────

const PROVIDERS = [
  {
    name: "Cerebras",
    envKey: "CEREBRAS_API_KEY",
    endpoint: "https://api.cerebras.ai/v1/chat/completions",
    models: ["gpt-oss-120b", "zai-glm-4.7"],
    format: "openai",
  },
  {
    name: "Groq",
    envKey: "GROQ_API_KEY",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
    format: "openai",
  },
  {
    name: "Gemini",
    envKey: "GEMINI_API_KEY",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models",
    models: ["gemini-1.5-flash-latest", "gemini-1.5-flash"],
    format: "gemini",
  },
];

// ─── Rate limiting ─────────────────────────────────────────────────────────

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

// ─── OpenAI-style request (Cerebras + Groq) ────────────────────────────────

async function callOpenAIStyle(provider, model, apiKey, systemPrompt, conversation) {
  const body = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...conversation,
    ],
    temperature: 0.7,
    max_tokens: 400,
    top_p: 0.9,
  };
  const res = await fetch(provider.endpoint, {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) return { ok: false, status: res.status, text };
  const data = JSON.parse(text);
  const reply = data?.choices?.[0]?.message?.content?.trim();
  return reply ? { ok: true, reply } : { ok: false, status: 502, text: "empty reply" };
}

// ─── Gemini-style request ──────────────────────────────────────────────────

async function callGemini(provider, model, apiKey, systemPrompt, conversation) {
  const contents = conversation.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 400, topP: 0.9 },
  };
  const url = `${provider.endpoint}/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) return { ok: false, status: res.status, text };
  const data = JSON.parse(text);
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return reply ? { ok: true, reply } : { ok: false, status: 502, text: "empty reply" };
}

// ─── Main handler ──────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown";
  if (!rateLimit(ip)) return res.status(429).json({ error: "Too many requests — please slow down." });

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing 'messages' array in body." });
  }

  const systemPrompt = buildSystemPrompt();
  const conversation = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: String(m.content || "").slice(0, 2000) }));

  const errors = [];

  // Try each configured provider in order
  for (const provider of PROVIDERS) {
    const apiKey = process.env[provider.envKey];
    if (!apiKey) { console.log(`[QAIX] Skipping ${provider.name} — no ${provider.envKey} set`); continue; }

    for (const model of provider.models) {
      console.log(`[QAIX] Trying ${provider.name} / ${model}`);
      try {
        const result = provider.format === "gemini"
          ? await callGemini(provider, model, apiKey, systemPrompt, conversation)
          : await callOpenAIStyle(provider, model, apiKey, systemPrompt, conversation);

        if (result.ok) {
          console.log(`[QAIX] ✓ Success with ${provider.name} / ${model}`);
          return res.status(200).json({ reply: result.reply, source: provider.name });
        }
        console.warn(`[QAIX] ✗ ${provider.name} / ${model} failed (${result.status}):`, result.text?.slice(0, 200));
        errors.push({ provider: provider.name, model, status: result.status, body: result.text?.slice(0, 200) });

        // Auth errors → no point trying other models from same provider
        if (result.status === 401 || result.status === 403) break;
      } catch (e) {
        console.error(`[QAIX] ${provider.name} / ${model} crashed:`, e.message);
        errors.push({ provider: provider.name, model, error: e.message });
      }
    }
  }

  // Nothing worked
  const anyKeyConfigured = PROVIDERS.some((p) => process.env[p.envKey]);
  if (!anyKeyConfigured) {
    return res.status(500).json({ error: "No API key configured. Set CEREBRAS_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY in Vercel." });
  }

  console.error("[QAIX] All providers failed:", JSON.stringify(errors));
  return res.status(502).json({
    error: "All AI providers are temporarily unavailable. Try again in a moment.",
    debug: errors,
  });
}
