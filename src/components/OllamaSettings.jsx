import { useState, useEffect } from "react";
import { Settings, RefreshCw, CheckCircle, XCircle, X, Save } from "lucide-react";
import { useOllama } from "../contexts/OllamaContext";
import useTranslate from "../utils/useTranslate";

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
  const { t } = useTranslate();

  useEffect(() => {
    setUrlInput(ollamaUrl);
  }, [ollamaUrl]);

  const handleUrlChange = (e) => {
    setUrlInput(e.target.value);
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    let formattedUrl = urlInput.trim();

    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
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
        <h3 className="card-title">{t("ollamaSettings.title")}</h3>
        {onClose && (
          <button type="button" onClick={onClose} className="modal-close-button">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="card-content modal-content">
        <div className="content-layout">
          {/* Status połączenia */}
          <div className={`connection-status ${isConnected ? "connected" : "disconnected"}`}>
            {isConnected ? (
              <CheckCircle size={20} style={{ color: "var(--success-color)" }} />
            ) : (
              <XCircle size={20} style={{ color: "var(--error-color)" }} />
            )}
            <div>
              <div
                className="connection-status-title"
                style={{
                  color: isConnected ? "var(--success-color)" : "var(--error-color)",
                }}
              >
                {isConnected
                  ? t("ollamaSettings.connectionStatus.connected")
                  : t("ollamaSettings.connectionStatus.disconnected")}
              </div>
              <div className="connection-status-subtitle">
                {isConnected
                  ? t("ollamaSettings.connectionStatus.modelsFound", {
                      count: availableModels.length,
                    })
                  : t("ollamaSettings.connectionStatus.checkConnection")}
              </div>
            </div>
          </div>

          {/* Konfiguracja URL */}
          <div className="form-section">
            <label className="form-label-enhanced">{t("ollamaSettings.urlLabel")}</label>
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
                {isChecking ? t("ollamaSettings.checking") : t("ollamaSettings.save")}
              </button>
            </form>
            <div className="form-hint">{t("ollamaSettings.urlHint")}</div>
          </div>

          {/* Test połączenia */}
          <button
            type="button"
            onClick={testConnection}
            disabled={isChecking}
            className="button-secondary button-enhanced button-secondary-enhanced"
          >
            <RefreshCw size={16} className={isChecking ? "spinning-icon" : ""} />
            {isChecking ? t("ollamaSettings.checking") : t("ollamaSettings.testConnection")}
          </button>

          {/* Wybór modelu */}
          {availableModels.length > 0 && (
            <div className="form-section">
              <label className="form-label-enhanced">{t("ollamaSettings.modelLabel")}</label>
              <select
                value={selectedModel}
                onChange={handleModelChange}
                className="select-enhanced"
              >
                {availableModels.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name} ({(model.size / 1024 / 1024 / 1024).toFixed(1)} GB)
                  </option>
                ))}
              </select>
              <div className="form-hint">
                {t("ollamaSettings.selectedModel", { model: selectedModel })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
