import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { text: data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ API Error. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col w-full max-w-3xl h-screen">
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-[75%] leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-gray-400 italic">Bot is typing...</div>
          )}
        </div>

        {/* Input bar fixed at bottom */}
        <form
          onSubmit={sendMessage}
          className="fixed bottom-0 left-0 right-0 flex justify-center bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pb-4"
        >
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-full overflow-hidden w-full max-w-3xl shadow-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-transparent text-white outline-none resize-none"
            />
            <button
              type="submit"
              className="bg-blue-600 px-6 py-3 hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
