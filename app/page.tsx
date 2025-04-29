"use client";
import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setPrompt("");

    setMessages((prevState) => [
      ...prevState,
      { role: "user", content: prompt },
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const result = await response.json();

    setMessages((prevState) => [
      ...prevState,
      { role: "assistant", content: result },
    ]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 flex flex-col space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg text-white ${
                  message.role === "user" ? "bg-blue-500" : "bg-gray-500"
                }`}
              >
                <span>{message.content}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 p-4 bg-gray-200"
        >
          <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Type your message..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-blue-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
