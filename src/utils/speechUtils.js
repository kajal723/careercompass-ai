// Web Speech API Utilities for AI Mock Interviewer

export function speakText(text, onEndCallback) {
  if (!("speechSynthesis" in window)) {
    console.warn("Web Speech API is not supported by this browser.");
    if (onEndCallback) onEndCallback();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = "en-US";

  // Try to pick a natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Microsoft")) && v.lang.startsWith("en"));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEndCallback) {
    utterance.onend = onEndCallback;
    utterance.onerror = onEndCallback;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function createSpeechRecognizer(onResultCallback, onErrorCallback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    if (onResultCallback) onResultCallback(transcript);
  };

  recognition.onerror = (event) => {
    console.warn("Speech recognition error:", event.error);
    if (onErrorCallback) onErrorCallback(event.error);
  };

  return recognition;
}
