import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = 3000;

app.use(express.json());

// Allow your frontend to talk to your backend
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 🚨 MAKE SURE YOUR API KEY IS CORRECT HERE 🚨
// const API_KEY = "AQ.Ab8RN6JV...";vVseG5TZqHamBxbxfFJ6Yl4wNOkgl3lAWC2_51wxOXLw"; 

const ai = new GoogleGenAI({ apiKey: API_KEY });
const ai = new GoogleGenAI({ apiKey: API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // Correct SDK method structure for content generation
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
        });

        // The SDK returns text inside the 'text' property
        return res.json({
            success: true,
            reply: response.text
        });

    } catch (error) {
        // This line prints the hidden error directly into your VS Code terminal
        console.error("🔴 SERVER ERROR:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
});
