export const mockArchitectData = {
  systemName: "Enterprise Esports Platform",
  architectureNodes: [
    { id: '1', title: 'React Web Frontend', type: 'client', desc: 'Vite + Tailwind Dashboard', icon: 'Layout' },
    { id: '2', title: 'Express API Gateway', type: 'api', desc: 'JWT Auth & Rate Limiting', icon: 'Server' },
    { id: '3', title: 'Auth & User Service', type: 'microservice', desc: 'OAuth & Session Management', icon: 'ShieldCheck' },
    { id: '4', title: 'Tournament Engine', type: 'microservice', desc: 'Real-time Matchmaking', icon: 'Cpu' },
    { id: '5', title: 'PostgreSQL Database', type: 'database', desc: 'User & Match Records', icon: 'Database' },
    { id: '6', title: 'Redis Cache', type: 'cache', desc: 'In-Memory Leaderboard', icon: 'Zap' }
  ],
  architectureFlow: [
    { from: 'React Web Frontend', to: 'Express API Gateway', label: 'HTTPS / REST API' },
    { from: 'Express API Gateway', to: 'Auth & User Service', label: 'gRPC Internal' },
    { from: 'Express API Gateway', to: 'Tournament Engine', label: 'gRPC Internal' },
    { from: 'Tournament Engine', to: 'PostgreSQL Database', label: 'Prisma ORM' },
    { from: 'Tournament Engine', to: 'Redis Cache', label: 'Pub/Sub Stream' }
  ],
  sqlSchema: `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming'
);`,
  mongoSchema: `{
  "users": {
    "_id": "ObjectId",
    "username": "String",
    "email": "String"
  },
  "tournaments": {
    "_id": "ObjectId",
    "title": "String",
    "status": "String"
  }
}`,
  apiEndpoints: [
    { method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticate user & issue JWT', requiresAuth: false },
    { method: 'GET', path: '/api/v1/tournaments', desc: 'Fetch active tournament lobby', requiresAuth: true },
    { method: 'POST', path: '/api/v1/tournaments/register', desc: 'Register squad for tournament', requiresAuth: true }
  ],
  costBreakdown: [
    { service: 'Vercel Pro (Frontend Host)', cost: '$20/mo' },
    { service: 'Railway (Express Services)', cost: '$35/mo' },
    { service: 'Supabase PostgreSQL', cost: '$25/mo' },
    { service: 'Upstash Redis', cost: '$15/mo' }
  ],
  totalCost: "$95/mo",
  warningNote: "High WebSocket concurrency during live tournaments may spike Redis memory overhead past 50k users.",
  dockerCompose: `version: '3.8'
services:
  gateway:
    build: ./gateway
    ports:
      - '5000:5000'
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret`
};

export const mockBrainData = {
  recentCommits: [
    { id: 'a1b2c3d', message: 'Fix database connection pool exhaustion under heavy load', author: 'Alex (Lead Dev)', time: '2 hours ago' },
    { id: 'e5f6g7h', message: 'Add JWT secret key verification fallback', author: 'Sarah (Backend)', time: '5 hours ago' }
  ],
  jiraTickets: [
    { key: 'DEV-402', title: 'Connection Pool Timeout in Production', status: 'Resolved', priority: 'High' },
    { key: 'DEV-389', title: 'Memory Leak in WebSocket Handler', status: 'In Progress', priority: 'Critical' }
  ],
  sampleDiagnosis: {
    rootCause: "Database Connection Pool Exhaustion caused by unhandled async exceptions leaving client sockets open.",
    matchedSources: [
      { type: "PR Citation", reference: "PR #402: Increased pool connection limit & added client.release() in finally block", link: "#" },
      { type: "Jira Ticket", reference: "DEV-402: High latency on DB queries during peak hours", link: "#" }
    ],
    originalCode: `const client = await pool.connect();
const res = await client.query('SELECT * FROM users');
// Error: Missing client.release() - causes pool exhaustion`,
    fixedCode: `const client = await pool.connect();
try {
  const res = await client.query('SELECT * FROM users');
} finally {
  client.release(); // Fixed: Connection properly released
}`
  }
};
