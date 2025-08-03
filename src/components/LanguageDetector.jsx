import { useState } from "react";
import { Globe, Search } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function LanguageDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const sampleTexts = [
    {
      lang: t('languageDetector.sampleTexts.french'),
      text: "Bonjour, comment allez-vous? J'espère que vous passez une excellente journée.",
    },
    {
      lang: t('languageDetector.sampleTexts.spanish'),
      text: "Hola, ¿cómo estás? Me gusta mucho la comida española y la cultura.",
    },
    {
      lang: t('languageDetector.sampleTexts.german'),
      text: "Guten Tag! Wie geht es Ihnen? Deutschland ist ein wunderschönes Land.",
    },
    {
      lang: t('languageDetector.sampleTexts.italian'),
      text: "Ciao! Come stai? L'Italia ha una cucina fantastica e una storia ricca.",
    },
  ];

  const detectLanguage = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = t('languageDetector.prompt', { text });

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.1,
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        setResult(analysis);
      } else {
        throw new Error(t('languageDetector.errors.parsing'));
      }
    } catch (_err) {
      setError(t('languageDetector.errors.detection'));
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
        <h3 className="card-title">{t('languageDetector.title')}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: "calc(var(--spacing-unit) * 3)" }}>
        <div className="form-label">{t('languageDetector.samplesLabel')}</div>
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
        <label className="form-label">{t('languageDetector.textLabel')}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('languageDetector.textPlaceholder')}
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
        {t('languageDetector.detect')}
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">{t('languageDetector.resultTitle')}</div>

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
                {t('languageDetector.codeLabel')} {result.code}
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
                {t('languageDetector.confidenceLabel')}
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
                {t('languageDetector.characteristicsLabel')}
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
