import { WebSocket } from "ws"
const ws = new WebSocket({ port: 443 });

ws.onopen = () => console.log("Connected to WebSocket");
ws.onerror = err => console.error("WebSocket Error:", err);

function sendCommand(command) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(command);
        console.log("Sent:", command);
    } else {
        alert("WebSocket not connected!");
    }
}

function startListening() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
        let command = event.results[0][0].transcript.toLowerCase();
        console.log("Voice Command:", command);

        if (command.includes("fan on")) sendCommand("fan on");
        else if (command.includes("fan off")) sendCommand("fan off");
        else if (command.includes("bulb on")) sendCommand("bulb on");
        else if (command.includes("bulb off")) sendCommand("bulb off");
        else if (command.includes("all on")) sendCommand("all on");
        else if (command.includes("all off")) sendCommand("all off");
        else alert("Unknown command! Try 'fan on' or 'bulb off'.");
    };
}
