// gemini api setup :
let { GoogleGenAI, createPartFromUri } = require("@google/genai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const axios = require("axios");




async function generateMCQs(fileElement, questCount, difficulty, model) {
  const pdfBuffer = await fetch(fileElement.path).then((response) =>
    response.arrayBuffer()
  );

  const fileBlob = new Blob([pdfBuffer], { type: "application/pdf" });

  const file = await ai.files.upload({
    file: fileBlob,
    config: {
      displayName: "A17_FlightPlan.pdf",
    },
  });

  // Wait for the file to be processed.
  let getFile = await ai.files.get({ name: file.name });
  while (getFile.state === "PROCESSING") {
    getFile = await ai.files.get({ name: file.name });
    console.log(`current file status: ${getFile.state}`);
    console.log("File is still processing, retrying in 5 seconds");

    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
  }
  if (file.state === "FAILED") {
    throw new Error("File processing failed.");
  }

  // Add the file to the contents.
  const content = [
    ` You are an AI assistant helping the user generate multiple-choice questions (MCQs) based on the text in the provided document:
                        Please generate ${questCount} MCQs of ${difficulty} difficulty level of MCQs from the text. Each question should have:
                        - A clear question
                        - Four answer options (labeled A, B, C, D)
                        - The correct answer clearly indicated
                        Format:
                        Return the MCQs as a JSON array of objects, where each object has:
                        - "question": the question text
                        - "options": an array of four options (A, B, C, D)
                        - "correct": the correct option letter ("A", "B", "C", or "D")

                        Example:
                        [
                        {
                            question: "What was young Emma's dream?",
                            options: [
                            'A. To become a dancer',
                            'B. To become a writer',
                            'C. To become a painter',
                            'D. To become a singer'
                            ],
                            correct: 'B'
                        }
                        ...
                        ]
                        NOTE: "Return without any code block or explanation." `,
  ];

  if (file.uri && file.mimeType) {
    const fileContent = createPartFromUri(file.uri, file.mimeType);
    content.push(fileContent);
  }

  if (model == "gemini-2.5-flash") {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
    });
    return response.text;
  } else if (model == "gemini-2.5-pro") {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: content,
    });
    let cleanedResponse = response.text
      .replace(/```json/g, "") // remove ```json
      .replace(/```/g, "") // remove remaining ```
      .trim(); // remove leading/trailing whitespace

    return cleanedResponse;
  }
}

async function generateSummary(fileElement, summaryLength, model) {
  const pdfBuffer = await fetch(fileElement.path).then((response) =>
    response.arrayBuffer()
  );

  const fileBlob = new Blob([pdfBuffer], { type: "application/pdf" });

  const file = await ai.files.upload({
    file: fileBlob,
    config: {
      displayName: "A17_FlightPlan.pdf",
    },
  });

  // Wait for the file to be processed.
  let getFile = await ai.files.get({ name: file.name });
  while (getFile.state === "PROCESSING") {
    getFile = await ai.files.get({ name: file.name });
    console.log(`current file status: ${getFile.state}`);
    console.log("File is still processing, retrying in 5 seconds");

    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
  }
  if (file.state === "FAILED") {
    throw new Error("File processing failed.");
  }

  // Add the file to the contents.
  const content = [
    `You are an AI assistant helping the user generate a summary based on the text in the provided document.

  Please generate a ${summaryLength} summary of the content. The summary should be:
  - Clear and concise
  - Grammatically correct
  - Well-structured

  Summary length: ${summaryLength} (e.g., short = 2-3 paragraphs, medium = 4-5 paragraphs, Long = 6+ paragraphs)

  Format:
  Return the summary as plain text only.

`,
  ];

  if (file.uri && file.mimeType) {
    const fileContent = createPartFromUri(file.uri, file.mimeType);
    content.push(fileContent);
  }

  if (model == "gemini-2.5-flash") {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
    });
    return response.text;
  } else if (model == "gemini-2.5-pro") {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: content,
    });
    let cleanedResponse = response.text
      .replace(/```json/g, "") // remove ```json
      .replace(/```/g, "") // remove remaining ```
      .trim(); // remove leading/trailing whitespace

    return cleanedResponse;
  }
}

async function generateQuiz(fileElement, quizType, model) {
  const pdfBuffer = await fetch(fileElement.path).then((response) =>
    response.arrayBuffer()
  );

  const fileBlob = new Blob([pdfBuffer], { type: "application/pdf" });

  const file = await ai.files.upload({
    file: fileBlob,
    config: {
      displayName: "A17_FlightPlan.pdf",
    },
  });

  // Wait for the file to be processed.
  let getFile = await ai.files.get({ name: file.name });
  while (getFile.state === "PROCESSING") {
    getFile = await ai.files.get({ name: file.name });
    console.log(`current file status: ${getFile.state}`);
    console.log("File is still processing, retrying in 5 seconds");

    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
  }
  if (file.state === "FAILED") {
    throw new Error("File processing failed.");
  }

  // Add the file to the contents.
  const content = [
    `You are an AI assistant helping a user generate a quiz based on the content of the provided document.

  The user has requested a "${quizType}" quiz. Please follow these instructions:

  ---
  ✅ Quiz Type: ${quizType}

  • If "multiple-choice":
      - Generate 4-option MCQs.
      - Each question must include:
        - A clear question
        - Four answer choices labeled A, B, C, D
        - The correct option indicated as a single letter ("A", "B", "C", or "D")

  • If "true-false":
      - Generate questions with a statement and the correct answer as "True" or "False".

  • If "short-answer":
      - Generate direct short-answer questions.
      - Each question should include a concise correct answer (1-2 lines).

  • If "mix":
      - Generate a variety of all the above types (multiple-choice, true/false, short-answer).
      - Clearly identify the type of each question in the response.

  ---
  ✅ Format:
  Return the questions as a JSON array of objects. Each object should have:

  - "type": "multiple-choice" | "true-false" | "short-answer"
  - "question": the question text
  - For multiple-choice:
    - "options": array of options (A–D)
    - "correct": correct option letter
  - For true-false:
    - "correct": "True" or "False"
  - For short-answer:
    - "correct": string (short answer)

  Example output:
  [
    {
      "type": "multiple-choice",
      "question": "What is the capital of France?",
      "options": ["Paris", "London", "Berlin", "Madrid"],
      "correct": "A"
    },
    {
      "type": "true-false",
      "question": "The sun rises in the west.",
      "correct": "False"
    },
    {
      "type": "short-answer",
      "question": "Who developed the theory of relativity?",
      "correct": "Albert Einstein"
    }
  ]
     NOTE:Return only valid JSON. Do not wrap in backticks or any other formatting.
`,
  ];

  if (file.uri && file.mimeType) {
    const fileContent = createPartFromUri(file.uri, file.mimeType);
    content.push(fileContent);
  }

  if (model == "gemini-2.5-flash") {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: content,
    });
    return response.text;
  } else if (model == "gemini-2.5-pro") {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: content,
    });
    let cleanedResponse = response.text
      .replace(/```json/g, "") // remove ```json
      .replace(/```/g, "") // remove remaining ```
      .trim(); // remove leading/trailing whitespace

    return cleanedResponse;
  }
}

// apicall.js
const fs = require("fs");
async function explainCode(
  fileElement,
  pastedCode,
  model = "gemini-2.5-flash"
) {
  let codeContent = "";

  if (fileElement) {
    codeContent = fs.readFileSync(fileElement.path, "utf-8");
  } else if (pastedCode && pastedCode.trim() !== "") {
    codeContent = pastedCode;
  } else {
    throw new Error("No code input provided");
  }

  const content = [
    `You are a helpful AI code explainer that clearly describes how code works in a way that any student or beginner can understand.
Explain the code in a structured, simple, and human-friendly manner — no markdown, no symbols, no technical jargon beyond what is necessary.
Always return the result STRICTLY as clean JSON (without extra text or symbols) in the following format:

{
  "summary": "A clear, short overview describing what the entire code does in plain English.",
  "functions": [
    {
      "name": "Name of the function or main block",
      "description": "Step-by-step explanation of what this function does, how it works, and why.",
      "correctness": "Explain whether the logic is correct, and describe how it ensures correctness or what it might miss.",
      "potentialIssues": [
        "Mention any issues, edge cases, or possible logical errors in simple terms.",
        "If none found, say 'No significant issues found.'"
      ],
      "optimizations": [
        "Suggest ways to make the function more efficient, readable, or safer.",
        "If not needed, say 'The function is already well optimized.'"
      ]
    }
  ],
  "recommendations": [
    "Provide general recommendations for the overall code such as improving readability, adding comments, or enhancing error handling."
  ]
}

Now analyze and explain this code below clearly and in the above format:

${codeContent}`,
  ];

  const response = await ai.models.generateContent({
    model,
    contents: content,
  });

  // Clean up and safely parse response
  let text = response.text.trim();
  text = text
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  try {
    // return JSON.parse(text);
    return text;
  } catch (err) {
    console.error("Failed to parse explainCode JSON:", err);
    return { summary: text }; // fallback
  }
}

async function reviewCode(fileElement, pastedCode, model = "gemini-2.5-flash") {
  let codeContent = "";

  if (fileElement) {
    codeContent = fs.readFileSync(fileElement.path, "utf-8");
  } else if (pastedCode && pastedCode.trim() !== "") {
    codeContent = pastedCode;
  } else {
    throw new Error("No code input provided");
  }

  const content = [
    `You are an experienced code reviewer providing a clear, detailed, and helpful review for students or developers.
Your job is to evaluate the provided code, explain what it does, assess its quality, and suggest meaningful improvements.
Keep your language human-friendly — avoid symbols, bullet marks, or markdown.
Always respond STRICTLY as clean JSON with the following structure:

{
  "summary": "Brief overview of what the program does and how well it is written, in simple English.",
  "functions": [
    {
      "name": "Name of the function or section being reviewed",
      "description": "Explain what this part of the code does, its inputs, outputs, and purpose.",
      "correctness": "Describe if the code works correctly or if it might fail in some scenarios.",
      "potentialIssues": [
        "List potential problems, bugs, or poor practices in this function.",
        "If none found, say 'No major issues detected.'"
      ],
      "optimizations": [
        "Suggest performance, readability, or security improvements.",
        "If not needed, say 'This function is already efficient and well-structured.'"
      ]
    }
  ],
  "recommendations": [
    "List overall recommendations for better coding practices, structure, maintainability, and clarity."
  ]
}

Now review this code carefully and respond only with a valid JSON object in the above format:

${codeContent}`,
  ];

  const response = await ai.models.generateContent({
    model,
    contents: content,
  });

  let text = response.text.trim();
  text = text
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  try {
    // return JSON.parse(text);
    return text;
  } catch (err) {
    console.error("Failed to parse reviewCode JSON:", err);
    return { summary: text }; // fallback
  }
}





async function generateFlashcards(fileElement, difficulty, model = "gemini-2.5-flash") {
  try {
    const pdfBuffer = await fetch(fileElement.path).then((response) => response.arrayBuffer());
    const fileBlob = new Blob([pdfBuffer], { type: "application/pdf" });

    const file = await ai.files.upload({
      file: fileBlob,
      config: { displayName: "uploaded_document.pdf" },
    });

    // Wait for file processing
    let getFile = await ai.files.get({ name: file.name });
    while (getFile.state === "PROCESSING") {
      getFile = await ai.files.get({ name: file.name });
      console.log(`File is processing: ${getFile.state}`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    if (file.state === "FAILED") throw new Error("File processing failed.");

    const content = [
      `You are a flashcard generator AI.
       Generate flashcards from the given document.
       Difficulty level: ${difficulty}.
       Each flashcard should include:
       - "question": string
       - "answer": string

       Example output:
       [
         {"question": "What is AI?", "answer": "Artificial Intelligence."},
         {"question": "Define ML.", "answer": "Machine Learning."}
       ]

       Return only valid JSON — no markdown, no code blocks.`,
    ];

    if (file.uri && file.mimeType) {
      const fileContent = createPartFromUri(file.uri, file.mimeType);
      content.push(fileContent);
    }

    const response = await ai.models.generateContent({
      model,
      contents: content,
    });

    let text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return text;
  } catch (err) {
    console.error("❌ Error generating flashcards:", err);
    throw new Error("Flashcard generation failed.");
  }
}


// async function generateFlashcards(fileElement, difficulty, model = "gemini-2.5-flash") {
//   try {
//     // Fetch PDF content
//     const pdfBuffer = await fetch(fileElement.path).then(res => res.arrayBuffer());
//     const fileBlob = new Blob([pdfBuffer], { type: "application/pdf" });

//     // Upload PDF to Gemini AI
//     const file = await ai.files.upload({
//       file: fileBlob,
//       config: { displayName: "uploaded_document.pdf" },
//     });

//     // Wait for processing
//     let getFile = await ai.files.get({ name: file.name });
//     while (getFile.state === "PROCESSING") {
//       console.log(`File is processing: ${getFile.state}`);
//       await new Promise(resolve => setTimeout(resolve, 5000));
//       getFile = await ai.files.get({ name: file.name });
//     }
//     if (file.state === "FAILED") throw new Error("File processing failed.");

//     // Optimized prompt
//     const content = [
//       `You are an AI assistant generating educational flashcards from the provided document.
//       Generate concise flashcards in JSON format only. Do not include markdown, code blocks, or extra text.
//       Each flashcard must have:
//       - "question": a clear, concise question
//       - "answer": the correct answer
//       - "difficulty": "${difficulty}"
      
//       Return output strictly as a JSON array. Example:
//       [
//         {"question": "What is AI?", "answer": "Artificial Intelligence.", "difficulty": "easy"},
//         {"question": "Define ML.", "answer": "Machine Learning.", "difficulty": "medium"}
//       ]`
//     ];

//     if (file.uri && file.mimeType) {
//       const fileContent = createPartFromUri(file.uri, file.mimeType);
//       content.push(fileContent);
//     }

//     // Generate flashcards
//     const response = await ai.models.generateContent({
//       model,
//       contents: content,
//     });

//     // Clean response text
//     let text = response.text.replace(/```json/g, "").replace(/```/g, "").trim();

//     // Ensure valid JSON
//     try {
//       return JSON.parse(text);
//     } catch {
//       // fallback: return raw text
//       console.warn("Response is not valid JSON, returning raw text.");
//       return text;
//     }

//   } catch (err) {
//     console.error("❌ Error generating flashcards:", err);
//     throw new Error("Flashcard generation failed.");
//   }
// }



module.exports = {
  generateMCQs,
  generateSummary,
  generateQuiz,
  explainCode,
  reviewCode,
  generateFlashcards,
};
