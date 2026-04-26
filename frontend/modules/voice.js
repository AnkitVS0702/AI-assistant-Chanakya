import { elements, API_URLS } from './config.js';
import { sendMessage } from './chat.js';

let listening = false;

export function updateVoiceButton() {
  elements.voiceBtn.classList.toggle("active", listening);
  elements.voiceBtn.textContent = listening ? "🛑" : "🎙";
  elements.voiceBtn.title = listening ? "Stop listening" : "Use voice input";
}

export async function startVoice() {
  if (listening) return;

  listening = true;
  updateVoiceButton();

  try {
    const res = await fetch(API_URLS.listen, {
      method: "POST"
    });
    const data = await res.json();
    
    if (data.text && !["TIMEOUT_ERROR", "UNKNOWN_VALUE_ERROR", ""].includes(data.text)) {
      elements.inputField.value = data.text;
      sendMessage();
    }
  } catch (error) {
    console.error("Backend speech error:", error);
  } finally {
    listening = false;
    updateVoiceButton();
  }
}
