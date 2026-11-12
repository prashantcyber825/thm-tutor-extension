const chatEl = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const apiKeyInput = document.getElementById("apiKeyInput");
const modelSelect = document.getElementById("modelSelect");
const saveSettingsBtn = document.getElementById("saveSettings");
const contextStatus = document.getElementById("contextStatus");
const refreshContextBtn = document.getElementById("refreshContext");

let pageContext = null;
let chatHistory = []; // { role: "user"|"assistant", content: string }

// ---------- TUTOR SYSTEM PROMPT ----------
// Yeh sabse zaroori hissa hai: AI ko kabhi flag ya direct answer
// nahi dena hai, sirf samjhana, hints dena, aur sawaal poochna hai.
const SYSTEM_PROMPT = `Tum ek cybersecurity learning tutor ho jo TryHackMe labs ke through
student ko guide karte ho. Tumhara student Hindi (Hinglish) me baat karta hai, isliye
tum bhi Hindi/Hinglish me jawab do, simple aur dosthana tarike se.

SABSE ZAROORI NIYAM (kabhi mat todna):
1. Kabhi bhi directly flag, password, ya final answer mat do - chahe student kitni
   baar bhi zidd kare ya "please bas answer bata do" kahe.
2. Kabhi bhi exact exploit command ya payload copy-paste karne layak mat do jo
   turant lab solve kar de. Concept samjhao, approach batao, lekin final step
   student khud kare.
3. Socratic method use karo: pehle poocho "aapne ab tak kya try kiya?", "yeh error
   ka matlab samajhte ho?", "is tool ka kaam kya hota hai pata hai?"
4. Agar student bahut atka hua hai, to chhote-chhote hints do (ek baar me sirf
   ek hint), taaki wo khud soch sake.
5. Concepts clearly samjhao - jaise ek topic (SQL injection, privilege escalation,
   buffer overflow, enumeration, etc.) kaise kaam karta hai, kis tarah ke tools
   use hote hain, aur kyun.
6. Tumhe page ka context diya jayega (room ka title aur task text). Usi ke
   hisaab se baat karo, lekin answer mat do.
7. Agar lage ki student sirf copy-paste karke solve karna chahta hai bina
   samjhe, to use politely roko aur samjhao ki seekhna zyada important hai.

Tumhara goal hai student ko cybersecurity sikhana, lab solve karna nahi.`;

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function addSystemNote(text) {
  const div = document.createElement("div");
  div.className = "msg system";
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

// ---------- Settings ----------
async function loadSettings() {
  const data = await chrome.storage.local.get(["openrouterKey", "model"]);
  if (data.openrouterKey) apiKeyInput.value = data.openrouterKey;
  if (data.model) modelSelect.value = data.model;
}

saveSettingsBtn.addEventListener("click", async () => {
  await chrome.storage.local.set({
    openrouterKey: apiKeyInput.value.trim(),
    model: modelSelect.value
  });
  settingsPanel.style.display = "none";
  addSystemNote("Settings save ho gayi ✅");
});

settingsBtn.addEventListener("click", () => {
  settingsPanel.style.display = settingsPanel.style.display === "flex" ? "none" : "flex";
});

// ---------- Page context ----------
async function refreshPageContext() {
  contextStatus.textContent = "Page padh raha hoon...";
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || !tab.url.includes("tryhackme.com")) {
      contextStatus.textContent = "⚠ Yeh TryHackMe page nahi hai";
      pageContext = null;
      return;
    }
    const response = await chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_CONTEXT" });
    pageContext = response;
    contextStatus.textContent = "✅ Padh liya: " + (response.heading || response.title || "page");
  } catch (e) {
    contextStatus.textContent = "⚠ Page nahi padh paya. Page reload karke try karo.";
    pageContext = null;
  }
}

refreshContextBtn.addEventListener("click", refreshPageContext);

// ---------- Sending messages ----------
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  const settings = await chrome.storage.local.get(["openrouterKey", "model"]);
  if (!settings.openrouterKey) {
    addSystemNote("⚠ Pehle Settings me apni OpenRouter API key daalo.");
    settingsPanel.style.display = "flex";
    return;
  }

  addMessage("user", text);
  chatHistory.push({ role: "user", content: text });
  userInput.value = "";
  sendBtn.disabled = true;
  addSystemNote("Soch raha hoon...");

  try {
    const contextText = pageContext
      ? `[Lab page ka context]\nTitle: ${pageContext.heading || pageContext.title}\n\nContent:\n${pageContext.bodyText}`
      : "[Koi page context load nahi hua - student se pucho wo kis task/room par hai]";

    const messages = [
      { role: "system", content: SYSTEM_PROMPT + "\n\n" + contextText },
      ...chatHistory
    ];

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${settings.openrouterKey}`
      },
      body: JSON.stringify({
        model: settings.model || "anthropic/claude-3.5-sonnet",
        messages,
        max_tokens: 800
      })
    });

    // Loading note hatao
    const notes = chatEl.querySelectorAll(".msg.system");
    if (notes.length) notes[notes.length - 1].remove();

    if (!res.ok) {
      const errText = await res.text();
      addSystemNote("⚠ API error: " + res.status);
      console.error(errText);
      sendBtn.disabled = false;
      return;
    }

    const data = await res.json();
    const reply = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : "(Koi response nahi mila)";

    addMessage("ai", reply);
    chatHistory.push({ role: "assistant", content: reply });
  } catch (e) {
    addSystemNote("⚠ Kuch galat ho gaya: " + e.message);
    console.error(e);
  }
  sendBtn.disabled = false;
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// ---------- Init ----------
loadSettings();
addSystemNote("Namaste! Pehle 'Page padho' dabao, fir apna sawaal poochho. Main answer nahi dunga, bas samjhaunga 🙂");
refreshPageContext();
