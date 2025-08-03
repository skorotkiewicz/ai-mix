import { useState } from "react";
import { Code, Copy, Check } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function CodeGenerator() {
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [complexity, setComplexity] = useState("simple");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const languages = {
    javascript: "JavaScript",
    python: "Python",
    java: "Java",
    cpp: "C++",
    csharp: "C#",
    php: "PHP",
    go: "Go",
    rust: "Rust",
  };

  const complexities = {
    simple: "Prosty (podstawowa funkcjonalność)",
    intermediate: "Średni (z dodatkowymi funkcjami)",
    advanced: "Zaawansowany (kompletna implementacja)",
  };

  const generateCode = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    setError("");

    const complexityInstructions = {
      simple: "prostą i podstawową implementację",
      intermediate:
        "średnio zaawansowaną implementację z dodatkowymi funkcjami",
      advanced:
        "zaawansowaną, kompletną implementację z obsługą błędów i dokumentacją",
    };

    const prompt = `Napisz ${complexityInstructions[complexity]} w języku ${languages[language]} dla następującego opisu:

${description}

Zwróć tylko kod bez dodatkowych komentarzy. Kod powinien być czytelny i dobrze sformatowany.`;

    try {
      const response = await OllamaAPI.generateText(prompt, "llama3.2", {
        temperature: 0.2,
      });
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <Code size={20} />
        </div>
        <h3 className="card-title">Generator Kodu</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">Opis funkcjonalności</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Np. Funkcja do sortowania tablicy obiektów według daty..."
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
          <label className="form-label">Język programowania</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-select"
          >
            {Object.entries(languages).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Poziom złożoności</label>
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            className="form-select"
          >
            {Object.entries(complexities).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={generateCode}
        disabled={isLoading || !description.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <Code size={16} />
        )}
        Generuj Kod
      </button>

      {result && (
        <div className="result-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "calc(var(--spacing-unit) * 2)",
            }}
          >
            <div className="result-title">
              Wygenerowany kod ({languages[language]}):
            </div>
            <button
              type="button"
              onClick={copyToClipboard}
              className="copy-button"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div className="code-block">
            <pre>
              <code>{result}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
