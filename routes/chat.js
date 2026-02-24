import express from "express";
import OpenAI from "openai";
import pool from "../db.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
console.log("API KEY:", process.env.OPENAI_API_KEY);



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { message, clientId } = req.body;

  try {
    const clientQuery = await pool.query(
      "SELECT * FROM clients WHERE id = $1 AND active = true",
      [clientId]
    );

    if (clientQuery.rows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    const client = clientQuery.rows[0];

    const origin = req.headers.origin;

    console.log("Origin header:", origin);
console.log("Client domain:", client.domain);

if (origin && !origin.includes(client.domain)) {
  return res.status(403).json({ error: "Unauthorized domain" });
}

   const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: client.system_prompt },
    { role: "user", content: message }
  ],
  stream: true
});

// Tell browser we are sending a stream
res.setHeader("Content-Type", "text/plain");
res.setHeader("Transfer-Encoding", "chunked");

for await (const chunk of completion) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    res.write(content);
  }
}

res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
