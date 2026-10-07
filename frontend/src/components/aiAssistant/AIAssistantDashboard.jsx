import { useState, useRef, useEffect } from "react";
import { useAI } from "../../context/AIContext";
import AISettingsModal from "./AISettingsModal";
import {
  FaRobot,
  FaPaperPlane,
  FaTrash,
  FaLightbulb,
  FaStethoscope,
  FaPills,
  FaCog,
  FaPaw,
  FaExclamationTriangle,
  FaCopy,
  FaCheck,
  FaUserMd,
} from "react-icons/fa";

export default function AIAssistantDashboard() {
  const { messages, sendMessage, clearMessages, isThinking, config } = useAI();
  const [text, setText] = useState("");
  const [symptomsInput, setSymptomsInput] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    { label: "🤒 Fever & Body Ache Triage", prompt: "I have had a mild fever (100.4°F) and body ache for the past 2 days. What home care steps should I take, and when should I see a doctor?" },
    { label: "🐾 Dog / Cat Toxic Substances", prompt: "What common human foods and over-the-counter medicines are dangerous or toxic to dogs and cats?" },
    { label: "💊 Drug Interactions & Safety", prompt: "How should I safely take blood pressure medication (like Lisinopril or Amlodipine), and what foods or drugs should I avoid?" },
    { label: "📋 Explain Blood Test Results", prompt: "Can you help me understand a blood report with Fasting Glucose 118 mg/dL and Total Cholesterol 235 mg/dL?" },
    { label: "🍎 Family Immunity & Nutrition", prompt: "Suggest a healthy, nutrient-rich weekly meal plan suitable for both growing children and adults." },
  ];

  const petWarnings = [
    { item: "Xylitol / Birch Sugar", danger: "Fatal hypoglycemia & liver failure in dogs (found in sugar-free gum & peanut butter)." },
    { item: "Paracetamol / Ibuprofen", danger: "Extremely toxic to cats & dogs; causes severe kidney/liver necrosis." },
    { item: "Chocolate & Caffeine", danger: "Contains theobromine; causes cardiac arrhythmias and seizures." },
    { item: "Grapes & Raisins", danger: "Can trigger acute, irreversible kidney failure in dogs." },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim() && !isThinking) {
      sendMessage(text);
      setText("");
    }
  };

  const handleQuickPrompt = (promptText) => {
    if (!isThinking) {
      sendMessage(promptText);
    }
  };

  const handleSymptomTriage = () => {
    if (symptomsInput.trim() && !isThinking) {
      const prompt = `Please provide a structured clinical symptom triage and assessment for the following symptoms: "${symptomsInput}". Include potential causes, red flag emergency symptoms, self-care steps, and when to seek urgent care.`;
      sendMessage(prompt);
      setSymptomsInput("");
    }
  };

  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Simple Markdown formatter for clinical messages
  const renderFormattedMessage = (content) => {
    if (!content) return "";
    
    // Split into paragraphs / lines
    const lines = content.split("\n");
    return (
      <div className="space-y-2 text-xs md:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1.5" />;

          // Heading 3 ###
          if (trimmed.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-sm md:text-base font-bold text-slate-900 mt-2 pb-1 border-b border-slate-100">
                {trimmed.replace("### ", "")}
              </h3>
            );
          }
          // Heading 4 ####
          if (trimmed.startsWith("#### ")) {
            return (
              <h4 key={idx} className="text-xs md:text-sm font-bold text-indigo-950 mt-1.5">
                {trimmed.replace("#### ", "")}
              </h4>
            );
          }
          // Bullet point
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            const itemText = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{renderInlineStyles(itemText)}</span>
              </div>
            );
          }
          // Numbered list
          if (/^\d+\.\s/.test(trimmed)) {
            const match = trimmed.match(/^(\d+\.)\s(.*)/);
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-indigo-600 font-bold">{match[1]}</span>
                <span>{renderInlineStyles(match[2])}</span>
              </div>
            );
          }
          // Regular line
          return <p key={idx}>{renderInlineStyles(trimmed)}</p>;
        })}
      </div>
    );
  };

  const renderInlineStyles = (text) => {
    // Bold **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const providerLabel = {
    gemini: "✨ Google Gemini",
    groq: "⚡ Groq LPU",
    openrouter: "🌐 OpenRouter",
    custom: "💻 Custom / Ollama",
  }[config.provider || "gemini"] || config.provider;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-white/20 rounded-full">
              24/7 Clinical & Vet AI Companion
            </span>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/30 border border-emerald-400/40 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {providerLabel} ({config.model || "default"})
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-2">UniCare AI Health Assistant</h1>
          <p className="text-blue-100 text-sm mt-1">
            Intelligent medical symptom triage, drug safety, and companion pet veterinary guidance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold px-4 py-2.5 rounded-2xl transition text-xs flex items-center gap-2 shadow-xs"
            title="Configure AI Provider and API Key"
          >
            <FaCog className="text-sm" />
            <span>AI Settings</span>
          </button>

          <button
            onClick={clearMessages}
            className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold px-4 py-2.5 rounded-2xl transition text-xs flex items-center gap-2 shrink-0"
            title="Clear Chat History"
          >
            <FaTrash />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Quick Health Prompt Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Inquiries:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              disabled={isThinking}
              onClick={() => handleQuickPrompt(q.prompt)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-700 font-semibold text-xs whitespace-nowrap transition shadow-2xs hover:text-indigo-900 flex-shrink-0"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main Interactive Chat Window */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[580px]">
          {/* Chat Window Topbar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shadow-xs">
                <FaRobot className="text-xl" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">UniCare Clinical Assistant</h2>
                <span className="text-[11px] text-slate-500 font-medium">
                  Powered by {providerLabel}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 transition"
            >
              <FaCog /> Change Model
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 my-4 space-y-4 overflow-y-auto pr-2 bg-slate-50/60 p-4 md:p-5 rounded-2xl border border-slate-100">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {m.role === "user" ? "You" : "UniCare AI"}
                  </span>
                  {m.provider && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-slate-200/80 rounded text-slate-600 font-medium">
                      {m.provider}
                    </span>
                  )}
                </div>

                <div
                  className={`relative group max-w-[90%] md:max-w-[85%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none font-medium"
                      : m.isError
                      ? "bg-amber-50 border border-amber-200 text-amber-950 rounded-tl-none font-medium"
                      : "bg-white text-slate-800 ring-1 ring-slate-200/80 rounded-tl-none font-medium"
                  }`}
                >
                  {m.role === "user" ? m.content : renderFormattedMessage(m.content)}

                  {/* Copy Button */}
                  {m.role !== "user" && (
                    <button
                      onClick={() => handleCopy(m.content, i)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 opacity-0 group-hover:opacity-100 transition text-[10px] flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedIndex === i ? <FaCheck className="text-emerald-600" /> : <FaCopy />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Thinking / Streaming Indicator */}
            {isThinking && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                  <FaRobot className="text-sm" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-semibold">Analyzing medical knowledge...</span>
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

          {/* Chat Input Bar */}
          <form className="flex gap-2 pt-2 border-t border-slate-100" onSubmit={handleSend}>
            <input
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition bg-slate-50"
              value={text}
              disabled={isThinking}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask a medical question, describe symptoms, or ask about pet health..."
            />
            <button
              type="submit"
              disabled={isThinking || !text.trim()}
              className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 px-5 text-white font-semibold flex items-center gap-2 transition shadow-md shrink-0 active:scale-95"
            >
              <FaPaperPlane />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </section>

        {/* Sidebar Tools: Symptom Checker, Pet Poison Alerts, Medicine Guide */}
        <aside className="space-y-6">
          {/* AI Clinical Symptom Triage Box */}
          <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FaStethoscope className="text-indigo-600 text-base" /> AI Symptom Assessment
            </h2>
            <p className="text-xs text-slate-500">
              Describe acute symptoms for comprehensive triage and emergency checks:
            </p>
            <textarea
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              rows="3"
              value={symptomsInput}
              disabled={isThinking}
              onChange={(e) => setSymptomsInput(e.target.value)}
              placeholder="e.g. 3-year-old with persistent dry cough, wheezing, and low appetite..."
            />
            <button
              onClick={handleSymptomTriage}
              disabled={isThinking || !symptomsInput.trim()}
              className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-indigo-200/80 disabled:opacity-50"
            >
              <FaUserMd /> Run AI Symptom Analysis
            </button>
          </section>

          {/* Pet Toxicity & Medication Warning Guard */}
          <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FaPaw className="text-teal-600 text-base" /> Pet Safety & Poison Alerts
            </h2>
            <div className="space-y-2">
              {petWarnings.map((w, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <FaExclamationTriangle className="text-rose-500 text-[10px]" />
                    {w.item}
                  </div>
                  <p className="text-[11px] text-rose-800 mt-0.5 font-medium">{w.danger}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Medicine & Wellness Guidance */}
          <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-2">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FaPills className="text-purple-600 text-base" /> Safe Medication Rule
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Never administer human OTC analgesics or NSAIDs to dogs or cats without explicit veterinary dosage calculation.
            </p>
          </section>
        </aside>
      </div>

      {/* Settings Modal */}
      <AISettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
