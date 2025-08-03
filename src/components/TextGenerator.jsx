import { useState } from "react";
import { FileText, Wand2 } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function TextGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("creative");
  const [length, setLength] = useState("medium");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const styles = {
    creative: "Kreatywny i ekspresyjny",
    professional: "Profesjonalny i formalny",
    casual: "Swobodny i przyjazny",
    academic: "Akademicki i naukowy",
    humorous: "Humorystyczny i zabawny",
  };

  const lengths = {
    short: "Krótki (1-2 akapity)",
    medium: "Średni (3-4 akapity)",
    long: "Długi (5+ akapitów)",
  };

  const generateText = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");

    const lengthInstructions = {
      short: "Napisz krótki tekst (1-2 akapity)",
      medium: "Napisz tekst średniej długości (3-4 akapity)",
      long: "Napisz długi, szczegółowy tekst (5+ akapitów)",
    };

    const styleInstructions = {
      creative: "w kreatywnym, ekspresyjnym stylu",
      professional: "w profesjonalnym, formalnym stylu",
      casual: "w swobodnym, przyjaznym stylu",
      academic: "w akademickim, naukowym stylu",
      humorous: "w humorystycznym, zabawnym stylu",
    };

    const fullPrompt = `${lengthInstructions[length]} ${styleInstructions[style]} na temat: ${prompt}`;

    try {
      const response = await OllamaAPI.generateText(fullPrompt, "llama3.2", {
        temperature: style === "creative" ? 0.9 : 0.7,
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <FileText size={20} />
        </div>
        <h3 className="card-title">Generator Tekstu</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">Temat do napisania</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Np. Przyszłość sztucznej inteligencji w medycynie..."
          className="form-textarea"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "calc(var(--spacing-unit) * 2)",
        }}
      >
        <div className="form-group">
          <label className="form-label">Styl pisania</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="form-select"
          >
            {Object.entries(styles).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Długość tekstu</label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="form-select"
          >
            {Object.entries(lengths).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={generateText}
        disabled={isLoading || !prompt.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <Wand2 size={16} />
        )}
        Generuj Tekst
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">Wygenerowany tekst:</div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
