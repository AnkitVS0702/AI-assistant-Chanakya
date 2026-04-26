import { elements } from './modules/config.js';
import { sendMessage } from './modules/chat.js';
import { initAlarms } from './modules/alarms.js';
import { startVoice } from './modules/voice.js';

// Initialize Alarms
initAlarms();

// Event Listeners
elements.voiceBtn.addEventListener("click", startVoice);
elements.sendBtn.addEventListener("click", sendMessage);

elements.inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

console.log("Chanakya Frontend Initialized");
