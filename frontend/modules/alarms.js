import { elements } from './config.js';

let alarms = JSON.parse(localStorage.getItem("chanakya_alarms") || "[]");

export function saveAlarms() {
  localStorage.setItem("chanakya_alarms", JSON.stringify(alarms));
}

export function renderAlarms() {
  if (alarms.length === 0) {
    elements.alarmsList.innerHTML = '<p class="empty-state">No active alarms</p>';
    return;
  }

  elements.alarmsList.innerHTML = "";
  const sorted = [...alarms].sort((a, b) => a.triggerTime - b.triggerTime);
  
  sorted.forEach(alarm => {
    const item = document.createElement("div");
    item.className = `alarm-item ${alarm.status === "ringing" ? "ringing" : ""}`;
    
    const date = new Date(alarm.triggerTime);
    const timeStr = alarm.status === "ringing" 
      ? "🚨 RINGING!" 
      : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    item.innerHTML = `
      <div class="alarm-info">
        <span class="alarm-msg">${alarm.message}</span>
        <span class="alarm-time">${timeStr}</span>
      </div>
      <button class="btn-dismiss" data-id="${alarm.id}">
        ${alarm.status === "ringing" ? "Stop" : "Delete"}
      </button>
    `;
    elements.alarmsList.appendChild(item);
  });
}

export function addAlarm(message, seconds) {
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

export function dismissAlarm(id) {
  alarms = alarms.filter(a => a.id !== id);
  saveAlarms();
  renderAlarms();
  
  if (!alarms.some(a => a.status === "ringing")) {
    elements.alarmSound.pause();
    elements.alarmSound.currentTime = 0;
  }
}

function triggerRinging(alarm) {
  elements.alarmSound.play().catch(e => console.log("Sound play failed:", e));

  if (Notification.permission === "granted") {
    new Notification("Chanakya Alarm!", {
      body: `Time for: ${alarm.message}`,
      icon: "https://cdn-icons-png.flaticon.com/512/182/182444.png"
    });
  }
}

export function checkAlarms() {
  let changed = false;
  const now = Date.now();

  alarms.forEach(alarm => {
    if (alarm.status === "active" && now >= alarm.triggerTime) {
      alarm.status = "ringing";
      changed = true;
      triggerRinging(alarm);
    }
  });

  if (changed) renderAlarms();
}

export function initAlarms() {
  elements.alarmsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-dismiss')) {
      const id = parseFloat(e.target.dataset.id);
      dismissAlarm(id);
    }
  });

  setInterval(checkAlarms, 1000);
  renderAlarms();

  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}
