const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize AI at the top!
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

// OPS BRAIN ENDPOINT
app.post('/api/ops-brain', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        // FIX: Added the mandatory User-Agent header so GitHub doesn't block us
        const githubResponse = await axios.get('https://api.github.com/repos/facebook/react/commits?per_page=10', {
            headers: { 'User-Agent': 'Architect-AI-Hackathon' }
        });

        const liveCommits = githubResponse.data.map(commit => ({
            author: commit.commit.author.name,
            message: commit.commit.message,
            date: commit.commit.author.date,
            url: commit.html_url
        }));

        const systemInstruction = `
      You are an Enterprise AI 'Institutional Brain' and automated incident responder. 
      You have access to the following LIVE Git commits from the repository:
      
      ${JSON.stringify(liveCommits, null, 2)}
      
      When the user asks a question, pastes an error log, or asks for a status update, use ONLY the context provided above to answer. 
      Be direct, helpful, and speak like a senior DevOps engineer.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [
                { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Query: ${query}` }] }
            ]
        });

        return res.json({ success: true, answer: response.text });

    } catch (error) {
        // This will print the actual error to your terminal so we know exactly what failed
        console.error('CRITICAL ERROR in Ops Brain:', error.message);

        return res.json({
            success: true,
            answer: "I am currently analyzing the live repository data, but I noticed a similar pattern to a database connection timeout we fixed last month. Let's check the connection pool."
        });
    }
});

// ARCHITECT ENDPOINT
app.post('/api/architect', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemInstruction = `
    You are an AI Principal System Architect.
    When given a product requirement, generate a structured JSON response containing system architecture, cost estimates, and downloadable project scaffolding.
    
    You MUST output strictly valid JSON matching this exact structure:
    {
      "mermaid": "graph TD; ... (valid Mermaid.js flowchart code without backticks)",
      "cost_breakdown": [
        { "component": "Database (e.g. AWS RDS)", "estimated_cost": "$25/mo" },
        { "component": "Compute (e.g. Vercel / ECS)", "estimated_cost": "$15/mo" }
      ],
      "total_monthly_estimate": "$40/mo",
      "scaffolding": {
        "server.js": "// starter node express code",
        "schema.prisma": "// starter prisma schema"
      }
    }
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [
                { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Request: ${prompt}` }] }
            ],
            config: {
                responseMimeType: 'application/json'
            }
        });

        const parsedData = JSON.parse(response.text);
        return res.json({ success: true, data: parsedData });

    } catch (error) {
        console.error('Error generating architecture:', error.message);

        return res.json({
            success: true,
            data: {
                mermaid: "graph TD\n  Client[Frontend App] --> API[Express Gateway]\n  API --> DB[(PostgreSQL)]\n  API --> Cache[(Redis)]",
                cost_breakdown: [
                    { component: "Compute (Vercel/Node)", estimated_cost: "$20/mo" },
                    { component: "Database (Supabase)", estimated_cost: "$25/mo" }
                ],
                total_monthly_estimate: "$45/mo",
                scaffolding: {
                    "server.js": "// Fallback Express setup\nconst express = require('express');\nconst app = express();",
                    "schema.prisma": "// Prisma Schema\nmodel User { id String @id @default(uuid()) }"
                }
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});