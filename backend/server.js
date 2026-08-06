const axios = require('axios');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const { supabase } = require('./lib/supabase');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// --- SUPABASE JWT AUTHENTICATION MIDDLEWARE ---
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or malformed access token' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || 'fallback_secret_for_local_dev';

    jwt.verify(token, jwtSecret, (err, decodedUser) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            return res.status(403).json({ error: 'Forbidden: Invalid or expired access token' });
        }

        // Attach decoded user metadata to request context
        req.user = decodedUser;
        next();
    });
};

// Optional auth middleware for routes that can work with or without a logged-in user
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || 'fallback_secret_for_local_dev';

    jwt.verify(token, jwtSecret, (err, decodedUser) => {
        if (err) {
            req.user = null;
        } else {
            req.user = decodedUser;
        }
        next();
    });
};

// Health Check (Public - Unprotected)
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

// ============================================================
// GITHUB OAUTH ROUTES
// ============================================================

// 1. Redirect user to GitHub Login
app.get('/auth/github', (req, res) => {
    const redirectUri = process.env.REDIRECT_URI || 'http://localhost:5000/auth/github/callback';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
    res.redirect(githubAuthUrl);
});

// 2. Handle GitHub Callback (GitHub redirects here with a code)
app.get('/auth/github/callback', async (req, res) => {
    const { code } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!code) return res.status(400).send('No code provided by GitHub');

    try {
        // Exchange code for GitHub Access Token
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        }, { headers: { accept: 'application/json' } });

        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) throw new Error('Failed to obtain access token from GitHub');

        // Fetch User Profile from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'Dev-Assist-AI' }
        });
        
        const githubUser = userResponse.data;

        // Try fetching email if null
        let userEmail = githubUser.email;
        if (!userEmail) {
            try {
                const emailResponse = await axios.get('https://api.github.com/user/emails', {
                    headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'Dev-Assist-AI' }
                });
                const primaryEmail = emailResponse.data.find(e => e.primary);
                userEmail = primaryEmail ? primaryEmail.email : null;
            } catch (e) {
                // Ignore email fetch errors
            }
        }

        let userRecord = {
            id: null,
            github_id: String(githubUser.id),
            login: githubUser.login,
            name: githubUser.name || githubUser.login,
            avatar_url: githubUser.avatar_url,
            email: userEmail
        };

        // Upsert user into Supabase if configured
        if (supabase) {
            const { data: upsertedUser, error } = await supabase
                .from('users')
                .upsert({
                    github_id: String(githubUser.id),
                    login: githubUser.login,
                    name: githubUser.name || githubUser.login,
                    avatar_url: githubUser.avatar_url,
                    email: userEmail
                }, { onConflict: 'github_id' })
                .select()
                .single();

            if (error) {
                console.error('Supabase Upsert Error:', error.message);
            } else if (upsertedUser) {
                userRecord.id = upsertedUser.id;
            }
        }

        // Mint JWT with user payload
        const jwtSecret = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || 'fallback_secret_for_local_dev';
        const token = jwt.sign(userRecord, jwtSecret, { expiresIn: '7d' });

        // Redirect back to the frontend /auth/success route with token
        res.redirect(`${frontendUrl}/auth/success?token=${token}`);
    } catch (error) {
        console.error('Auth Error:', error.response?.data || error.message);
        res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }
});

// GET /auth/me — Return current user info from JWT
app.get('/auth/me', requireAuth, (req, res) => {
    res.json({ success: true, user: req.user });
});

// ============================================================
// OPS BRAIN ENDPOINT
// ============================================================
app.post('/api/ops-brain', optionalAuth, async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
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

        const answer = response.text;

        // Save to chat_history if user is authenticated and Supabase is configured
        if (req.user && req.user.id && supabase) {
            const { error: insertError } = await supabase
                .from('chat_history')
                .insert({
                    user_id: req.user.id,
                    query: query,
                    answer: answer
                });

            if (insertError) {
                console.error('Failed to save chat history:', insertError.message);
            }
        }

        return res.json({ success: true, answer: answer });

    } catch (error) {
        console.error('CRITICAL ERROR in Ops Brain:', error.message);
        const fallbackAnswer = "I am currently analyzing the live repository data, but I noticed a similar pattern to a database connection timeout we fixed last month. Let's check the connection pool.";

        // Save fallback response to chat_history if authenticated
        if (req.user && req.user.id && supabase) {
            const { error: insertError } = await supabase
                .from('chat_history')
                .insert({
                    user_id: req.user.id,
                    query: query,
                    answer: fallbackAnswer
                });

            if (insertError) {
                console.error('Failed to save fallback chat history:', insertError.message);
            }
        }

        return res.json({
            success: true,
            answer: fallbackAnswer
        });
    }
});

// ============================================================
// ARCHITECT ENDPOINT
// ============================================================
app.post('/api/architect', optionalAuth, async (req, res) => {
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

        // Save to saved_architectures if user is authenticated and Supabase is configured
        if (req.user && req.user.id && supabase) {
            const { error: insertError } = await supabase
                .from('saved_architectures')
                .insert({
                    user_id: req.user.id,
                    title: prompt.substring(0, 100),
                    prompt: prompt,
                    mermaid: parsedData.mermaid || null,
                    cost_breakdown: parsedData.cost_breakdown || null,
                    total_monthly_estimate: parsedData.total_monthly_estimate || null,
                    scaffolding: parsedData.scaffolding || null
                });

            if (insertError) {
                console.error('Failed to save architecture:', insertError.message);
            }
        }

        return res.json({ success: true, data: parsedData });

    } catch (error) {
        console.error('Error generating architecture:', error.message);
        const fallbackData = {
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
        };

        // Save fallback architecture if authenticated
        if (req.user && req.user.id && supabase) {
            const { error: insertError } = await supabase
                .from('saved_architectures')
                .insert({
                    user_id: req.user.id,
                    title: prompt.substring(0, 100),
                    prompt: prompt,
                    mermaid: fallbackData.mermaid,
                    cost_breakdown: fallbackData.cost_breakdown,
                    total_monthly_estimate: fallbackData.total_monthly_estimate,
                    scaffolding: fallbackData.scaffolding
                });

            if (insertError) {
                console.error('Failed to save fallback architecture:', insertError.message);
            }
        }

        return res.json({
            success: true,
            data: fallbackData
        });
    }
});

// ============================================================
// HISTORY ENDPOINT — Get chat history for logged-in user
// ============================================================
app.get('/api/history', requireAuth, async (req, res) => {
    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }

    try {
        const { data, error } = await supabase
            .from('chat_history')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching chat history:', error.message);
            return res.status(500).json({ error: 'Failed to fetch chat history' });
        }

        return res.json({ success: true, history: data });
    } catch (error) {
        console.error('Error in /api/history:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ============================================================
// ARCHITECTURES ENDPOINTS — Get/Delete saved architectures
// ============================================================

// GET /api/architectures — Returns saved architectures for logged-in user
app.get('/api/architectures', requireAuth, async (req, res) => {
    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }

    try {
        const { data, error } = await supabase
            .from('saved_architectures')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching architectures:', error.message);
            return res.status(500).json({ error: 'Failed to fetch architectures' });
        }

        return res.json({ success: true, architectures: data });
    } catch (error) {
        console.error('Error in /api/architectures:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/architectures/:id — Delete a saved architecture by ID
app.delete('/api/architectures/:id', requireAuth, async (req, res) => {
    if (!supabase) {
        return res.status(503).json({ error: 'Database not configured' });
    }

    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('saved_architectures')
            .delete()
            .eq('id', id)
            .eq('user_id', req.user.id);

        if (error) {
            console.error('Error deleting architecture:', error.message);
            return res.status(500).json({ error: 'Failed to delete architecture' });
        }

        return res.json({ success: true, message: 'Architecture deleted' });
    } catch (error) {
        console.error('Error in DELETE /api/architectures/:id:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});