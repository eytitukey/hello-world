
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chatgpt', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const response = chatCompletion.choices[0].message.content.trim();
    res.json({ response });
  } catch (error) {
    console.error('Fehler bei OpenAI:', error);
    res.status(500).json({ error: 'Fehler bei der Verarbeitung der Anfrage' });
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
