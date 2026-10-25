// Portfolio AI Assistant - Grounded Chatbot with Groq API & Offline Fallback Engine
// Personalized for Krishna Kanwar (Roll No: 25BCON1347)

const chatInput = document.getElementById("userInput");
const chatButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");
const chatStatus = document.getElementById("chatStatus");
const apiKeyBtn = document.getElementById("apiKeyModalBtn");

// Portfolio Grounding Knowledge Base
const PORTFOLIO_DATA = {
  name: "Krishna Kanwar",
  role: "AI & Machine Learning Undergraduate (Roll No: 25BCON1347)",
  about: "Undergraduate Computer Science student at Jaipur, India, specializing in Artificial Intelligence and Machine Learning, with a strong focus on building intelligent multi-agent workflows, Python automation, and data-driven solutions.",
  email: "krishnakanwar1347@gmail.com",
  github: "https://github.com/krishnakanwar-1347",
  livePortfolio: "https://portfolio-wexa.vercel.app/",
  skills: [
    "Python", "C++", "C", "Agentic AI", "Data Structures & Algorithms (DSA)",
    "HTML5", "CSS3", "JavaScript", "Git & GitHub", "Vercel Deployment", "REST APIs"
  ],
  projects: [
    {
      title: "Python Programs Collection",
      summary: "Collection of core algorithmic problems including Fibonacci Sequence Optimizer (using Memoization, Tabulation, Matrix Exponentiation), Factorial & Large Number Analyzer (handling large integer overflows via custom array logic), and Struct-to-Dict Serialization Utility.",
      github: "https://github.com/jayeshparihar08-max/python-basics-25BCON1347-fibonacci",
      links: [
        { name: "Fibonacci Repo", url: "https://github.com/jayeshparihar08-max/python-basics-25BCON1347-fibonacci" },
        { name: "Factorial Repo", url: "https://github.com/jayeshparihar08-max/pyhton-basics-25BCON1347-factorial" },
        { name: "Struct-to-Dict Repo", url: "https://github.com/jayeshparihar08-max/python-basics-25BCON1347-struct-to-dict" }
      ],
      tech: "Python 3, Dynamic Programming, Data Serialization, Algorithms"
    },
    {
      title: "Messy Python Code Improvement",
      summary: "Automated code-quality refactoring tool that transforms unstructured, poorly formatted, or messy Python code into clean, PEP 8-compliant code using Python's Abstract Syntax Tree (AST) parsing and regex.",
      github: "https://github.com/jayeshparihar08-max/messy-python-code",
      tech: "Python, AST Parsing, PEP 8, Regular Expressions, Cursor AI"
    },
    {
      title: "Bug Fixing Using Cursor AI",
      summary: "Diagnosed syntax errors, off-by-one boundary bugs, and logic flaws in student grading scripts. Identified root causes from tracebacks and corrected them using Cursor AI assistance.",
      github: "https://github.com/jayeshparihar08-max/correcting-grade-25BCON1071-main",
      tech: "Python, Debugging, Traceback Analysis, Cursor AI"
    },
    {
      title: "Interactive Quiz Application",
      summary: "Interactive web quiz platform developed in Lecture 10 featuring timed multiple-choice questions, live score tracking, instant feedback, and responsive layout.",
      github: "https://github.com/jayeshparihar08-max/QUIZ",
      live: "https://quiz-wexa.vercel.app",
      tech: "HTML5, CSS3, JavaScript (ES6), Vercel"
    },
    {
      title: "Book Reading List Application",
      summary: "Personal digital bookshelf application developed in Lecture 11. Allows users to catalog books, track reading status ('Want to Read', 'Currently Reading', 'Completed'), filter by genre, and persist state in localStorage.",
      github: "https://github.com/jayeshparihar08-max/reading_list",
      live: "https://reading-list-teal-zeta.vercel.app/",
      tech: "HTML5, CSS3, JavaScript, LocalStorage, Vercel"
    }
  ]
};

// Grounded System Prompt for Groq API
const SYSTEM_PROMPT = `You are the AI Assistant for Krishna Kanwar's personal portfolio website.
Answer questions accurately, professionally, and concisely (under 75 words) grounded ONLY in the following student portfolio details:

- Student: ${PORTFOLIO_DATA.name} (${PORTFOLIO_DATA.role})
- Location: Jaipur, India
- Email: ${PORTFOLIO_DATA.email}
- GitHub: ${PORTFOLIO_DATA.github}
- Skills: ${PORTFOLIO_DATA.skills.join(", ")}
- Projects Completed:
  1. Python Programs Collection (Fibonacci DP Optimizer, Factorial Large Number Analyzer, Struct-to-Dict Converter).
  2. Messy Python Code Improvement (PEP-8 refactoring with AST parsing).
  3. Bug Fixing Using Cursor AI (Diagnosing & resolving traceback errors in grading program).
  4. Interactive Quiz Application (Lecture 10 web quiz, live on Vercel at https://quiz-wexa.vercel.app).
  5. Book Reading List Application (Lecture 11 library manager, live on Vercel at https://reading-list-teal-zeta.vercel.app/).
- Weather App: OpenWeatherMap integration from Lecture 9.

Always give accurate answers for questions like:
1. Who are you? -> Introduce Krishna Kanwar, AI/ML student at Jaipur (Roll No: 25BCON1347).
2. What are your skills? -> List C++, Python, Agentic AI, DSA, Web Dev, etc.
3. What projects have you completed? -> List the 5 completed projects above.
4. Explain your Python programs. -> Detail Fibonacci DP, Factorial, Struct-to-Dict.
5. What was corrected in the buggy code project? -> Detail the grading script bug fix using Cursor AI.
6. How does the reading list work? -> Explain cataloging books and status tracking with LocalStorage.
7. Where is your GitHub? -> Provide ${PORTFOLIO_DATA.github}.

If asked about unrelated topics, politely guide the user back to Krishna's portfolio, skills, or projects.`;

// Retrieve active API Key from localStorage or config
function getActiveApiKey() {
  const localKey = localStorage.getItem("groq_api_key");
  if (localKey && localKey.trim()) return localKey.trim();
  if (typeof CONFIG !== "undefined" && CONFIG.apiKey && CONFIG.apiKey !== "YOUR_PRIVATE_GROQ_KEY") {
    return CONFIG.apiKey.trim();
  }
  return "";
}

// Display chat message in UI
function showChatMessage(role, text, tag = "") {
  const message = document.createElement("div");
  message.className = "chat-message " + (role === "user" ? "chat-user" : "chat-assistant");

  if (tag && role === "assistant") {
    const badge = document.createElement("span");
    badge.className = "chat-badge";
    badge.textContent = tag;
    message.appendChild(badge);
  }

  const content = document.createElement("div");
  content.className = "chat-text";
  content.innerHTML = text.replace(/\n/g, "<br>");
  message.appendChild(content);

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Grounded Rule-Based Engine (Guarantees accurate answers even without API key or when offline)
function getGroundedFallbackResponse(query) {
  const q = query.toLowerCase();

  if (q.includes("who are you") || q.includes("who is krishna") || q.includes("introduce") || q.includes("about you")) {
    return `Hello! I am the portfolio assistant for <strong>Krishna Kanwar</strong>, an undergraduate Computer Science student in Jaipur, India, specializing in AI & Machine Learning (Roll No: 25BCON1347). Krishna focuses on building intelligent multi-agent workflows, Python automation, and modern web applications.`;
  }

  if (q.includes("skill") || q.includes("tech stack") || q.includes("technologies") || q.includes("languages")) {
    return `Krishna's core skills include:
    <br>• <strong>Programming:</strong> Python, C++, C, JavaScript
    <br>• <strong>AI & Concepts:</strong> Agentic AI, Multi-Agent Workflows, Data Structures & Algorithms (DSA)
    <br>• <strong>Web & Tools:</strong> HTML5, CSS3, JavaScript, Git, GitHub, Vercel, REST APIs.`;
  }

  if (q.includes("what projects") || q.includes("projects have you completed") || q.includes("list projects") || q.includes("show projects")) {
    return `Krishna has completed five major projects:
    <br>1. <strong>Python Programs Collection</strong> (Fibonacci, Factorial, Struct-to-Dict)
    <br>2. <strong>Messy Python Code Improvement</strong> (AST refactoring to PEP 8)
    <br>3. <strong>Bug Fixing Using Cursor AI</strong> (Grading script diagnosis)
    <br>4. <strong>Interactive Quiz Application</strong> (Lecture 10 web app)
    <br>5. <strong>Book Reading List Application</strong> (Lecture 11 digital bookshelf).`;
  }

  if (q.includes("python program") || q.includes("fibonacci") || q.includes("factorial") || q.includes("struct")) {
    return `Krishna's <strong>Python Programs Collection</strong> covers three advanced implementations:
    <br>• <strong>Fibonacci Optimizer:</strong> Explores Memoization (Top-Down DP), Tabulation, and Matrix Exponentiation.
    <br>• <strong>Factorial Analyzer:</strong> Handles large integer overflows with iterative paradigms and custom array multiplication.
    <br>• <strong>Struct-to-Dict Utility:</strong> Seamlessly converts custom Python objects/dataclasses into dictionaries and JSON.`;
  }

  if (q.includes("bug") || q.includes("correcting") || q.includes("cursor") || q.includes("grade")) {
    return `In the <strong>Bug Fixing Using Cursor AI</strong> project, Krishna identified an incorrect student grading script containing syntax errors and off-by-one logic flaws. Using Cursor AI's traceback diagnostics, the root bugs were isolated, fixed, and verified with comprehensive test assertions.`;
  }

  if (q.includes("reading list") || q.includes("book") || q.includes("library")) {
    return `The <strong>Book Reading List Application</strong> (Lecture 11) is a web application where users can catalog books, track status (Want to Read, Currently Reading, Completed), filter by genre, and persist state in LocalStorage. It is deployed live on Vercel at <a href="https://reading-list-teal-zeta.vercel.app/" target="_blank">reading-list-teal-zeta.vercel.app</a>.`;
  }

  if (q.includes("quiz")) {
    return `The <strong>Interactive Quiz Application</strong> (Lecture 10) is a web-based quiz platform featuring interactive multiple-choice questions, real-time scoring, and dynamic DOM manipulation. You can try it live at <a href="https://quiz-wexa.vercel.app" target="_blank">quiz-wexa.vercel.app</a>.`;
  }

  if (q.includes("messy") || q.includes("refactor") || q.includes("ast")) {
    return `The <strong>Messy Python Code Improvement</strong> project uses Python's Abstract Syntax Tree (AST) parsing and regular expressions to automatically clean unstructured code, fix indentation, remove dead code/unused imports, and enforce PEP 8 standards.`;
  }

  if (q.includes("github") || q.includes("repo") || q.includes("code")) {
    return `You can explore Krishna's repositories on GitHub at: <a href="https://github.com/krishnakanwar-1347" target="_blank">github.com/krishnakanwar-1347</a>.`;
  }

  if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("reach")) {
    return `You can contact Krishna directly via email at <a href="mailto:krishnakanwar1347@gmail.com">krishnakanwar1347@gmail.com</a> or connect on <a href="https://github.com/krishnakanwar-1347" target="_blank">GitHub</a>.`;
  }

  if (q.includes("weather")) {
    return `The portfolio includes a live <strong>Weather Widget</strong> (from Lecture 9) that fetches real-time city temperature and atmospheric conditions via the OpenWeatherMap API.`;
  }

  // Default response
  return `I am Krishna Kanwar's portfolio assistant. I can answer questions about Krishna's educational background, her technical skills in Python, AI & Web development, her 5 completed projects (Python Collection, Messy Code Cleaner, Bug Fixing, Quiz App, Reading List), and her GitHub repositories.`;
}

// Send chat message
async function sendChatMessage(customText = null) {
  const question = typeof customText === "string" ? customText.trim() : chatInput.value.trim();
  if (!question) return;

  showChatMessage("user", question);
  chatInput.value = "";
  chatButton.disabled = true;
  chatStatus.textContent = "AI is thinking...";

  const apiKey = getActiveApiKey();
  let answered = false;

  // 1. Try Vercel Serverless Function first (if deployed on Vercel)
  if (window.location.protocol.startsWith("http")) {
    try {
      const vercelRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: question }
          ],
          apiKey: apiKey || undefined,
          model: (typeof CONFIG !== "undefined" && CONFIG.model) ? CONFIG.model : "openai/gpt-oss-20b"
        })
      });

      if (vercelRes.ok) {
        const data = await vercelRes.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply && reply.trim()) {
          showChatMessage("assistant", reply, "Live Groq AI");
          answered = true;
        }
      }
    } catch (e) {
      // Vercel serverless not reachable
    }
  }

  // 2. Try direct Groq API call if API key exists and not yet answered
  if (!answered && apiKey) {
    try {
      const model = (typeof CONFIG !== "undefined" && CONFIG.model) ? CONFIG.model : "openai/gpt-oss-20b";
      const baseUrl = (typeof CONFIG !== "undefined" && CONFIG.baseUrl) ? CONFIG.baseUrl : "https://api.groq.com/openai/v1";

      const response = await fetch(baseUrl.replace(/\/$/, "") + "/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey
        },
        body: JSON.stringify({
          model: model,
          temperature: 0.7,
          max_tokens: 250,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: question }
          ]
        })
      });

      if (response.status === 429) {
        throw new Error("RATE_LIMIT");
      }

      if (response.status === 401) {
        throw new Error("INVALID_KEY");
      }

      if (!response.ok) {
        throw new Error("API_ERROR_" + response.status);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;

      if (reply && reply.trim()) {
        showChatMessage("assistant", reply, "Groq AI (" + model + ")");
        answered = true;
      }
    } catch (err) {
      console.warn("Direct Groq API notice:", err.message);
      if (err.message === "RATE_LIMIT") {
        chatStatus.textContent = "Rate limit reached. Answering from local portfolio knowledge base...";
      } else if (err.message === "INVALID_KEY") {
        chatStatus.textContent = "Provided API key is invalid/revoked. Answering from grounded portfolio knowledge base...";
      }
    }
  }

  // 3. Grounded Fallback Engine
  if (!answered) {
    const groundedAnswer = getGroundedFallbackResponse(question);
    const tag = apiKey ? "Grounded Knowledge" : "Portfolio Knowledge Engine";
    showChatMessage("assistant", groundedAnswer, tag);
  }

  chatButton.disabled = false;
  chatStatus.textContent = "";
}

// Handle question chips
document.querySelectorAll(".question-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const prompt = chip.getAttribute("data-prompt") || chip.textContent;
    sendChatMessage(prompt);
  });
});

// Configure API Key Modal / LocalStorage
if (apiKeyBtn) {
  apiKeyBtn.addEventListener("click", () => {
    const existingKey = localStorage.getItem("groq_api_key") || "";
    const newKey = prompt(
      "Enter your Groq API Key (gsk_...) for live AI responses.\n" +
      "This is stored ONLY in your browser localStorage and never pushed to GitHub.\n" +
      "Leave blank to use the offline Portfolio Knowledge Engine.",
      existingKey
    );

    if (newKey !== null) {
      if (newKey.trim()) {
        localStorage.setItem("groq_api_key", newKey.trim());
        alert("Groq API Key saved successfully in local storage! The chatbot will now use live Groq AI.");
      } else {
        localStorage.removeItem("groq_api_key");
        alert("API key removed. Chatbot will use the grounded Portfolio Knowledge Engine.");
      }
    }
  });
}

// Clear Chat functionality
const clearChatBtn = document.getElementById("clearChatBtn");
if (clearChatBtn) {
  clearChatBtn.addEventListener("click", () => {
    chatMessages.innerHTML = "";
    showChatMessage(
      "assistant",
      "Hello! I am Krishna Kanwar's AI assistant. Ask me anything about Krishna's skills, her 5 projects, or her GitHub repositories!"
    );
  });
}

// Event Listeners
chatButton.addEventListener("click", () => sendChatMessage());
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendChatMessage();
  }
});

// Initialize greeting on load
window.addEventListener("DOMContentLoaded", () => {
  if (chatMessages && chatMessages.children.length === 0) {
    showChatMessage(
      "assistant",
      "Hello! I am <strong>Krishna Kanwar</strong>'s AI Portfolio Assistant. You can ask me questions such as: <em>'Who are you?'</em>, <em>'What are your skills?'</em>, <em>'What projects have you completed?'</em>, or <em>'Where is your GitHub?'</em>."
    );
  }
});