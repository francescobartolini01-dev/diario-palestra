// Funzione serverless facoltativa: abilita il pulsante "Chiedi consigli a Claude".
// Funziona solo se su Vercel imposti la variabile d'ambiente ANTHROPIC_API_KEY.
export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (req.method === "GET") return res.status(200).json({ enabled: Boolean(key) });
  if (req.method !== "POST") return res.status(405).json({ error: "Metodo non consentito" });
  if (!key) return res.status(501).json({ error: "Consigli AI non configurati" });

  const prompt = req.body && typeof req.body.prompt === "string" ? req.body.prompt : "";
  if (!prompt || prompt.length > 15000) return res.status(400).json({ error: "Richiesta non valida" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || "claude-sonnet-5-5",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status === 429 ? 429 : 502).json({ error: data?.error?.message || "Errore dall'API" });
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: "Impossibile contattare l'API" });
  }
}
