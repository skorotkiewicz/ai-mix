import { useState, useEffect } from "react";
import {
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  X,
  Save,
} from "lucide-react";
import { useOllama } from "../contexts/OllamaContext";

export function OllamaSettings({ onClose }) {
  const {
    ollamaUrl,
    selectedModel,
    availableModels,
    isConnected,
    setSelectedModel,
    updateOllamaUrl,
    checkConnection,
  } = useOllama();

  const [urlInput, setUrlInput] = useState(ollamaUrl);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    setUrlInput(ollamaUrl);
  }, [ollamaUrl]);

  const handleUrlChange = (e) => {
    setUrlInput(e.target.value);
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    let formattedUrl = urlInput.trim();

    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = `http://${formattedUrl}`;
    }

    if (formattedUrl.endsWith("/")) {
      formattedUrl = formattedUrl.slice(0, -1);
    }

    updateOllamaUrl(formattedUrl);
    setUrlInput(formattedUrl);
    await testConnection();
  };

  const testConnection = async () => {
    setIsChecking(true);
    await checkConnection();
    setIsChecking(false);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  return (
    <div className="card modal-card">
      <div className="card-header ">
        {/* <div className="card-header modal-header"> */}
        <div className="card-icon">
          <Settings size={24} />
        </div>
        <h3 className="card-title">Ustawienia Ollama</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="modal-close-button"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="card-content modal-content">
        <div className="content-layout">
          {/* Status połączenia */}
          <div
            className={`connection-status ${
              isConnected ? "connected" : "disconnected"
            }`}
          >
            {isConnected ? (
              <CheckCircle
                size={20}
                style={{ color: "var(--success-color)" }}
              />
            ) : (
              <XCircle size={20} style={{ color: "var(--error-color)" }} />
            )}
            <div>
              <div
                className="connection-status-title"
                style={{
                  color: isConnected
                    ? "var(--success-color)"
                    : "var(--error-color)",
                }}
              >
                {isConnected
                  ? "Połączono z Ollama"
                  : "Brak połączenia z Ollama"}
              </div>
              <div className="connection-status-subtitle">
                {isConnected
                  ? `Znaleziono ${availableModels.length} modeli`
                  : "Sprawdź URL i upewnij się, że Ollama jest uruchomiona"}
              </div>
            </div>
          </div>

          {/* Konfiguracja URL */}
          <div className="form-section">
            <label className="form-label-enhanced">URL Ollama</label>
            <form onSubmit={handleUrlSubmit} className="form-row">
              <input
                type="text"
                value={urlInput}
                onChange={handleUrlChange}
                placeholder="http://localhost:11434"
                className="form-input-enhanced"
              />
              <button
                type="submit"
                className="button-primary button-enhanced button-primary-enhanced"
                disabled={isChecking}
              >
                <Save size={20} />
                {isChecking ? "Sprawdzanie..." : "Zapisz"}
              </button>
            </form>
            <div className="form-hint">
              Przykład: http://localhost:11434 lub http://192.168.1.100:11434
            </div>
          </div>

          {/* Test połączenia */}
          <button
            type="button"
            onClick={testConnection}
            disabled={isChecking}
            className="button-secondary button-enhanced button-secondary-enhanced"
          >
            <RefreshCw
              size={16}
              className={isChecking ? "spinning-icon" : ""}
            />
            {isChecking ? "Sprawdzanie..." : "Sprawdź połączenie"}
          </button>

          {/* Wybór modelu */}
          {availableModels.length > 0 && (
            <div className="form-section">
              <label className="form-label-enhanced">Model</label>
              <select
                value={selectedModel}
                onChange={handleModelChange}
                className="select-enhanced"
              >
                {availableModels.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name} ({(model.size / 1024 / 1024 / 1024).toFixed(1)}{" "}
                    GB)
                  </option>
                ))}
              </select>
              <div className="form-hint">Wybrany model: {selectedModel}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
