import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMessage = { text: data.reply, sender: "bot" };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-2xl p-4">
        <h1 className="text-2xl font-bold mb-4">💬 Gemini Chatbot</h1>
        <div className="border border-gray-700 rounded-lg p-4 h-96 overflow-y-auto mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.sender === "user" ? "text-blue-400" : "text-green-400"}>
              <b>{msg.sender === "user" ? "You" : "Bot"}:</b> {msg.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded-l-lg border-none text-black"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 px-4 py-2 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
