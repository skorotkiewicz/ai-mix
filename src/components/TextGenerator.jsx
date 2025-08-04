import { useState } from "react";
import { FileText, Wand2 } from "lucide-react";
import { OllamaAPI } from "../services/ollamaAPI";
import useTranslate from "../utils/useTranslate";

export function TextGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("creative");
  const [length, setLength] = useState("medium");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslate();

  const styles = {
    creative: t("textGenerator.styles.creative"),
    professional: t("textGenerator.styles.professional"),
    casual: t("textGenerator.styles.casual"),
    academic: t("textGenerator.styles.academic"),
    humorous: t("textGenerator.styles.humorous"),
  };

  const lengths = {
    short: t("textGenerator.lengths.short"),
    medium: t("textGenerator.lengths.medium"),
    long: t("textGenerator.lengths.long"),
  };

  const generateText = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");

    const lengthInstructions = {
      short: t("textGenerator.lengthInstructions.short"),
      medium: t("textGenerator.lengthInstructions.medium"),
      long: t("textGenerator.lengthInstructions.long"),
    };

    const styleInstructions = {
      creative: t("textGenerator.styleInstructions.creative"),
      professional: t("textGenerator.styleInstructions.professional"),
      casual: t("textGenerator.styleInstructions.casual"),
      academic: t("textGenerator.styleInstructions.academic"),
      humorous: t("textGenerator.styleInstructions.humorous"),
    };

    const fullPrompt = t("textGenerator.prompt", {
      lengthInstruction: lengthInstructions[length],
      styleInstruction: styleInstructions[style],
      topic: prompt,
    });

    try {
      const response = await OllamaAPI.generateText(fullPrompt, null, {
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
        <h3 className="card-title">{t("textGenerator.title")}</h3>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label className="form-label">{t("textGenerator.topicLabel")}</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("textGenerator.topicPlaceholder")}
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
          <label className="form-label">{t("textGenerator.styleLabel")}</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="form-select">
            {Object.entries(styles).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">{t("textGenerator.lengthLabel")}</label>
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
        {isLoading ? <div className="loading-spinner" /> : <Wand2 size={16} />}
        {t("textGenerator.generate")}
      </button>

      {result && (
        <div className="result-container">
          <div className="result-title">{t("textGenerator.resultTitle")}</div>
          <div className="result-text">{result}</div>
        </div>
      )}
    </div>
  );
}
