import { useState } from "react";
import { Languages, ArrowRight } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function Translator() {
  const [inputText, setInputText] = useState("");
  const [targetLang, setTargetLang] = useState("english");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const languages = {
    english: "Angielski",
    spanish: "Hiszpański",
    french: "Francuski",
    german: "Niemiecki",
    italian: "Włoski",
    portuguese: "Portugalski",
    russian: "Rosyjski",
    chinese: "Chiński",
    japanese: "Japoński",
    korean: "Koreański",
  };

  const translateText = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = `Przetłumacz następujący tekst na język ${languages[targetLang]}. Zwróć tylko przetłumaczony tekst bez dodatkowych komentarzy:

${inputText}`;

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.3,
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
          <Languages size={20} />
        </div>
        <h3 className="card-title">Tłumacz AI</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">Tekst do tłumaczenia</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Wprowadź tekst do przetłumaczenia..."
          className="form-textarea"
          style={{ minHeight: "120px" }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Język docelowy</label>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="form-select"
        >
          {Object.entries(languages).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={translateText}
        disabled={isLoading || !inputText.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner" />
        ) : (
          <ArrowRight size={16} />
        )}
        Przetłumacz
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">
            Tłumaczenie na {languages[targetLang]}:
          </div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
