import { useState } from "react";
import { Globe, Search } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function LanguageDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sampleTexts = [
    {
      lang: "Francuski",
      text: "Bonjour, comment allez-vous? J'espère que vous passez une excellente journée.",
    },
    {
      lang: "Hiszpański",
      text: "Hola, ¿cómo estás? Me gusta mucho la comida española y la cultura.",
    },
    {
      lang: "Niemiecki",
      text: "Guten Tag! Wie geht es Ihnen? Deutschland ist ein wunderschönes Land.",
    },
    {
      lang: "Włoski",
      text: "Ciao! Come stai? L'Italia ha una cucina fantastica e una storia ricca.",
    },
  ];

  const detectLanguage = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = `Wykryj język następującego tekstu i odpowiedz w formacie JSON:
{
  "language": "nazwa języka po polsku",
  "code": "kod ISO (np. en, pl, fr)",
  "confidence": 0.95,
  "characteristics": "krótki opis charakterystycznych cech tego języka w tekście"
}

Tekst do analizy:
"${text}"

Odpowiedz tylko w formacie JSON:`;

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.1,
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        setResult(analysis);
      } else {
        throw new Error("Nie udało się wykryć języka");
      }
    } catch (_err) {
      setError("Błąd podczas wykrywania języka. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <Globe size={20} />
        </div>
        <h3 className="card-title">Detektor Języka</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
        <div className="form-label">Przykładowe teksty:</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "calc(var(--spacing-unit) * 1)",
          }}
        >
          {sampleTexts.map((sample, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setText(sample.text)}
              className="btn btn-secondary"
              style={{
                fontSize: "0.8rem",
                padding: "calc(var(--spacing-unit) * 1.5)",
                textAlign: "left",
                justifyContent: "flex-start",
              }}
            >
              <strong>{sample.lang}:</strong> {sample.text.substring(0, 50)}...
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tekst do analizy</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wprowadź tekst w dowolnym języku..."
          className="form-textarea"
          style={{ minHeight: "120px" }}
        />
      </div>

      <button
        type="button"
        onClick={detectLanguage}
        disabled={isLoading || !text.trim()}
        className="btn"
      >
        {isLoading ? <div className="loading-spinner" /> : <Search size={16} />}
        Wykryj Język
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">Wykryty język:</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "calc(var(--spacing-unit) * 3)",
              marginBottom: "calc(var(--spacing-unit) * 3)",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "1.25rem",
                  color: "var(--accent-color)",
                }}
              >
                {result.language}
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Kod: {result.code}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "var(--success-color)",
                }}
              >
                {Math.round((result.confidence || 0) * 100)}%
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Pewność
              </div>
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(result.confidence || 0) * 100}%` }}
            />
          </div>

          {result.characteristics && (
            <div style={{ marginTop: "calc(var(--spacing-unit) * 3)" }}>
              <div
                style={{
                  fontWeight: "500",
                  marginBottom: "calc(var(--spacing-unit) * 1)",
                }}
              >
                Charakterystyka:
              </div>
              <div style={{ color: "var(--text-secondary)" }}>
                {result.characteristics}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
