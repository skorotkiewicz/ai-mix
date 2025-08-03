import { createContext, useContext, useState, useEffect } from "react";

const OllamaContext = createContext();

export function OllamaProvider({ children }) {
  const [ollamaUrl, setOllamaUrl] = useState(
    () => localStorage.getItem("ollamaUrl") || "http://localhost:11434",
  );
  const [selectedModel, setSelectedModel] = useState(
    () => localStorage.getItem("selectedModel") || "llama3.2",
  );
  const [availableModels, setAvailableModels] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    localStorage.setItem("ollamaUrl", ollamaUrl);
  }, [ollamaUrl]);

  useEffect(() => {
    localStorage.setItem("selectedModel", selectedModel);
  }, [selectedModel]);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${ollamaUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data.models || []);
        setIsConnected(true);
        return true;
      } else {
        setIsConnected(false);
        setAvailableModels([]);
        return false;
      }
    } catch (_error) {
      setIsConnected(false);
      setAvailableModels([]);
      return false;
    }
  };

  const updateOllamaUrl = (url) => {
    setOllamaUrl(url);
    setIsConnected(false);
    setAvailableModels([]);
  };

  const value = {
    ollamaUrl,
    selectedModel,
    availableModels,
    isConnected,
    setSelectedModel,
    updateOllamaUrl,
    checkConnection,
  };

  return (
    <OllamaContext.Provider value={value}>{children}</OllamaContext.Provider>
  );
}

export function useOllama() {
  const context = useContext(OllamaContext);
  if (!context) {
    throw new Error("useOllama must be used within an OllamaProvider");
  }
  return context;
}
