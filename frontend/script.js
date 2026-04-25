const chatWindow = document.getElementById("chat");
const inputField = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
let recognition;
let listening = false;

function createMessage(text, role) {
  const bubble = document.createElement("div");
  bubble.className = `message ${role}`;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = role === "user" ? "You" : "Chanakya";

  const content = document.createElement("div");
  content.className = "content";
  content.textContent = text;

  bubble.appendChild(meta);
  bubble.appendChild(content);
  return bubble;
}

function createMessagePair(query, responseText) {
  const pair = document.createElement("div");
  pair.className = "message-pair";
  pair.appendChild(createMessage(query, "user"));
  pair.appendChild(createMessage(responseText, "assistant"));
  return pair;
}

function appendMessagePair(query, responseText) {
  const pair = createMessagePair(query, responseText);
  if (chatWindow.querySelector(".chat-empty")) {
    chatWindow.innerHTML = "";
  }
  chatWindow.appendChild(pair);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return pair;
}

async function sendMessage() {
  const text = inputField.value.trim();
  if (!text) return;

  inputField.value = "";
  sendBtn.disabled = true;

  const pair = appendMessagePair(text, "Thinking...");
  const loadingBubble = pair.querySelector(".message.assistant .content");

  try {
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    loadingBubble.textContent = data.response || "No response received.";
  } catch (error) {
    loadingBubble.textContent = "Unable to get a response. Check your server.";
    console.error(error);
  } finally {
    sendBtn.disabled = false;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}

function updateVoiceButton() {
  voiceBtn.classList.toggle("active", listening);
  voiceBtn.textContent = listening ? "🛑" : "🎙";
  voiceBtn.title = listening ? "Stop listening" : "Use voice input";
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      inputField.value = transcript;
    };

    recognition.onerror = () => {
      listening = false;
      updateVoiceButton();
    };

    recognition.onend = () => {
      listening = false;
      updateVoiceButton();
    };
  }

  if (listening) {
    recognition.stop();
    listening = false;
  } else {
    recognition.start();
    listening = true;
  }
  updateVoiceButton();
}

voiceBtn.addEventListener("click", startVoice);
sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});
