import { useState, useEffect } from "react";
import { Settings, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useOllama } from "../contexts/OllamaContext";

export function OllamaSettings() {
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
    <div className="card">
      <div className="card-header">
        <div className="card-icon">
          <Settings size={24} />
        </div>
        <h3 className="card-title">Ustawienia Ollama</h3>
      </div>

      <div className="card-content">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "calc(var(--spacing-unit) * 3)",
          }}
        >
          {/* Status połączenia */}
          <div
            style={{
              padding: "calc(var(--spacing-unit) * 2)",
              borderRadius: "var(--border-radius)",
              backgroundColor: isConnected
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
              border: `1px solid ${isConnected ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
              display: "flex",
              alignItems: "center",
              gap: "calc(var(--spacing-unit) * 2)",
            }}
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
                style={{
                  fontWeight: "600",
                  color: isConnected
                    ? "var(--success-color)"
                    : "var(--error-color)",
                }}
              >
                {isConnected
                  ? "Połączono z Ollama"
                  : "Brak połączenia z Ollama"}
              </div>
              <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                {isConnected
                  ? `Znaleziono ${availableModels.length} modeli`
                  : "Sprawdź URL i upewnij się, że Ollama jest uruchomiona"}
              </div>
            </div>
          </div>

          {/* Konfiguracja URL */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "calc(var(--spacing-unit) * 1)",
                fontWeight: "600",
              }}
            >
              URL Ollama
            </label>
            <form
              onSubmit={handleUrlSubmit}
              style={{ display: "flex", gap: "calc(var(--spacing-unit) * 2)" }}
            >
              <input
                type="text"
                value={urlInput}
                onChange={handleUrlChange}
                placeholder="http://localhost:11434"
                className="input-field"
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className="button-primary"
                disabled={isChecking}
              >
                {isChecking ? "Sprawdzanie..." : "Zapisz"}
              </button>
            </form>
            <div
              style={{
                fontSize: "0.875rem",
                opacity: 0.7,
                marginTop: "calc(var(--spacing-unit) * 1)",
              }}
            >
              Przykład: http://localhost:11434 lub http://192.168.1.100:11434
            </div>
          </div>

          {/* Test połączenia */}
          <button
            type="button"
            onClick={testConnection}
            disabled={isChecking}
            className="button-secondary"
            style={{ alignSelf: "flex-start" }}
          >
            <RefreshCw
              size={16}
              style={{ marginRight: "calc(var(--spacing-unit) * 1)" }}
            />
            {isChecking ? "Sprawdzanie..." : "Sprawdź połączenie"}
          </button>

          {/* Wybór modelu */}
          {availableModels.length > 0 && (
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "calc(var(--spacing-unit) * 1)",
                  fontWeight: "600",
                }}
              >
                Model
              </label>
              <select
                value={selectedModel}
                onChange={handleModelChange}
                className="input-field"
              >
                {availableModels.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name} ({(model.size / 1024 / 1024 / 1024).toFixed(1)}{" "}
                    GB)
                  </option>
                ))}
              </select>
              <div
                style={{
                  fontSize: "0.875rem",
                  opacity: 0.7,
                  marginTop: "calc(var(--spacing-unit) * 1)",
                }}
              >
                Wybrany model: {selectedModel}
              </div>
            </div>
          )}

          {/* Lista dostępnych modeli */}
          {/* {availableModels.length > 0 && (
            <div>
              <h3 style={{ marginBottom: "calc(var(--spacing-unit) * 2)" }}>
                Dostępne modele ({availableModels.length})
              </h3>
              <div
                style={{
                  display: "grid",
                  gap: "calc(var(--spacing-unit) * 2)",
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "calc(var(--spacing-unit) * 2)",
                  backgroundColor: "var(--surface-color)",
                  borderRadius: "var(--border-radius)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {availableModels.map((model) => (
                  <div
                    key={model.name}
                    style={{
                      padding: "calc(var(--spacing-unit) * 2)",
                      backgroundColor:
                        selectedModel === model.name
                          ? "var(--primary-color-light)"
                          : "transparent",
                      borderRadius: "var(--border-radius)",
                      border:
                        selectedModel === model.name
                          ? "1px solid var(--primary-color)"
                          : "1px solid var(--border-color)",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedModel(model.name)}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        marginBottom: "calc(var(--spacing-unit) * 1)",
                      }}
                    >
                      {model.name}
                    </div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                      Rozmiar: {(model.size / 1024 / 1024 / 1024).toFixed(1)} GB
                    </div>
                    {model.modified_at && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          opacity: 0.6,
                          marginTop: "calc(var(--spacing-unit) * 0.5)",
                        }}
                      >
                        Zaktualizowano:{" "}
                        {new Date(model.modified_at).toLocaleDateString(
                          "pl-PL",
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
