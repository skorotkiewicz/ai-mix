import { useState } from "react";
import { Heart, Frown, Meh, Smile } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";

export function SentimentAnalyzer() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = `Przeanalizuj sentiment następującego tekstu i odpowiedz w formacie JSON:
{
  "sentiment": "positive/negative/neutral",
  "confidence": 0.85,
  "explanation": "krótkie wyjaśnienie dlaczego taki sentiment"
}

Tekst do analizy:
"${text}"

Odpowiedz tylko w formacie JSON bez dodatkowych komentarzy:`;

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.1,
      });

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        setSentiment(analysis.sentiment);
        setConfidence(analysis.confidence || 0);
        setExplanation(analysis.explanation || "");
      } else {
        throw new Error("Nie udało się przeanalizować sentimentu");
      }
    } catch (_err) {
      setError("Błąd podczas analizy sentimentu. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = () => {
    switch (sentiment) {
      case "positive":
        return <Smile size={20} />;
      case "negative":
        return <Frown size={20} />;
      case "neutral":
        return <Meh size={20} />;
      default:
        return <Heart size={20} />;
    }
  };

  const getSentimentClass = () => {
    switch (sentiment) {
      case "positive":
        return "sentiment-positive";
      case "negative":
        return "sentiment-negative";
      default:
        return "sentiment-neutral";
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon">
          <Heart size={20} />
        </div>
        <h3 className="card-title">Analiza Sentimentu</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">Tekst do analizy</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wprowadź tekst do analizy sentimentu..."
          className="form-textarea"
          style={{ minHeight: "120px" }}
        />
      </div>

      <button
        type="button"
        onClick={analyzeSentiment}
        disabled={isLoading || !text.trim()}
        className="btn"
      >
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <Heart size={16} />
        )}
        Analizuj Sentiment
      </button>

      {sentiment && (
        <div className="result-container">
          <div className="result-title">Wynik analizy:</div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "calc(var(--spacing-unit) * 2)",
              marginBottom: "calc(var(--spacing-unit) * 2)",
            }}
          >
            <div className={`sentiment-indicator ${getSentimentClass()}`}>
              {getSentimentIcon()}
              {sentiment === "positive"
                ? "Pozytywny"
                : sentiment === "negative"
                  ? "Negatywny"
                  : "Neutralny"}
            </div>
            <div style={{ color: "var(--text-secondary)" }}>
              Pewność: {Math.round(confidence * 100)}%
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>

          {explanation && (
            <div
              style={{
                marginTop: "calc(var(--spacing-unit) * 2)",
                color: "var(--text-secondary)",
              }}
            >
              <strong>Wyjaśnienie:</strong> {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
