export const elements = {
  chatWindow: document.getElementById("chat"),
  inputField: document.getElementById("input"),
  sendBtn: document.getElementById("sendBtn"),
  voiceBtn: document.getElementById("voiceBtn"),
  alarmsList: document.getElementById("alarmsList"),
  alarmSound: document.getElementById("alarmSound"),
};

export const API_URLS = {
  chat: "http://localhost:5000/chat",
  listen: "http://localhost:5000/listen",
};
