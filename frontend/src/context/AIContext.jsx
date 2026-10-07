import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AIContext = createContext();

const PRECONFIGURED_GEMINI_KEY = "AIzaSyCW5V8QqFc_xWMRG-30qBr6nmHBSZvFrlA";

const DEFAULT_CONFIG = {
  provider: "gemini",
  model: "gemini-3.5-flash",
  apiKey: PRECONFIGURED_GEMINI_KEY,
  baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  temperature: 0.7,
};

const DEFAULT_SYSTEM_PROMPT = `You are UniCare AI, an advanced, empathetic, and knowledgeable clinical & veterinary health companion.
Provide helpful, medically accurate, and easy-to-understand guidance for whole families (humans of all ages) and their companion pets (dogs, cats, and other animals).
Format your answers clearly with bullet points, bold text, and safety triage alerts when appropriate.`;

const initialMessages = [
  {
    role: "assistant",
    content: "👋 Hello! I am your **UniCare AI Health & Veterinary Companion**.\n\nYou can ask me anything about:\n- 🩺 **Symptoms & Triage** (Fever, pain, blood pressure, pediatric care)\n- 🐾 **Pet Healthcare** (Dog/cat nutrition, safe medications, toxic substance checks)\n- 💊 **Medications & Safety** (Dosages, drug interactions, precautions)\n- 📋 **Lab Reports & Vitals** (Blood panels, cholesterol, diagnostic interpretation)\n\n*How can I help you or your family/pets today?*",
  },
];

export function AIProvider({ children }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("unicare_ai_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure apiKey is populated if empty
        if (!parsed.apiKey && parsed.provider === "gemini") {
          parsed.apiKey = PRECONFIGURED_GEMINI_KEY;
        }
        return { ...DEFAULT_CONFIG, ...parsed };
      }
      return DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("unicare_ai_messages");
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  const [isThinking, setIsThinking] = useState(false);
  const [providers, setProviders] = useState({});

  useEffect(() => {
    // Fetch available providers from server if accessible
    api.get("/ai/providers")
      .then((res) => {
        if (res.data?.providers) {
          setProviders(res.data.providers);
        }
      })
      .catch(() => {
        // Fallback static providers list if backend is starting
        setProviders({
          gemini: {
            name: "Google Gemini",
            default_model: "gemini-3.5-flash",
            models: ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.7-flash"],
            is_free: true,
            get_key_url: "https://aistudio.google.com/app/apikey"
          },
          groq: {
            name: "Groq Cloud",
            default_model: "llama-3.3-70b-versatile",
            models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "deepseek-r1-distill-llama-70b"],
            is_free: true,
            get_key_url: "https://console.groq.com/keys"
          }
        });
      });
  }, []);

  const updateConfig = (newSettings) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("unicare_ai_config", JSON.stringify(updated));
      return updated;
    });
  };

  // Direct client-side fallback calling (ensures 100% uptime even if local server port 5000 is stopped)
  const callDirectClientAI = async (conversationMessages, activeConfig) => {
    const provider = activeConfig.provider || "gemini";
    const apiKey = activeConfig.apiKey || PRECONFIGURED_GEMINI_KEY;
    const model = activeConfig.model || "gemini-3.5-flash";

    if (provider === "gemini") {
      const cleanModel = model.replace("models/", "");
      const modelsToTry = [cleanModel, "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.6-flash"];
      
      const contents = conversationMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const payload = {
        system_instruction: { parts: [{ text: DEFAULT_SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: activeConfig.temperature || 0.7, maxOutputTokens: 2048 },
      };

      for (const m of modelsToTry) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              return { content: text, provider: "gemini", model: m };
            }
          }
        } catch {
          // Continue to next fallback model
        }
      }
      throw new Error("Unable to reach Google Gemini directly. Please check your internet connection.");
    } else if (provider === "groq") {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: DEFAULT_SYSTEM_PROMPT },
            ...conversationMessages,
          ],
          temperature: activeConfig.temperature || 0.7,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Groq error (${res.status}): ${errText}`);
      }
      const data = await res.json();
      return {
        content: data.choices?.[0]?.message?.content || "No response generated.",
        provider: "groq",
        model: model,
      };
    }

    throw new Error("Direct client connection not supported for this provider without backend.");
  };

  const sendMessage = async (userContent) => {
    if (!userContent || !userContent.trim()) return;

    const userMessage = { role: "user", content: userContent.trim() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    localStorage.setItem("unicare_ai_messages", JSON.stringify(newHistory));

    setIsThinking(true);

    try {
      let aiContent = "";
      let providerName = config.provider;
      let modelName = config.model;

      try {
        // Attempt 1: Call backend API
        const payload = {
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          provider: config.provider,
          apiKey: config.apiKey || PRECONFIGURED_GEMINI_KEY,
          model: config.model || "gemini-3.5-flash",
          baseUrl: config.baseUrl || undefined,
          temperature: config.temperature || 0.7,
        };

        const response = await api.post("/ai/chat", payload);
        const data = response.data;
        aiContent = data.content || "No response generated.";
        providerName = data.provider || config.provider;
        modelName = data.model || config.model;
      } catch (backendError) {
        console.warn("Backend API unreachable, activating direct client fallback:", backendError.message);
        // Attempt 2: Fallback directly to provider API
        const directResult = await callDirectClientAI(newHistory, config);
        aiContent = directResult.content;
        providerName = directResult.provider;
        modelName = directResult.model;
      }

      const aiReply = {
        role: "assistant",
        content: aiContent,
        provider: providerName,
        model: modelName,
      };

      setMessages((prev) => {
        const finalMessages = [...prev, aiReply];
        localStorage.setItem("unicare_ai_messages", JSON.stringify(finalMessages));
        return finalMessages;
      });
    } catch (err) {
      console.error("AI Request Failed completely:", err);
      const errorMessage = {
        role: "assistant",
        content: `⚠️ **Connection Notice**: ${err.message || "Unable to reach AI service."}\n\nPlease check your internet connection or verify your API key in **AI Settings**.`,
        isError: true,
      };
      setMessages((prev) => {
        const finalMessages = [...prev, errorMessage];
        localStorage.setItem("unicare_ai_messages", JSON.stringify(finalMessages));
        return finalMessages;
      });
    } finally {
      setIsThinking(false);
    }
  };

  const testApiKey = async (provider, apiKey, model) => {
    try {
      const res = await api.post("/ai/test-key", { provider, apiKey, model });
      return res.data;
    } catch {
      // Direct test fallback
      try {
        const testRes = await callDirectClientAI(
          [{ role: "user", content: "Reply with 'API key is verified and connected!' in one short sentence." }],
          { provider, apiKey, model, temperature: 0.1 }
        );
        return { success: true, message: `Successfully connected to ${provider.toUpperCase()} (${testRes.model})!`, response: testRes.content };
      } catch (directErr) {
        return { success: false, message: directErr.message || "Failed to validate API key." };
      }
    }
  };

  const clearMessages = () => {
    setMessages(initialMessages);
    localStorage.setItem("unicare_ai_messages", JSON.stringify(initialMessages));
  };

  return (
    <AIContext.Provider
      value={{
        messages,
        sendMessage,
        clearMessages,
        isThinking,
        config,
        updateConfig,
        providers,
        testApiKey,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAI = () => useContext(AIContext);
