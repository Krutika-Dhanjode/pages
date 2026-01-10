/* ================= AUTH UI ================= */

const authButtons = document.getElementById("authButtons");
const userIcons = document.getElementById("userIcons");
const profileIcon = document.querySelector(".ico i.fa-user");

// Default login state
if (!localStorage.getItem("isLoggedIn")) {
  localStorage.setItem("isLoggedIn", "false");
}

function updateUI() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  authButtons.style.display = isLoggedIn ? "none" : "flex";
  userIcons.style.display = isLoggedIn ? "flex" : "none";
}

updateUI();

function loginSuccess() {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", "User");
  updateUI();
}

/* ================= PROFILE DROPDOWN ================= */

const dropdown = document.createElement("div");
dropdown.className = "profile-dropdown";
dropdown.innerHTML = `
  <div class="username"></div>
  <div class="logout">Logout</div>
`;
document.body.appendChild(dropdown);

profileIcon.addEventListener("click", (e) => {
  if (localStorage.getItem("isLoggedIn") !== "true") return;
  e.stopPropagation();

  const rect = profileIcon.getBoundingClientRect();
  dropdown.style.top = rect.bottom + 8 + "px";
  dropdown.style.left = rect.left - 80 + "px";

  dropdown.querySelector(".username").innerText =
    localStorage.getItem("username") || "User";

  dropdown.classList.toggle("show");
});

dropdown.querySelector(".logout").addEventListener("click", () => {
  localStorage.setItem("isLoggedIn", "false");
  localStorage.removeItem("username");
  dropdown.classList.remove("show");
  updateUI();
});

document.addEventListener("click", () => dropdown.classList.remove("show"));

/* ================= AI CHATBOT ================= */

// 🔑 FREE Hugging Face API Key
const HF_API_KEY = "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"; // <-- replace

const chatBtn = document.getElementById("ai-chat-button");
const chatWindow = document.getElementById("ai-chat-window");
const closeBtn = document.getElementById("close-ai");
const sendBtn = document.getElementById("ai-send-btn");
const input = document.getElementById("ai-input");
const messages = document.getElementById("ai-chat-messages");

// Open / Close chat
chatBtn.onclick = () => chatWindow.classList.toggle("ai-chat-closed");
closeBtn.onclick = () => chatWindow.classList.add("ai-chat-closed");

// MAIN AI FUNCTION
async function askGemini() {
  const text = input.value.trim();
  if (!text) return;

  messages.innerHTML += `<div class="user-msg">${text}</div>`;
  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch(
      "https://huggingface.co/api/inference-proxy/space/yuntian-deng-chatgpt",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            `Answer in short, impactful sentences (max 3).
Question: ${text}`
          ]
        })
      }
    );

    const data = await res.json();
    const aiText = data?.data?.[0] || "No response";

    messages.innerHTML += `<div class="ai-msg">${aiText}</div>`;
  } catch {
    messages.innerHTML += `<div class="ai-msg">Network error.</div>`;
  }

  messages.scrollTop = messages.scrollHeight;
}


// Send events
sendBtn.onclick = askGemini;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    askGemini();
  }
});
window.onload = () => {
  if (localStorage.getItem("loggedIn") === "true") {
    document.getElementById("authButtons").style.display = "none";
    document.getElementById("userIcons").style.display = "flex";
  }
};
