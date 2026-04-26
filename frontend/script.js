const chatWindow = document.getElementById("chat");
const inputField = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const alarmsList = document.getElementById("alarmsList");
const alarmSound = document.getElementById("alarmSound");

let recognition;
let listening = false;
let alarms = JSON.parse(localStorage.getItem("chanakya_alarms") || "[]");

// Request notification permission on load
if (Notification.permission === "default") {
  Notification.requestPermission();
}

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
    
    // Handle Hotels
    if (data.hotels && data.hotels.length > 0) {
      const grid = createHotelGrid(data.hotels);
      pair.querySelector(".message.assistant").appendChild(grid);
    }

    // Handle Alarms
    if (data.alarms && data.alarms.length > 0) {
      data.alarms.forEach(alarm => {
        addAlarm(alarm.message, alarm.seconds);
      });
    }
  } catch (error) {
    loadingBubble.textContent = "Unable to get a response. Check your server.";
    console.error(error);
  } finally {
    sendBtn.disabled = false;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}

/* --- Alarm Logic --- */
function addAlarm(message, seconds) {
  const now = Date.now();
  const triggerTime = now + (seconds * 1000);
  
  const newAlarm = {
    id: now + Math.random(),
    message,
    triggerTime,
    status: "active"
  };

  alarms.push(newAlarm);
  saveAlarms();
  renderAlarms();
}

function saveAlarms() {
  localStorage.setItem("chanakya_alarms", JSON.stringify(alarms));
}

function renderAlarms() {
  if (alarms.length === 0) {
    alarmsList.innerHTML = '<p class="empty-state">No active alarms</p>';
    return;
  }

  alarmsList.innerHTML = "";
  // Sort alarms by trigger time
  const sorted = [...alarms].sort((a, b) => a.triggerTime - b.triggerTime);
  
  sorted.forEach(alarm => {
    const item = document.createElement("div");
    item.className = `alarm-item ${alarm.status === "ringing" ? "ringing" : ""}`;
    
    // Format the trigger time for display (e.g., 08:54 AM)
    const date = new Date(alarm.triggerTime);
    const timeStr = alarm.status === "ringing" 
      ? "🚨 RINGING!" 
      : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    item.innerHTML = `
      <div class="alarm-info">
        <span class="alarm-msg">${alarm.message}</span>
        <span class="alarm-time">${timeStr}</span>
      </div>
      <button class="btn-dismiss" onclick="dismissAlarm(${alarm.id})">
        ${alarm.status === "ringing" ? "Stop" : "Delete"}
      </button>
    `;
    alarmsList.appendChild(item);
  });
}

function dismissAlarm(id) {
  alarms = alarms.filter(a => a.id !== id);
  saveAlarms();
  renderAlarms();
  
  // Stop sound if no more ringing alarms
  if (!alarms.some(a => a.status === "ringing")) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
}

function checkAlarms() {
  let changed = false;
  const now = Date.now();

  alarms.forEach(alarm => {
    if (alarm.status === "active" && now >= alarm.triggerTime) {
      alarm.status = "ringing";
      changed = true;
      triggerRinging(alarm);
    }
  });

  // Only re-render if an alarm status actually changed to "ringing"
  if (changed) renderAlarms();
}

function triggerRinging(alarm) {
  // Play sound
  alarmSound.play().catch(e => console.log("Sound play failed:", e));

  // Show Browser Notification
  if (Notification.permission === "granted") {
    new Notification("Chanakya Alarm!", {
      body: `Time for: ${alarm.message}`,
      icon: "https://cdn-icons-png.flaticon.com/512/182/182444.png"
    });
  }
}

// Check alarms every second
setInterval(checkAlarms, 1000);
renderAlarms(); // Initial render

/* --- Hotel Logic --- */
function createHotelGrid(hotels) {
  const grid = document.createElement("div");
  grid.className = "hotel-grid";
  hotels.forEach(hotel => {
    grid.appendChild(createHotelCard(hotel));
  });
  return grid;
}

function createHotelCard(hotel) {
  const card = document.createElement("div");
  card.className = "hotel-card";
  card.onclick = () => window.open(`https://www.google.com/search?q=${encodeURIComponent(hotel.name)}`, "_blank");

  card.innerHTML = `
    <img src="${hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}" class="hotel-image" alt="${hotel.name}">
    <div class="hotel-info">
      <div class="hotel-name">${hotel.name}</div>
      <div class="hotel-price">${hotel.price}</div>
      <div class="hotel-rating">${'⭐'.repeat(Math.round(hotel.rating || 5))}</div>
    </div>
  `;
  return card;
}

/* --- Voice Logic --- */
function updateVoiceButton() {
  voiceBtn.classList.toggle("active", listening);
  voiceBtn.textContent = listening ? "🛑" : "🎙";
  voiceBtn.title = listening ? "Stop listening" : "Use voice input";
}

async function startVoice() {
  if (listening) return; // Prevent multiple clicks

  listening = true;
  updateVoiceButton();

  try {
    const res = await fetch("http://localhost:5000/listen", {
      method: "POST"
    });
    const data = await res.json();
    
    if (data.text && data.text !== "TIMEOUT_ERROR" && data.text !== "UNKNOWN_VALUE_ERROR" && data.text !== "") {
      inputField.value = data.text;
      sendMessage(); // Automatically send the message
    } else if (data.text === "TIMEOUT_ERROR") {
      console.log("No speech detected.");
    }
  } catch (error) {
    console.error("Backend speech error:", error);
  } finally {
    listening = false;
    updateVoiceButton();
  }
}

voiceBtn.addEventListener("click", startVoice);
sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});
