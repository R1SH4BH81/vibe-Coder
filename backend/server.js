// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI (ensure GEMINI_API_KEY in .env if you call the model)
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Hardcoded allowed origins
const allowedOrigins = [
  "https://vibe-qoder.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// CORS config: check origin against whitelist. Allow non-browser requests (no origin).
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server
    const normalized = origin.replace(/\/+$/, "");
    if (allowedOrigins.includes(normalized)) {
      return callback(null, true);
    } else {
      return callback(
        new Error(`CORS policy: Origin ${origin} is not allowed.`),
      );
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS error as JSON instead of HTML
app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith("CORS policy")) {
    return res.status(403).json({
      error: "CORS error",
      message: err.message,
    });
  }
  next(err);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Code Genie API is running",
    timestamp: new Date().toISOString(),
  });
});

// Code generation endpoint
app.post("/api/generate-code", async (req, res) => {
  try {
    const {
      prompt,
      language = "javascript",
      includeComments = true,
    } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "Prompt is required",
        message:
          "Please provide a description of the code you want to generate.",
      });
    }

    if (!genAI) {
      return res.status(500).json({
        error: "API configuration error",
        message:
          "Gemini API key is not configured. Please add your API key to the .env file.",
      });
    }

    const prompt_text = `You are an expert programmer who generates clean, well-documented, and production-ready code.

Rules:
1. Generate only the requested code without explanations unless specifically asked
2. Include helpful comments ${
      includeComments ? "always" : "only when essential"
    }
3. Follow best practices and conventions for ${language}
4. Make the code readable and maintainable
5. If the request is unclear, generate the most likely interpretation
6. Handle edge cases appropriately
7. Use modern syntax and patterns

Target Language: ${language}

Generate ${language} code for: ${prompt}`;

    console.log(`Generating code for prompt: "${prompt}" in ${language}`);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt_text);
    const response = await result.response;
    const generatedCode = response.text();

    // Extract code from markdown code blocks if present
    const codeMatch = generatedCode.match(/```(?:[\w+#-]*\n)?([\s\S]*?)```/);
    const cleanCode = codeMatch ? codeMatch[1].trim() : generatedCode.trim();

    // Detect language
    const detectedLanguage = detectLanguage(cleanCode, language);

    res.json({
      success: true,
      code: cleanCode,
      language: detectedLanguage,
      prompt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Code generation error:", error);

    const msg = (error && error.message) || String(error);

    if (msg.includes("API_KEY_INVALID")) {
      return res.status(401).json({
        error: "Invalid API key",
        message: "The provided Gemini API key is invalid. Please check config.",
      });
    }

    if (msg.includes("RATE_LIMIT_EXCEEDED")) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "Gemini API rate limit exceeded. Try again later.",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to generate code. Please try again later.",
      details: process.env.NODE_ENV === "development" ? msg : undefined,
    });
  }
});

// Simple language detection
function detectLanguage(code, requestedLanguage) {
  if (!code) return requestedLanguage;
  const patterns = {
    javascript: [
      /function\s+\w+/,
      /const\s+\w+\s*=/,
      /=>\s*{/,
      /console\.log/,
      /require\(/,
      /import\s+/,
    ],
    python: [
      /def\s+\w+/,
      /import\s+\w+/,
      /from\s+\w+\s+import/,
      /print\(/,
      /if\s+__name__\s*==\s*["']__main__["']/,
      /:\s*$/m,
    ],
    java: [
      /public\s+class/,
      /public\s+static\s+void\s+main/,
      /System\.out\.println/,
      /import\s+java\./,
      /\w+\s+\w+\s*\([^)]*\)\s*{/,
    ],
    cpp: [
      /#include\s*</,
      /using\s+namespace\s+std/,
      /int\s+main\s*\(/,
      /cout\s*<</,
      /std::/,
    ],
    html: [/<html/, /<div/, /<script/, /<style/, /<!DOCTYPE/],
    css: [/\{[^}]*\}/, /@media/, /\.[\w-]+\s*{/, /#[\w-]+\s*{/],
    sql: [
      /SELECT\s+/i,
      /FROM\s+/i,
      /WHERE\s+/i,
      /INSERT\s+INTO/i,
      /CREATE\s+TABLE/i,
    ],
    json: [/^\s*{/, /^\s*\[/, /"[\w-]+"\s*:/, /,\s*$/m],
  };
  for (const [lang, langPatterns] of Object.entries(patterns)) {
    if (langPatterns.some((pattern) => pattern.test(code))) {
      return lang;
    }
  }
  return requestedLanguage;
}

// Supported languages
app.get("/api/languages", (req, res) => {
  const languages = [
    { value: "javascript", label: "JavaScript", icon: "🟨" },
    { value: "typescript", label: "TypeScript", icon: "🔷" },
    { value: "python", label: "Python", icon: "🐍" },
    { value: "java", label: "Java", icon: "☕" },
    { value: "cpp", label: "C++", icon: "⚡" },
  ];
  res.json({ languages });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested endpoint does not exist.",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && err.stack ? err.stack : err);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong on our end.",
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🧞‍♂️ Code Genie API server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(
      `🔑 Gemini API Key: ${
        process.env.GEMINI_API_KEY ? "✅ Configured" : "❌ Missing"
      }`,
    );
    console.log(`🔒 Allowed origins: ${allowedOrigins.join(", ")}`);
  });
}

module.exports = app;
