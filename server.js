const express = require("express");
const { SerialPort } = require("serialport");
const { WebSocketServer } = require("ws");

// **🔹 Configure SerialPort (Bluetooth COM Port)**
const portName = "COM3"; // Change this to your Arduino Bluetooth COM Port
const baudRate = 9600;

const serialPort = new SerialPort({ path: portName, baudRate: baudRate });

serialPort.on("open", () => {
    console.log(`✅ Serial Port ${portName} Opened`);
});

serialPort.on("error", (err) => {
    console.error("❌ Serial Port Error:", err.message);
});

// **🔹 Set up Express Server**
const app = express();
const PORT = 3000;

// Serve static files (for frontend)
app.use(express.static("public"));

// Start HTTP Server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// **🔹 Set up WebSocket Server**
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("🔗 Client Connected to WebSocket");

    ws.on("message", (message) => {
        console.log(`📩 Received Command: ${message}`);

        // Send the message to Arduino via Serial Port
        serialPort.write(message + "\n", (err) => {
            if (err) {
                console.error("❌ Error sending to Serial Port:", err.message);
            }
        });
    });

    ws.on("close", () => {
        console.log("🔌 Client Disconnected");
    });
});

