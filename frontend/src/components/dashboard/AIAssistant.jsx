import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiCpu, FiSend, FiExternalLink, FiActivity } from "react-icons/fi";
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

  const handleQuickPrompt = (prompt) => {
    if (!isThinking) {
      sendMessage(prompt);
    }
  };

  const providerName =
    {
      gemini: "Gemini Pro",
      groq: "Groq LPU",
      openrouter: "OpenRouter",
      custom: "Ollama Local",
    }[config?.provider || "gemini"] || "Clinical AI";

  const quickPrompts = [
    { label: "🌡️ Cold & Fever Triage", prompt: "I have a mild fever (100°F) and throat pain. What are initial triage steps?" },
    { label: "💊 Drug Interactions", prompt: "Can Lisinopril and Paracetamol be taken together safely?" },
    { label: "🐶 Pet Toxic Food", prompt: "What human foods are toxic to dogs and cats?" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-violet-300 transition-all duration-200">
      {/* Segregated Field Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
            <FiCpu className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                AI Clinical Triage & Guidance
              </h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                {providerName}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              24/7 Virtual preliminary clinical triage and health intelligence
            </p>
          </div>
        </div>

        <Link
          to="/ai"
          className="text-xs text-violet-600 hover:text-violet-800 font-bold flex items-center gap-1 p-1"
          title="Open Full AI Clinical Suite"
        >
          <span>Full Chat</span>
          <FiExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Quick Clinical Prompts Bar */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isThinking}
            onClick={() => handleQuickPrompt(q.prompt)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-violet-50 text-slate-700 hover:text-violet-700 border border-slate-200 hover:border-violet-300 transition shadow-2xs"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
        {messages.slice(-4).map((item, index) => (
          <div
            key={index}
            className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed max-w-[85%] ${
                item.role === "user"
                  ? "bg-violet-600 text-white font-medium shadow-xs"
                  : "bg-white text-slate-800 border border-slate-200/90 shadow-2xs font-medium"
              }`}
            >
              {item.content}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-3 py-1.5 text-xs text-slate-500 flex items-center gap-2">
              <span className="font-semibold text-violet-600">Analyzing clinical guidelines...</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          disabled={isThinking}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask a medical symptom or medicine question..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-violet-500 focus:bg-white transition"
        />

        <button
          type="submit"
          disabled={isThinking || !text.trim()}
          className="bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white p-2.5 rounded-xl transition shadow-xs active:scale-95 shrink-0"
          title="Send clinical prompt"
        >
          <FiSend className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

export default AIAssistant;