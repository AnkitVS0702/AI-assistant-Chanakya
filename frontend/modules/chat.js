import { elements, API_URLS } from './config.js';
import { createHotelGrid } from './hotels.js';
import { addAlarm } from './alarms.js';

export function createMessage(text, role) {
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

export function appendMessagePair(query, responseText) {
  const pair = document.createElement("div");
  pair.className = "message-pair";
  pair.appendChild(createMessage(query, "user"));
  pair.appendChild(createMessage(responseText, "assistant"));

  if (elements.chatWindow.querySelector(".chat-empty")) {
    elements.chatWindow.innerHTML = "";
  }
  
  elements.chatWindow.appendChild(pair);
  elements.chatWindow.scrollTop = elements.chatWindow.scrollHeight;
  return pair;
}

export async function sendMessage() {
  const text = elements.inputField.value.trim();
  if (!text) return;

  elements.inputField.value = "";
  elements.sendBtn.disabled = true;

  const pair = appendMessagePair(text, "Thinking...");
  const loadingBubble = pair.querySelector(".message.assistant .content");

  try {
    const res = await fetch(API_URLS.chat, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);

    const data = await res.json();
    loadingBubble.textContent = data.response || "No response received.";
    
    if (data.hotels && data.hotels.length > 0) {
      const grid = createHotelGrid(data.hotels);
      pair.querySelector(".message.assistant").appendChild(grid);
    }

    if (data.alarms && data.alarms.length > 0) {
      data.alarms.forEach(alarm => {
        addAlarm(alarm.message, alarm.seconds);
      });
    }
  } catch (error) {
    loadingBubble.textContent = "Unable to get a response. Check your server.";
    console.error(error);
  } finally {
    elements.sendBtn.disabled = false;
    elements.chatWindow.scrollTop = elements.chatWindow.scrollHeight;
  }
}
