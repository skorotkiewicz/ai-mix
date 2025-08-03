import { useState } from "react";
import { BarChart3, FileSearch } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function TextAnalyzer() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = `Przeanalizuj następujący tekst i odpowiedz w formacie JSON:
{
  "word_count": 150,
  "readability": "łatwy/średni/trudny",
  "tone": "formalny/nieformalny/neutralny",
  "key_topics": ["temat1", "temat2", "temat3"],
  "complexity_level": "podstawowy/średniozaawansowany/zaawansowany",
  "target_audience": "opisz dla kogo może być ten tekst",
  "strengths": ["mocna strona 1", "mocna strona 2"],
  "suggestions": ["sugestia poprawy 1", "sugestia poprawy 2"]
}

Tekst do analizy:
"${text}"

Odpowiedz tylko w formacie JSON bez dodatkowych komentarzy:`;

    try {
      const response = await OllamaAPI.generateText(prompt, "llama3.2", {
        temperature: 0.2,
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setAnalysis(result);
      } else {
        throw new Error("Nie udało się przeanalizować tekstu");
      }
    } catch (_err) {
      setError("Błąd podczas analizy tekstu. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  const getReadabilityColor = (readability) => {
    switch (readability?.toLowerCase()) {
      case "łatwy":
        return "var(--success-color)";
      case "średni":
        return "var(--warning-color)";
      case "trudny":
        return "var(--error-color)";
      default:
        return "var(--text-secondary)";
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity?.toLowerCase()) {
      case "podstawowy":
        return "var(--success-color)";
      case "średniozaawansowany":
        return "var(--warning-color)";
      case "zaawansowany":
        return "var(--error-color)";
      default:
        return "var(--text-secondary)";
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <BarChart3 size={20} />
        </div>
        <h3 className="card-title">Analizator Tekstu</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">Tekst do analizy</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wklej tutaj tekst do szczegółowej analizy..."
          className="form-textarea"
          style={{ minHeight: "150px" }}
        />
      </div>

      <button
        type="button"
        onClick={analyzeText}
        disabled={isLoading || !text.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <FileSearch size={16} />
        )}
        Analizuj Tekst
      </button>

      {analysis && (
        <div className="result-container">
          <div className="result-title">Analiza tekstu:</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "calc(var(--spacing-unit) * 2)",
              marginBottom: "calc(var(--spacing-unit) * 3)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "calc(var(--spacing-unit) * 2)",
                background: "var(--background-card)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "var(--accent-color)",
                }}
              >
                {analysis.word_count}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Słów
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "calc(var(--spacing-unit) * 2)",
                background: "var(--background-card)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: getReadabilityColor(analysis.readability),
                }}
              >
                {analysis.readability}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Czytelność
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "calc(var(--spacing-unit) * 2)",
                background: "var(--background-card)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                }}
              >
                {analysis.tone}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Ton
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "calc(var(--spacing-unit) * 2)",
                background: "var(--background-card)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: getComplexityColor(analysis.complexity_level),
                }}
              >
                {analysis.complexity_level}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Poziom
              </div>
            </div>
          </div>

          {analysis.key_topics && analysis.key_topics.length > 0 && (
            <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
              <div
                style={{
                  fontWeight: "500",
                  marginBottom: "calc(var(--spacing-unit) * 2)",
                }}
              >
                Kluczowe tematy:
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "calc(var(--spacing-unit) * 1)",
                }}
              >
                {analysis.key_topics.map((topic, index) => (
                  <span
                    key={index}
                    style={{
                      padding:
                        "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
                      background: "var(--accent-color)",
                      color: "var(--text-primary)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.target_audience && (
            <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
              <div
                style={{
                  fontWeight: "500",
                  marginBottom: "calc(var(--spacing-unit) * 1)",
                }}
              >
                Grupa docelowa:
              </div>
              <div style={{ color: "var(--text-secondary)" }}>
                {analysis.target_audience}
              </div>
            </div>
          )}

          {analysis.strengths && analysis.strengths.length > 0 && (
            <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
              <div
                style={{
                  fontWeight: "500",
                  marginBottom: "calc(var(--spacing-unit) * 2)",
                  color: "var(--success-color)",
                }}
              >
                Mocne strony:
              </div>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {analysis.strengths.map((strength, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "calc(var(--spacing-unit) * 1)",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "calc(var(--spacing-unit) * 1)",
                    }}
                  >
                    <span style={{ color: "var(--success-color)" }}>✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div>
              <div
                style={{
                  fontWeight: "500",
                  marginBottom: "calc(var(--spacing-unit) * 2)",
                  color: "var(--warning-color)",
                }}
              >
                Sugestie poprawy:
              </div>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {analysis.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "calc(var(--spacing-unit) * 1)",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "calc(var(--spacing-unit) * 1)",
                    }}
                  >
                    <span style={{ color: "var(--warning-color)" }}>💡</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
