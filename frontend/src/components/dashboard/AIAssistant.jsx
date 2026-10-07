import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiCpu, FiSend, FiExternalLink } from "react-icons/fi";
import { useAI } from "../../context/AIContext";

function AIAssistant() {
  const { messages, sendMessage, isThinking, config } = useAI();
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isThinking) {
      sendMessage(text);
      setText("");
    }
  };

  const providerName = {
    gemini: "Gemini",
    groq: "Groq",
    openrouter: "OpenRouter",
    custom: "Ollama",
  }[config?.provider || "gemini"] || "AI";

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FiCpu className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                AI Clinical Assistant
              </h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                {providerName}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-medium">
              24/7 Virtual health & symptom guidance
            </p>
          </div>
        </div>

        <Link
          to="/ai-assistant"
          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 p-1.5 rounded-lg hover:bg-indigo-50 transition"
          title="Open Full AI Health Assistant"
        >
          <span className="hidden sm:inline">Open</span>
          <FiExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Chat Messages Window */}
      <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/70">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-3.5 py-2 text-xs leading-relaxed max-w-[85%] ${
                item.role === "user"
                  ? "bg-indigo-600 text-white font-medium shadow-xs"
                  : "bg-white text-slate-800 border border-slate-200/80 shadow-xs font-medium"
              }`}
            >
              {item.content}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-500 flex items-center gap-1.5">
              <span>Thinking...</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          disabled={isThinking}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask a medical or triage question..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition"
        />

        <button
          type="submit"
          disabled={isThinking || !text.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-2.5 rounded-lg transition shadow-xs active:scale-95"
          title="Send message"
        >
          <FiSend className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

export default AIAssistant;