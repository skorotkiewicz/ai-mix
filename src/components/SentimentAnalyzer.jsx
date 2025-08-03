import { useState } from "react";
import { Heart, Frown, Meh, Smile } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function SentimentAnalyzer() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = t('sentimentAnalyzer.prompt', { text });

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
        throw new Error(t('sentimentAnalyzer.errors.parsing'));
      }
    } catch (_err) {
      setError(t('sentimentAnalyzer.errors.analysis'));
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
        <h3 className="card-title">{t('sentimentAnalyzer.title')}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">{t('sentimentAnalyzer.textLabel')}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('sentimentAnalyzer.textPlaceholder')}
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
        {isLoading ? <div className="loading-spinner" /> : <Heart size={16} />}
        {t('sentimentAnalyzer.analyze')}
      </button>

      {sentiment && (
        <div className="result-container">
          <div className="result-title">{t('sentimentAnalyzer.resultTitle')}</div>

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
              {t(`sentimentAnalyzer.sentiments.${sentiment}`)}
            </div>
            <div style={{ color: "var(--text-secondary)" }}>
              {t('sentimentAnalyzer.confidence', { percent: Math.round(confidence * 100) })}
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>

          {explanation && (
            <div
              style={{
                marginTop: "calc(var(--spacing-unit) * 2)",
                color: "var(--text-secondary)",
              }}
            >
              <strong>{t('sentimentAnalyzer.explanation')}</strong> {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
