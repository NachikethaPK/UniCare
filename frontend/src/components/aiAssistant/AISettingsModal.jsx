import { useState } from "react";
import { useAI } from "../../context/AIContext";
import {
  FaTimes,
  FaKey,
  FaRobot,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaEye,
  FaEyeSlash,
  FaBolt,
  FaSlidersH,
} from "react-icons/fa";

export default function AISettingsModal({ isOpen, onClose }) {
  const { config, updateConfig, providers, testApiKey } = useAI();
  const [provider, setProvider] = useState(config.provider || "gemini");
  const [apiKey, setApiKey] = useState(config.apiKey || "");
  const [model, setModel] = useState(config.model || "gemini-1.5-flash");
  const [baseUrl, setBaseUrl] = useState(config.baseUrl || "");
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // { loading, success, message }

  if (!isOpen) return null;

  const currentProviderInfo = providers[provider] || {
    name: provider,
    models: ["default"],
    is_free: true,
    free_info: "Free AI inference available",
    get_key_url: "https://aistudio.google.com/app/apikey",
  };

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    const pInfo = providers[newProvider];
    if (pInfo) {
      setModel(pInfo.default_model || pInfo.models?.[0] || "");
      if (newProvider === "custom") {
        setBaseUrl(pInfo.base_url || "http://localhost:11434/v1");
      } else {
        setBaseUrl(pInfo.base_url || "");
      }
    }
    setTestStatus(null);
  };

  const handleTestKey = async () => {
    if (!apiKey.trim() && provider !== "custom") {
      setTestStatus({
        success: false,
        message: "Please enter an API key first.",
      });
      return;
    }

    setTestStatus({ loading: true });
    const result = await testApiKey(provider, apiKey, model);
    setTestStatus({
      loading: false,
      success: result.success,
      message: result.message || (result.success ? "Connection successful!" : "Failed to connect."),
    });
  };

  const handleSave = () => {
    updateConfig({
      provider,
      apiKey: apiKey.trim(),
      model,
      baseUrl: baseUrl.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FaSlidersH className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI Model & API Configuration</h2>
              <p className="text-xs text-slate-500 font-medium">Choose your AI provider or add your free API key</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Free API Guide Card */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-blue-900">
            <span className="flex items-center gap-1.5">
              <FaBolt className="text-amber-500" /> Recommended 100% Free AI APIs:
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white border border-blue-200/80 hover:border-blue-400 hover:shadow-xs transition text-blue-700 font-semibold flex items-center justify-between"
            >
              <span>✨ Google Gemini (1500 req/day)</span>
              <FaExternalLinkAlt className="text-[10px] opacity-70" />
            </a>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white border border-blue-200/80 hover:border-blue-400 hover:shadow-xs transition text-indigo-700 font-semibold flex items-center justify-between"
            >
              <span>⚡ Groq Cloud (Ultra Fast)</span>
              <FaExternalLinkAlt className="text-[10px] opacity-70" />
            </a>
          </div>
          <p className="text-[11px] text-slate-500">
            *Both options require <strong>zero credit card</strong> and take less than 30 seconds to generate a free key.
          </p>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-xs">
          {/* Provider Selection */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Select AI Provider</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "gemini", label: "Google Gemini", badge: "Free" },
                { id: "groq", label: "Groq LPU", badge: "Ultra Fast" },
                { id: "openrouter", label: "OpenRouter", badge: "Multi-Model" },
                { id: "custom", label: "Custom / Local", badge: "Ollama" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProviderChange(p.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                    provider === p.id
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-xs ring-1 ring-indigo-600"
                      : "border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xs">{p.label}</span>
                  <span className="text-[10px] text-indigo-600 font-bold mt-1 bg-indigo-100/70 px-1.5 py-0.5 rounded-md w-fit">
                    {p.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">AI Model</label>
            {currentProviderInfo.models && currentProviderInfo.models.length > 0 ? (
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              >
                {currentProviderInfo.models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. llama3, mistral, gpt-4o-mini"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              />
            )}
          </div>

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800">
                {currentProviderInfo.name} API Key
              </label>
              {currentProviderInfo.get_key_url && (
                <a
                  href={currentProviderInfo.get_key_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px] flex items-center gap-1"
                >
                  Get Free Key <FaExternalLinkAlt className="text-[9px]" />
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestStatus(null);
                }}
                placeholder={`Paste your ${currentProviderInfo.name} API Key here...`}
                className="w-full rounded-xl border border-slate-200 p-2.5 pr-10 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Custom Base URL (if custom) */}
          {provider === "custom" && (
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">Base URL (OpenAI-Compatible)</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="e.g. http://localhost:11434/v1 or https://api.together.xyz/v1"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}

          {/* Live Test Feedback */}
          {testStatus && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                testStatus.loading
                  ? "bg-slate-50 border-slate-200 text-slate-600"
                  : testStatus.success
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
                  : "bg-rose-50 border-rose-200 text-rose-800 font-semibold"
              }`}
            >
              {testStatus.loading ? (
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              ) : testStatus.success ? (
                <FaCheckCircle className="text-emerald-600 text-sm shrink-0" />
              ) : (
                <FaExclamationTriangle className="text-rose-600 text-sm shrink-0" />
              )}
              <span className="flex-1">{testStatus.loading ? "Testing API connection..." : testStatus.message}</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={testStatus?.loading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <FaKey className="text-slate-400" />
            <span>Test Connection</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 font-semibold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
            >
              Save & Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
