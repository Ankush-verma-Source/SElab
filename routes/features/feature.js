const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../../util/expressError.js");
const wrapAsync = require("../../util/wrapAsync.js");
const User = require("../../models/User.js");
const { isLoggedIn } = require("../../middleware.js");
const axios = require("axios");
const {
  generateMCQs,
  generateSummary,
  generateQuiz,
  generateImages,
  explainCode,
  reviewCode,
  generateFlashcards,
} = require("../../apiCalls.js");
const multer = require("multer");
const { storage } = require("../../cloudinaryConfig.js");
const upload = multer({ storage });
const { v4: uuidv4 } = require("uuid");
const GeneratedContent = require("../../models/content.js");
const fs = require("fs");

router.post(
  "/mcq",
  isLoggedIn,
  upload.single("file"),
  wrapAsync(async (req, res) => {
    if (!req.file) {
      req.flash("error", "No file uploaded.");
      return res.redirect("/home");
    }

    // this will never work b/c error caught during uploadin of document due to configuration:
    const allowedExtensions = ["pdf", "doc", "docx", "txt"];
    const fileName = req.file.originalname;
    const extension = fileName.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      req.flash(
        "error",
        "Invalid file format. Only PDF, DOC, DOCX, or TXT files are allowed."
      );
      return res.redirect("/home");
    }

    let { questionCount, difficulty, model } = req.body;
    console.log(req.file);
    console.log(model);

    const user = await User.findById(req.user._id);
    const fileId = uuidv4();
    user.fileUrl.push({ path: req.file.path, fileId: fileId });
    const updatedUser = await user.save();

    console.log(updatedUser);

    for (const element of updatedUser.fileUrl) {
      if (element.fileId == fileId) {
        // let mcqs = await generateMCQs(element, questionCount, difficulty);
        // mcqs = JSON.parse(mcqs);
        // console.log(mcqs);

        let mcqs = await generateMCQs(
          element,
          questionCount,
          difficulty,
          model
        ); // ✅ pass model
        console.log(mcqs);
        if (mcqs.startsWith("```")) {
          mcqs = mcqs
            .replace(/^```json/, "")
            .replace(/^```/, "")
            .replace(/```$/, "")
            .trim();
        }
        mcqs = JSON.parse(mcqs);
        console.log(mcqs);

        let content = await GeneratedContent.create({
          user: req.user._id,
          type: "mcq",
          fileId: fileId,
          meta: {
            questionCount,
            difficulty,
            model,
          },
          data: mcqs,
        });
        console.log(content);
        return res.render("generate/mcq.ejs", { mcqs });
      }
    }
    req.flash("error", "File upload failed. Please try again.");
    return res.redirect("/home");
  })
);

// generate summary:
router.post(
  "/summary",
  isLoggedIn,
  upload.single("file"),
  wrapAsync(async (req, res) => {
    if (!req.file) {
      req.flash("error", "No file uploaded.");
      return res.redirect("/home");
    }

    let { summaryLength, model } = req.body;

    let user = await User.findById(req.user._id);
    let fileId = uuidv4();
    user.fileUrl.push({ path: req.file.path, fileId: fileId });
    let updatedUser = await user.save();

    console.log(updatedUser);
    console.log(req.body);

    for (let element of updatedUser.fileUrl) {
      if (element.fileId == fileId) {
        let generatedSummary = await generateSummary(
          element,
          summaryLength,
          model
        );
        console.log(generatedSummary);

        await GeneratedContent.create({
          user: req.user._id,
          type: "summary",
          fileId: fileId,
          meta: {
            summaryLength,
            model,
          },
          data: generatedSummary,
        });

        return res.render("generate/summary.ejs", {
          summary: generatedSummary,
        });
      }
    }
    req.flash("error", "File upload failed. Please try again.");
    return res.redirect("/home");
  })
);

// generate quiz:
router.post(
  "/quiz",
  isLoggedIn,
  upload.single("file"),
  wrapAsync(async (req, res) => {
    if (!req.file) {
      req.flash("error", "No file uploaded.");
      return res.redirect("/home");
    }

    let { quizType, model } = req.body;

    let user = await User.findById(req.user._id);
    let fileId = uuidv4();
    user.fileUrl.push({ path: req.file.path, fileId: fileId });
    let updatedUser = await user.save();

    console.log(updatedUser);

    for (let element of updatedUser.fileUrl) {
      if (element.fileId == fileId) {
        let generatedQuiz = await generateQuiz(element, quizType, model);

        if (typeof generatedQuiz === "string") {
          try {
            generatedQuiz = generatedQuiz.trim();

            // Remove ```json ... ```
            if (generatedQuiz.startsWith("```")) {
              generatedQuiz = generatedQuiz
                .replace(/^```json/, "")
                .replace(/^```/, "")
                .replace(/```$/, "")
                .trim();
            }
            generatedQuiz = JSON.parse(generatedQuiz);
          } catch (err) {
            console.error("Failed to parse quiz JSON", err);
            req.flash("error", "Invalid quiz format received.");
            return res.redirect("/home");
          }
        }

        await GeneratedContent.create({
          user: req.user._id,
          type: "quiz",
          fileId: fileId,
          meta: {
            quizType,
            model,
          },
          data: generatedQuiz,
        });

        return res.render("quiz.ejs", { quiz: generatedQuiz });
      }
    }
    req.flash("error", "File upload failed. Please try again.");
    return res.redirect("/home");
  })
);

// POST /user/generate/code-review
router.post(
  "/code-tools",
  isLoggedIn,
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("REQ FILE:", req.file);
      console.log("REQ BODY:", req.body);

      const operation = req.body.operation || "Explain Code"; // "Explain Code" or "Review Code"
      const pastedCode = req.body.codeText; // optional pasted code
      const model = req.body.model || "gemini-2.5-flash";

      let codeContent;
      let fileId;
      let user = await User.findById(req.user._id);
      // if (req.file) {
      //   fileId = uuidv4();
      //   user.fileUrl.push({ path: req.file.path, fileId });
      //   let updatedUser = await user.save();
      //   console.log(updatedUser);
      // }

      if (req.file) {
        // Uploaded file stored on Cloudinary → fetch its content
        fileId = uuidv4();
        user.fileUrl.push({ path: req.file.path, fileId });
        let updatedUser = await user.save();
        console.log(updatedUser);

        const fileUrl = req.file.path; // this is Cloudinary URL
        const response = await axios.get(fileUrl);
        codeContent = response.data; // file content as string

        console.log("paseted code:", pastedCode);
      } else if (pastedCode) {
        codeContent = pastedCode;
        console.log(codeContent);
      } else {
        req.flash("error", "Please upload a file or paste your code.");
        return res.redirect("/home");
      }

      // Call AI functions
      let aiResponse;
      if (operation.toLowerCase() === "explain") {
        aiResponse = await explainCode(null, codeContent, model);
      } else {
        aiResponse = await reviewCode(null, codeContent, model);
      }

      if (typeof aiResponse === "string") {
        try {
          aiResponse = JSON.parse(aiResponse);
          // console.log("PARSED AI RESPONSE:", aiResponse);
        } catch (err) {
          console.error("Failed to parse AI response:", err);
          req.flash("error", "AI returned invalid format.");
          return res.redirect("/home");
        }
      }

      // console.log("original content:", codeContent);
      // console.log("AI RESPONSE:", aiResponse);

      await GeneratedContent.create({
        user: req.user._id,
        type: operation.toLowerCase(),
        fileId: fileId ? fileId : "pasted-code",
        meta: {
          model,
        },
        inputContent: codeContent,
        data: aiResponse,
      });

      // Render result in EJS
      res.render("generate/result.ejs", {
        title:
          operation.toLowerCase() === "review"
            ? "Code Review"
            : "Code Explanation",
        input: codeContent,
        output: aiResponse,
      });
    } catch (err) {
      console.error("ERROR:", err);
      req.flash("error", "Error analyzing code. Please try again.");
      return res.redirect("/home");
    }
  }
);

// routes/user.js
router.post(
  "/flashcards",
  isLoggedIn,
  upload.single("file"),
  wrapAsync(async (req, res) => {
    if (!req.file) {
      req.flash("error", "No file uploaded.");
      return res.redirect("/home");
    }

    let { difficulty, model } = req.body;

    const user = await User.findById(req.user._id);
    const fileId = uuidv4();
    user.fileUrl.push({ path: req.file.path, fileId });
    const updatedUser = await user.save();

    console.log("Flashcard Upload User:", updatedUser);

    for (const element of updatedUser.fileUrl) {
      if (element.fileId === fileId) {
        // 🧠 Call the AI-based generator
        let flashcards = await generateFlashcards(element, difficulty, model);

        // Clean and parse AI response
        // if (flashcards.startsWith("```")) {
        //   flashcards = flashcards
        //     .replace(/^```json/, "")
        //     .replace(/^```/, "")
        //     .replace(/```$/, "")
        //     .trim();
        // }
        if (typeof flashcards === "string" && flashcards.startsWith("```")) {
          flashcards = flashcards
            .replace(/^```json/, "")
            .replace(/^```/, "")
            .replace(/```$/, "")
            .trim();
        }
        console.log("Raw Flashcards from AI:", flashcards);
        try {
          flashcards = JSON.parse(flashcards);
        } catch (err) {
          console.error("❌ Failed to parse flashcards JSON:", err);
          req.flash("error", "Invalid format from AI.");
          return res.redirect("/home");
        }

        // console.log("✅ Parsed Flashcards:", flashcards);
        // 💾 Save to database
        await GeneratedContent.create({
          user: req.user._id,
          type: "flashcards",
          fileId,
          meta: { difficulty, model },
          data: flashcards,
        });

        // 🎨 Render the result
        return res.render("generate/flashcards.ejs", {
          flashcards,
          difficulty,
        });
      }
    }

    req.flash("error", "File upload failed. Please try again.");
    return res.redirect("/home");
  })
);

module.exports = router;
