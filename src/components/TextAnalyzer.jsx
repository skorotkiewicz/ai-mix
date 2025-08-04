import { useState } from "react";
import { BarChart3, FileSearch } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function TextAnalyzer() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError("");

    const prompt = t("textAnalyzer.prompt", { text });

    try {
      const response = await OllamaAPI.generateText(prompt, null, {
        temperature: 0.2,
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setAnalysis(result);
      } else {
        throw new Error(t("textAnalyzer.errors.parsing"));
      }
    } catch (_err) {
      setError(t("textAnalyzer.errors.analysis"));
    } finally {
      setIsLoading(false);
    }
  };

  const getReadabilityColor = (readability) => {
    const easyText = t("textAnalyzer.readabilityLevels.easy");
    const mediumText = t("textAnalyzer.readabilityLevels.medium");
    const hardText = t("textAnalyzer.readabilityLevels.hard");

    switch (readability?.toLowerCase()) {
      case easyText.toLowerCase():
        return "var(--success-color)";
      case mediumText.toLowerCase():
        return "var(--warning-color)";
      case hardText.toLowerCase():
        return "var(--error-color)";
      default:
        return "var(--text-secondary)";
    }
  };

  const getComplexityColor = (complexity) => {
    const basicText = t("textAnalyzer.complexityLevels.basic");
    const intermediateText = t("textAnalyzer.complexityLevels.intermediate");
    const advancedText = t("textAnalyzer.complexityLevels.advanced");

    switch (complexity?.toLowerCase()) {
      case basicText.toLowerCase():
        return "var(--success-color)";
      case intermediateText.toLowerCase():
        return "var(--warning-color)";
      case advancedText.toLowerCase():
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
        <h3 className="card-title">{t("textAnalyzer.title")}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">{t("textAnalyzer.textLabel")}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("textAnalyzer.textPlaceholder")}
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
        {isLoading ? <div className="loading-spinner" /> : <FileSearch size={16} />}
        {t("textAnalyzer.analyze")}
      </button>

      {analysis && (
        <div className="result-container">
          <div className="result-title">{t("textAnalyzer.resultTitle")}</div>

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
                {t("textAnalyzer.metrics.words")}
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
                {t("textAnalyzer.metrics.readability")}
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
                {t("textAnalyzer.metrics.tone")}
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
                {t("textAnalyzer.metrics.level")}
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
                {t("textAnalyzer.sections.keyTopics")}
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
                      padding: "calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2)",
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
                {t("textAnalyzer.sections.targetAudience")}
              </div>
              <div style={{ color: "var(--text-secondary)" }}>{analysis.target_audience}</div>
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
                {t("textAnalyzer.sections.strengths")}
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
                {t("textAnalyzer.sections.suggestions")}
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
