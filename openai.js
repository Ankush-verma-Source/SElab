
// OpenAi api :
// Use CommonJS to match the rest of the project which uses require/module.exports
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const OpenAI = require("openai").default || require("openai");

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.warn("OPENAI_API_KEY not set in environment; OpenAI calls will fail if invoked.");
}

const client = new OpenAI({ apiKey });

async function openAI(message) {
    // Allow a mock mode for local development to avoid hitting real API/quota
    if (process.env.OPENAI_MOCK === "true") {
        const mock = `MOCK RESPONSE: This is a mock reply for input: "${message}"`;
        console.log("openai.js (mock):", mock);
        return mock;
    }

    try {
        const response = await client.responses.create({
            model: "gpt-5",
            input: message,
        });
        // The shape of the response may vary between SDK versions; attempt to extract text safely
        const text = response.output_text ||
            (response.output && response.output[0] && response.output[0].content && response.output[0].content[0] && response.output[0].content[0].text) ||
            JSON.stringify(response);
        console.log(text);
        return text;
    } catch (err) {
        // Log and return a safe, developer-friendly message instead of throwing
        console.error("OpenAI request failed:", err && (err.message || err.code || err));
        return `ERROR: OpenAI request failed: ${err && (err.message || err.code || 'unknown error')}`;
    }
}

module.exports = { openAI };

