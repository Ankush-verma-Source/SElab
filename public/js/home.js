function filterFeatures() {
  const searchTerm = document.getElementById("tab-search").value.toLowerCase();
  const featureGridCards = document.querySelectorAll(
    "#features-main .feature-card"
  );

  featureGridCards.forEach((card) => {
    const title = card
      .querySelector(".feature-title")
      .textContent.toLowerCase();
    card.style.display = title.includes(searchTerm) ? "flex" : "none";
  });
}

function openTab(evt, tabId) {
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.classList.remove("active");
  });
  document
    .querySelectorAll(".content-section > .feature-card")
    .forEach((tab) => {
      tab.classList.add("hidden");
    });
  document.getElementById(tabId).classList.remove("hidden");
  evt.currentTarget.classList.add("active");
}

// File upload handling
function handleFileSelect() {
  const fileInput = document.getElementById("file-upload");
  const fileDetails = document.getElementById("file-details");
  const dropText = document.getElementById("drop-text");
  // const generateBtn = document.getElementById("generate-btn");

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    fileDetails.innerHTML = `
                    <p><strong>File:</strong> ${file.name}</p>
                    <p><strong>Size:</strong> ${(file.size / 1024).toFixed(
                      2
                    )} KB</p>
                    <p><strong>Type:</strong> ${
                      file.type || file.name.split(".").pop().toUpperCase()
                    }</p>
                `;
    fileDetails.classList.remove("hidden");
    dropText.classList.add("hidden");
    // generateBtn.disabled = false;
  }
}
function handleFileDrop(evt) {
  evt.preventDefault();
  document.getElementById("drop-area").classList.remove("dragover");

  const fileInput = document.getElementById("file-upload");
  fileInput.files = evt.dataTransfer.files;
  handleFileSelect();
}

function resetForm() {
  // alert("Reset button clicked");
  document.getElementById("file-upload").value = "";
  document.getElementById("file-details").classList.add("hidden");
  document.getElementById("drop-text").classList.remove("hidden");

  //         // Reset number of questions
  // document.getElementById("question-count").value = 5;

  // // Reset difficulty level
  // document.getElementById("difficulty").value = "medium";

  // document.getElementById("generate-btn").disabled = true;
}




function generateMCQs() {
  const fileInput = document.getElementById("file-upload");
  if (!fileInput.files.length) {
    alert("Please select a file first");
    return;
  }

  const questionCount = document.getElementById("question-count").value;
  const difficulty = document.getElementById("difficulty").value;

  // In a real app, you would send this to your backend
  confirm(
    `Generating ${questionCount} ${difficulty} level MCQs from selected file`
  );
  return;
  // Here you would typically show a loading state
  // and then display the generated MCQs
}



// for summary :
function handleFileSelectSummary() {
  const fileInput = document.getElementById("file-upload-summary");
  const fileDetails = document.getElementById("file-details-summary");
  const dropText = document.getElementById("drop-text-summary");
  // const generateBtn = document.getElementById("generate-btn-summary");

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    fileDetails.innerHTML = `
                    <p><strong>File:</strong> ${file.name}</p>
                    <p><strong>Size:</strong> ${(file.size / 1024).toFixed(
                      2
                    )} KB</p>
                    <p><strong>Type:</strong> ${
                      file.type || file.name.split(".").pop().toUpperCase()
                    }</p>
                `;
    fileDetails.classList.remove("hidden");
    dropText.classList.add("hidden");
    // generateBtn.disabled = false;
  }
}
function handleFileDropSummary(evt) {
  evt.preventDefault();
  document.getElementById("drop-area-summary").classList.remove("dragover");

  const fileInput = document.getElementById("file-upload-summary");
  fileInput.files = evt.dataTransfer.files;
  handleFileSelectSummary();
}
function resetFormSummary() {
  // alert("Reset button clicked");
  document.getElementById("file-upload-summary").value = "";
  document.getElementById("file-details-summary").classList.add("hidden");
  document.getElementById("drop-text-summary").classList.remove("hidden");
}

function generateSummary() {
  const fileInput = document.getElementById("file-upload-summary");
  if (!fileInput.files.length) {
    alert("Please select a file first");
    return;
  }

  const summaryLength = document.getElementById("summary-length").value;

  // In a real app, you would send this to your backend
  confirm(
    `Generating ${summaryLength} Length of Summary from selected file`
  );
  return;
  // Here you would typically show a loading state
  // and then display the generated MCQs
}




// for Quiz :
function handleFileSelectQuiz() {
  const fileInput = document.getElementById("file-upload-quiz");
  const fileDetails = document.getElementById("file-details-quiz");
  const dropText = document.getElementById("drop-text-quiz");
  // const generateBtn = document.getElementById("generate-btn");

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    fileDetails.innerHTML = `
                    <p><strong>File:</strong> ${file.name}</p>
                    <p><strong>Size:</strong> ${(file.size / 1024).toFixed(
                      2
                    )} KB</p>
                    <p><strong>Type:</strong> ${
                      file.type || file.name.split(".").pop().toUpperCase()
                    }</p>
                `;
    fileDetails.classList.remove("hidden");
    dropText.classList.add("hidden");
    // generateBtn.disabled = false;
  }
}
function handleFileDropQuiz(evt) {
  evt.preventDefault();
  document.getElementById("drop-area-quiz").classList.remove("dragover");

  const fileInput = document.getElementById("file-upload-quiz");
  fileInput.files = evt.dataTransfer.files;
  handleFileSelectQuiz();
}
function resetFormQuiz() {
  // alert("Reset button clicked");
  document.getElementById("file-upload-quiz").value = "";
  document.getElementById("file-details-quiz").classList.add("hidden");
  document.getElementById("drop-text-quiz").classList.remove("hidden");
}

function generateQuiz() {
  const fileInput = document.getElementById("file-upload-quiz");
  if (!fileInput.files.length) {
    alert("Please select a file first");
    return;
  }

  const quizType = document.getElementById("quiz-type").value;

  // In a real app, you would send this to your backend
  confirm(
    `Generating ${quizType} Quiz from selected file`
  );
  return;
  // Here you would typically show a loading state
  // and then display the generated MCQs
}





// Initialize - same as window.onload
document.addEventListener("DOMContentLoaded", () => {
  resetForm();

  // Allow multiple tabs to have pointer events for drag/drop
  document.querySelectorAll(".drop-area").forEach((area) => {
    area.addEventListener("dragover", (e) => {
      e.preventDefault();
      area.classList.add("dragover");
    });

    area.addEventListener("dragleave", () => {
      area.classList.remove("dragover");
    });
  });


  
// --- 2️⃣ Global Model Selector Logic ---
  const globalModelSelect = document.getElementById("global-model");

  // 🧠 Restore saved model (from localStorage, if any)
  const savedModel = localStorage.getItem("selectedModel");
  if (savedModel && globalModelSelect) {
    globalModelSelect.value = savedModel;
  }

  // 💾 Save model to localStorage whenever user changes it
  if (globalModelSelect) {
    globalModelSelect.addEventListener("change", () => {
      localStorage.setItem("selectedModel", globalModelSelect.value);
      console.log(`✅ Model changed to: ${globalModelSelect.value}`);
    });
  }

  // --- 3️⃣ Attach Model Value to Every Generation Form ---
  const forms = document.querySelectorAll("form[id^='generate-form']");

  forms.forEach((form) => {
    form.addEventListener("submit", function () {
      // Remove any previously added hidden 'model' input
      const existing = form.querySelector("input[name='model']");
      if (existing) existing.remove();

      // Create and attach a new hidden input with model value
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "model";

      // Fallback in case selector is missing
      const selectedModel = globalModelSelect
        ? globalModelSelect.value
        : "gemini-1.5-flash";
      hiddenInput.value = selectedModel;
      form.appendChild(hiddenInput);

      console.log(`🚀 Submitting form '${form.id}' with model: ${selectedModel}`);
    });
  });

  // --- 4️⃣ Utility: Reset Form UI (your existing logic) ---
  function resetForm() {
    document.querySelectorAll(".output-section").forEach((section) => {
      section.style.display = "none";
    });
    document.querySelectorAll(".input-section").forEach((section) => {
      section.style.display = "block";
    });
    document.querySelectorAll("textarea").forEach((txt) => (txt.value = ""));
  }



});







// ------------------ For Code Explanation & Review ------------------
function handleFileSelectCode() {
  console.log("File selected ");
  const fileInput = document.getElementById("file-upload-code");
  const fileDetails = document.getElementById("file-details-code");
  const dropText = document.getElementById("drop-text-code");

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    fileDetails.innerHTML = `
      <p><strong>File:</strong> ${file.name}</p>
      <p><strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
      <p><strong>Type:</strong> ${file.type || file.name.split(".").pop().toUpperCase()}</p>
    `;
    fileDetails.classList.remove("hidden");
    dropText.classList.add("hidden");
  }
}

function handleFileDropCode(evt) {
  evt.preventDefault();
  document.getElementById("drop-area-code").classList.remove("dragover");
  const fileInput = document.getElementById("file-upload-code");
  // console.log("File dropped ");
  fileInput.files = evt.dataTransfer.files;
  handleFileSelectCode();
}

function resetFormCode() {
  document.getElementById("file-upload-code").value = "";
  document.getElementById("file-details-code").classList.add("hidden");
  document.getElementById("drop-text-code").classList.remove("hidden");
  document.getElementById("code-input").value = "";
}

function analyzeCode() {
  const fileInput = document.getElementById("file-upload-code");
  const codeInput = document.getElementById("code-input");
  const operation = document.getElementById("operation").value;

  // ✅ Validation
  if (!fileInput.files.length && !codeInput.value.trim()) {
    alert("Please upload a file or paste some code first!");
    return;
  }

  // ✅ Confirm what user wants to do
  confirm(`Performing '${operation}' operation on provided code.`);
}











// ------------------ Flashcard Feature ------------------

// Handle file selection via input
function handleFileSelectFlashcard() {
  const fileInput = document.getElementById("file-upload-flashcard");
  const fileDetails = document.getElementById("file-details-flashcard");
  const dropText = document.getElementById("drop-text-flashcard");

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    fileDetails.innerHTML = `
      <p><strong>File:</strong> ${file.name}</p>
      <p><strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
      <p><strong>Type:</strong> ${file.type || file.name.split(".").pop().toUpperCase()}</p>
    `;
    fileDetails.classList.remove("hidden");
    dropText.classList.add("hidden");
  }
}

// Handle file drop via drag & drop
function handleFileDropFlashcard(evt) {
  evt.preventDefault();
  const dropArea = document.getElementById("drop-area-flashcard");
  dropArea.classList.remove("dragover");

  const fileInput = document.getElementById("file-upload-flashcard");
  fileInput.files = evt.dataTransfer.files;
  handleFileSelectFlashcard();
}

// Reset Flashcard form
function resetFormFlashcard() {
  document.getElementById("file-upload-flashcard").value = "";
  document.getElementById("file-details-flashcard").classList.add("hidden");
  document.getElementById("drop-text-flashcard").classList.remove("hidden");
  document.getElementById("flashcard-difficulty").value = "intermediate";
}

// Generate Flashcards (with confirmation)
function generateFlashcards(event) {
  if (event) event.preventDefault(); // Prevent default form submission

  const fileInput = document.getElementById("file-upload-flashcard");
  if (!fileInput.files.length) {
    alert("Please select a file first");
    return;
  }

  const difficulty = document.getElementById("flashcard-difficulty").value;

  // Optional: attach global model if you have one
  const globalModelSelect = document.getElementById("global-model");
  const selectedModel = globalModelSelect ? globalModelSelect.value : "gemini-1.5-flash";

  const confirmed = confirm(
    `Generating ${difficulty} flashcards using model: ${selectedModel}`
  );

  if (confirmed) {
    // Submit the form after confirmation
    document.getElementById("flashcard-form").submit();
  }
}

// Initialize Flashcard drag & drop
document.addEventListener("DOMContentLoaded", () => {
  const dropArea = document.getElementById("drop-area-flashcard");

  if (dropArea) {
    dropArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropArea.classList.add("dragover");
    });

    dropArea.addEventListener("dragleave", () => {
      dropArea.classList.remove("dragover");
    });

    dropArea.addEventListener("drop", handleFileDropFlashcard);
  }
});
