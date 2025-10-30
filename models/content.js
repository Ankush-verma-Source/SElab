const mongoose = require("mongoose");

const generatedContentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["quiz", "mcq", "summary","review","explain","flashcards"], // Extendable for future types
    required: true,
  },
  fileId: {
    type: String, // Matches fileId stored in user.fileUrl
  },

  // 🌟 Flexible metadata to support all features
  meta: {
    quizType: String,         // e.g., "mix", "true-false"
    questionCount: Number,    // for quiz or mcq
    difficulty: String,       // e.g., "easy", "medium", "hard"
    summaryLength: String,    // e.g., "short", "medium", "detailed"
    tone: String,             // e.g., "formal", "casual"
    model: String,            // e.g., "gemini-1.5", "gpt-4o"
    language: String,         // e.g., "en", "hi"
    topic: String,            // for chats or content-specific info
    tags: [String],           // for notes
    source: String,           // e.g., "uploaded-pdf", "chat-convo"
    highlighted: Boolean,     // for pinned or favorite notes
  },

  inputContent: mongoose.Schema.Types.Mixed, // Original input (text, code, etc.)
  data: mongoose.Schema.Types.Mixed, // The actual generated content

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GeneratedContent", generatedContentSchema);
